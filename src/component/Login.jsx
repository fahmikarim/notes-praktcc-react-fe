import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils';

const Login = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const Auth = async (e) => {
        e.preventDefault();
        try {
          await axios.post(`${BASE_URL}/login`, {
                name,
                password
            }, {
                withCredentials: true // Add this to send cookies
            });
            navigate('/dashboard')
        } catch (error) {
            if (error.response){
                setMsg(error.response.data.msg);
            }
        }
    };
    return (
    <section className="section">
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-5">
            <h1 className="title">🔐 Login</h1>
            <p className="subtitle has-text-grey mb-5">
              Masukkan username dan password untuk masuk.
            </p>

            {msg && (
              <div className="notification is-danger is-light">
                <button
                  className="delete"
                  onClick={() => setMsg("")}
                  aria-label="close"
                ></button>
                {msg}
              </div>
            )}

            <form onSubmit={Auth} className="box">
              <div className="field">
                <label className="label">👤 Name</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    placeholder="Masukkan username"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">🔒 Password</label>
                <div className="control">
                  <input
                    type="password"
                    className="input"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

                <div className="field is-grouped is-justify-content-space-between">
                    <div className="control">
                    <Link to="/register" className="button is-light">
                        ➕ Register
                    </Link>
                </div>
                <div className="control">
                    <button type="submit" className="button is-success is-light">
                    ➡️ Login
                    </button>
                </div>
                </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;