import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { BASE_URL } from '../utils';

const Register = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Validation
        if (!name || !password || !confirmPassword) {
            setError('All fields are required');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${BASE_URL}/register`, {
                name,
                password
            });

            console.log('Registration successful:', response.data);
            setSuccess('Registration successful! Redirecting to login...');
            
            // Clear form
            setName('');
            setPassword('');
            setConfirmPassword('');
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (error) {
            console.error('Registration error:', error);
            
            if (error.response?.status === 400) {
                setError('Invalid registration data. Please check your inputs.');
            } else if (error.response?.status === 409) {
                setError('User already exists. Please choose a different name.');
            } else if (error.response?.status === 500) {
                setError('Server error. Please try again later.');
            } else if (error.response?.data?.msg) {
                setError(error.response.data.msg);
            } else if (error.request) {
                setError('Network error. Please check your connection.');
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="hero is-fullheight">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-4">
                            <div className="box">
                                <div className="has-text-centered mb-5">
                                    <h1 className="title is-3">📝 Create Account</h1>
                                    <p className="subtitle has-text-grey">Join us to start taking notes</p>
                                </div>

                                {error && (
                                    <div className="notification is-danger">
                                        <strong>Error:</strong> {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="notification is-success">
                                        <strong>Success!</strong> {success}
                                    </div>
                                )}

                                <form onSubmit={handleRegister}>
                                    <div className="field">
                                        <label className="label">👤 Name</label>
                                        <div className="control has-icons-left">
                                            <input
                                                className="input"
                                                type="text"
                                                placeholder="Enter your name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                                disabled={loading}
                                            />
                                            <span className="icon is-small is-left">
                                                <i className="fas fa-user"></i>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="field">
                                        <label className="label">🔒 Password</label>
                                        <div className="control has-icons-left">
                                            <input
                                                className="input"
                                                type="password"
                                                placeholder="Enter your password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                disabled={loading}
                                                minLength="6"
                                            />
                                            <span className="icon is-small is-left">
                                                <i className="fas fa-lock"></i>
                                            </span>
                                        </div>
                                        <p className="help">Password must be at least 6 characters long</p>
                                    </div>

                                    <div className="field">
                                        <label className="label">🔒 Confirm Password</label>
                                        <div className="control has-icons-left">
                                            <input
                                                className="input"
                                                type="password"
                                                placeholder="Confirm your password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                disabled={loading}
                                                minLength="6"
                                            />
                                            <span className="icon is-small is-left">
                                                <i className="fas fa-lock"></i>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="field">
                                        <div className="control">
                                            <button 
                                                type="submit" 
                                                className={`button is-success is-fullwidth ${loading ? 'is-loading' : ''}`}
                                                disabled={loading}
                                            >
                                                🚀 Create Account
                                            </button>
                                        </div>
                                    </div>
                                </form>

                                <hr />

                                <div className="has-text-centered">
                                    <p className="has-text-grey">
                                        Already have an account?{' '}
                                        <Link to="/" className="has-text-primary">
                                            <strong>Login here</strong>
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;