import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const NoteList = () => {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        getNotes();
    }, []);

    const getNotes = async () => {
        const response = await axios.get('http://localhost:5000/notes');
        setNotes(response.data);
    };

    const deleteNote = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/notes/${id}`);
            getNotes();
        } catch (error) {
            console.error("There was an error deleting the note!", error);
            alert("Error deleting note. Please try again.");
        }
    };

    return (
        <div className="section">
            <div className="container">
                <div className="columns is-centered">
                    <div className="column is-10">
                        <div className="level">
                            <h1 className="title level-left">📋 Your Notes</h1>
                            <div className="level-right">
                                <Link to="add" className="button is-success is-light">
                                    ➕ Add New Note
                                </Link>
                            </div>
                        </div>
                        {notes.length === 0 ? (
                            <p className="has-text-grey">You don't have any notes yet. Click "Add New Note" to get started.</p>
                        ) : (
                            <div className="table-container">
                                <table className="table is-striped is-fullwidth is-hoverable">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>📝 Title</th>
                                            <th>🧾 Content</th>
                                            <th>📂 Field</th>
                                            <th>⚙️ Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {notes.map((note, index) => (
                                            <tr key={note.id}>
                                                <td>{index + 1}</td>
                                                <td>{note.title}</td>
                                                <td>{note.content}</td>
                                                <td>{note.field}</td>
                                                <td>
                                                    <div className="buttons are-small">
                                                        <Link to={`edit/${note.id}`} className="button is-info is-light">
                                                            ✏️ Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => deleteNote(note.id)}
                                                            className="button is-danger is-light"
                                                        >
                                                            🗑️ Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteList;
