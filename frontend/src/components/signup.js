// Signup.js
import React, { useState } from 'react';
import { API } from './api-service'; // Import the updated API service
import './auth.css';
import { useCookies } from 'react-cookie';

function Signup({ onSwitchToLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [cookies, setCookie] = useCookies(['mr-token']);

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const registerClicked = () => {
        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        API.registerUser({ username, password })
            .then(resp => {
                if (resp.token) {
                    setCookie('mr-token', resp.token, { path: '/' });
                    setMessage('Registration successful!');
                    window.location.href = '/projects';
                } else {
                    setMessage('Registration failed: No token received.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                setMessage('Registration failed: ' + error.message);
            });
    };

    const messageClass = message.includes('failed') ? 'error' : 'success';

    return (
        <div className="auth-container">
            <h1>Register</h1>
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
            <div className="auth-field">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input
                    id="confirm-password"
                    type="password"
                    placeholder="confirm password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                />
            </div>
            <div>
                <button className="auth-button" onClick={registerClicked}>Register</button>
            </div>
            <p onClick={onSwitchToLogin}>You already have an account? Login Here</p>
            {message && (
                <div className={`auth-message ${messageClass}`}>
                    {message}
                </div>
            )}
        </div>
    );
}

export default Signup;
