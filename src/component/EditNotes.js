import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditNotes = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [field, setField] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        getNoteById(id);
    }, []);

    const updateNote = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:5000/notes/${id}`, {
                title,
                content,
                field
            });
            navigate('/');
        } catch (error) {
            console.error("There was an error updating the note!", error);
            alert("Error updating note. Please try again.");
        }
    };

    const getNoteById = async (id) => {
        const response = await axios.get(`http://localhost:5000/notes/${id}`);
        setTitle(response.data.title);
        setContent(response.data.content);
        setField(response.data.field);
    };

    return (
        <section className="section">
            <div className="container">
                <div className="columns is-centered">
                    <div className="column is-8">
                        <h1 className="title">✏️ Edit Note</h1>
                        <p className="subtitle has-text-grey mb-5">Update your note's details below.</p>

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
                                    />
                                </div>
                            </div>

                            <div className="field is-grouped is-justify-content-flex-end">
                                <div className="control">
                                    <button type="submit" className="button is-success is-light">
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
