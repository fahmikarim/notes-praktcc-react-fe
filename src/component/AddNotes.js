import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddNotes = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [field, setField] = useState('');
    const navigate = useNavigate();

    const saveNote = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/notes', {
                title: title,
                content: content,
                field: field
            });
            navigate('/');
        } catch (error) {
            console.error("There was an error saving the note!", error);
            alert("Error saving note. Please try again.");
        }
    };

    return (
        <section className="section">
            <div className="container">
                <div className="columns is-centered">
                    <div className="column is-8">
                        <h1 className="title">📝 Add a New Note</h1>
                        <p className="subtitle has-text-grey mb-5">Fill out the form below to save your thoughts.</p>

                        <form onSubmit={saveNote} className="box">
                            <div className="field">
                                <label className="label">📌 Title</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        type="text"
                                        name="title"
                                        placeholder="Give your note a catchy title..."
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
                                        placeholder="Write your ideas, plans, or anything here..."
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
                                        placeholder="e.g. Personal, Work, Study"
                                        value={field}
                                        onChange={(e) => setField(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="field is-grouped is-justify-content-flex-end">
                                <div className="control">
                                    <button type="submit" className="button is-success is-light">
                                        💾 Save Note
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

export default AddNotes;
