// Login.js
import React, { useState } from 'react';
import { API } from './api-service'; // Import the updated API service
import './auth.css';
import { useCookies } from 'react-cookie';

function Login({ onSwitchToSignup }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [cookies, setCookie] = useCookies(['mr-token']);

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const loginClicked = () => {
        API.loginUser({ username, password })
            .then(resp => {
                if (resp.token) {
                    setCookie('mr-token', resp.token, { path: '/' });
                    setMessage('Login successful!');
                    window.location.href = '/projects';
                } else {
                    setMessage('Invalid Credentials');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                setMessage('Login failed: ' + error.message);
            });
    };

    const messageClass = message.includes('failed') ? 'error' : 'success';

    return (
        <div className="auth-container">
            <h1>Login</h1>
            <div className="auth-field">
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={handleUsernameChange}
                    required
                />
            </div>
            <div className="auth-field">
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                />
            </div>
            <div>
                <button className="auth-button" onClick={loginClicked}>Login</button>
            </div>
            <p onClick={onSwitchToSignup}>You don't have an account? Register Here!</p>
            {message && (
                <div className={`auth-message ${messageClass}`}>
                    {message}
                </div>
            )}
        </div>
    );
}

export default Login;
