import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_URL } from '../utils';

const EditNotes = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [field, setField] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchingNote, setFetchingNote] = useState(true);
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState(0);
    const navigate = useNavigate();
    const { id } = useParams();

    const axiosJWT = axios.create();

    // Function to refresh token (same as Dashboard)
    const refreshToken = useCallback(async () => {
        try {
            const response = await axios.get(`${BASE_URL}/token`, {
                withCredentials: true // This is important for sending cookies
            });
            setToken(response.data.accessToken);
            const decoded = jwtDecode(response.data.accessToken);
            setExpire(decoded.exp);
            return response.data.accessToken;
        } catch (error) {
            console.log("Error refreshing token:", error);
            navigate("/");
            throw error;
        }
    }, [navigate]);

    // Axios interceptor for automatic token refresh (same as Dashboard)
    axiosJWT.interceptors.request.use(
        async (config) => {
            const currentDate = new Date();

            if (expire * 1000 < currentDate.getTime()) {
                try {
                    const newToken = await refreshToken();
                    config.headers.Authorization = `Bearer ${newToken}`;
                } catch (error) {
                    return Promise.reject(error);
                }
            } else {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            navigate("/");
            return Promise.reject(error);
        }
    );

    // Initialize token and get note data
    useEffect(() => {
        const initializeEditPage = async () => {
            try {
                await refreshToken();
                if (id) {
                    await getNoteById(id);
                }
            } catch (error) {
                console.log("Initialization failed:", error);
                setError("Failed to initialize. Please try refreshing the page.");
            } finally {
                setFetchingNote(false);
            }
        };

        initializeEditPage();
    }, [id, refreshToken]);

    const getNoteById = async (noteId) => {
        try {
            setError('');
            console.log('Fetching note with ID:', noteId);
            
            const response = await axiosJWT.get(`${BASE_URL}/notes/${noteId}`);
            
            console.log('Response received:', response.data);
            
            // Handle response data structure
            const noteData = response.data.data || response.data;
            
            setTitle(noteData.title || '');
            setContent(noteData.content || '');
            setField(noteData.field || '');
        } catch (error) {
            console.error('Error fetching note data:', error);
            
            if (error.response?.status === 403) {
                setError('Access forbidden. You may not have permission to access this note.');
            } else if (error.response?.status === 404) {
                setError('Note not found or you don\'t have permission to access it');
            } else if (error.response?.status === 401) {
                setError('Your session has expired. Redirecting to login...');
                setTimeout(() => navigate('/'), 2000);
            } else if (error.response?.status === 500) {
                setError('Server error. Please try again later.');
            } else {
                setError(`Failed to fetch note data: ${error.response?.data?.message || error.message}`);
            }
        }
    };

    const updateNote = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const noteData = { title, content, field };

        try {
            console.log('Updating note with ID:', id);
            
            const response = await axiosJWT.put(
                `${BASE_URL}/notes/update-notes/${id}`, 
                noteData
            );
            
            console.log('Note updated successfully:', response.data);
            navigate('/dashboard'); // Redirect after successful update
        } catch (error) {
            console.error('Error updating the note!', error);
            
            if (error.response?.status === 403) {
                setError('Access forbidden. You may not have permission to update this note.');
            } else if (error.response?.status === 401) {
                setError('Your session has expired. Please login again.');
                setTimeout(() => navigate('/'), 2000);
            } else if (error.response?.status === 404) {
                setError('Note not found.');
            } else if (error.response) {
                setError(error.response.data.message || 'Error updating note');
            } else if (error.request) {
                setError('Network error. Please check your connection.');
            } else {
                setError('Error updating note. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Show loading state while fetching note
    if (fetchingNote) {
        return (
            <section className="section">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-8">
                            <div className="box has-text-centered">
                                <p className="title is-4">⏳ Loading...</p>
                                <p className="subtitle">Getting note data ready...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Show error state if note fetch failed and no data
    if (error && !title && !content && !field) {
        return (
            <section className="section">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-8">
                            <div className="box">
                                <div className="notification is-danger">
                                    <strong>Error:</strong> {error}
                                </div>
                                <div className="buttons is-centered">
                                    <button 
                                        className="button is-primary" 
                                        onClick={() => navigate('/dashboard')}
                                    >
                                        Back to Dashboard
                                    </button>
                                    <button 
                                        className="button is-light" 
                                        onClick={() => window.location.reload()}
                                    >
                                        Retry
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="section">
            <div className="container">
                <div className="columns is-centered">
                    <div className="column is-8">
                        <h1 className="title">✏️ Edit Note</h1>
                        <p className="subtitle has-text-grey mb-5">Update your note's details below.</p>

                        {error && (
                            <div className="notification is-danger">
                                <strong>Error:</strong> {error}
                            </div>
                        )}

                        <form onSubmit={updateNote} className="box">
                            <div className="field">
                                <label className="label">📌 Title</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        type="text"
                                        name="title"
                                        placeholder="Edit your note title..."
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">🧾 Content</label>
                                <div className="control">
                                    <textarea
                                        className="textarea"
                                        name="content"
                                        placeholder="Make changes to your note content..."
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        required
                                        disabled={loading}
                                        rows="6"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">📂 Field</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        type="text"
                                        name="field"
                                        placeholder="e.g. Work, School, Personal"
                                        value={field}
                                        onChange={(e) => setField(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="field is-grouped is-justify-content-space-between">
                                <div className="control">
                                    <button 
                                        type="button" 
                                        className="button is-light"
                                        onClick={() => navigate('/dashboard')}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                </div>
                                <div className="control">
                                    <button 
                                        type="submit" 
                                        className={`button is-success ${loading ? 'is-loading' : ''}`}
                                        disabled={loading}
                                    >
                                        🔄 Update Note
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EditNotes;