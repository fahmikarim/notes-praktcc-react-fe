import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils";
import { jwtDecode } from "jwt-decode";

const AddNotes = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [field, setField] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState(0);
  const navigate = useNavigate();

  const axiosJWT = axios.create();

  // Function to refresh token
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

  // Function to handle note creation
  const createNote = async (e) => {
    e.preventDefault();
    setLoading(true);

    const noteData = { title, content, field };

    try {
      await axiosJWT.post(`${BASE_URL}/notes/add-notes`, noteData);
      navigate("/dashboard"); // Redirect to the dashboard after successful note creation
    } catch (error) {
      console.log("Error creating note:", error);
      alert("Failed to create note");
    } finally {
      setLoading(false);
    }
  };

  // Initialize token and refresh on page load
  useEffect(() => {
    const initializeAddNote = async () => {
      try {
        await refreshToken();
      } catch (error) {
        console.log("Initialization failed:", error);
      }
    };

    initializeAddNote();
  }, [refreshToken]);

  return (
    <section className="section">
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-8">
            <h1 className="title">📝 Add a New Note</h1>
            <p className="subtitle has-text-grey mb-5">Fill out the form below to save your thoughts.</p>

            <form onSubmit={createNote} className="box">
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
                  <button type="submit" className={`button is-success is-light ${loading ? 'is-loading' : ''}`}>
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
