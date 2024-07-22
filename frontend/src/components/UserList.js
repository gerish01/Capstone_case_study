import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import '../UserList.css'; // Import your CSS file for custom styles
import { API } from '../components/api-service';


function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        API.getUsers()
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to fetch users');
                setLoading(false);
            });
    }, []);

    const handleCloseSnackbar = (setter) => () => {
        setter('');
    };

    return (
        <div className="user-list-container">
            <h1>User List</h1>
            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                </div>
            ) : (
                <div className="user-grid">
                    {users.length > 0 ? (
                        <TransitionGroup>
                            {users.map(user => (
                                <CSSTransition
                                    key={user.id}
                                    timeout={300}
                                    classNames="user"
                                >
                                    <div className="user-card">
                                        <div className="avatar">{user.username[0]}</div>
                                        <div className="user-info">
                                            <h3>{user.username}</h3>
                                        </div>
                                    </div>
                                </CSSTransition>
                            ))}
                        </TransitionGroup>
                    ) : (
                        <p>No users available</p>
                    )}
                </div>
            )}
            {successMessage && (
                <div className="snackbar success">
                    {successMessage}
                    <button onClick={handleCloseSnackbar(setSuccessMessage)}>X</button>
                </div>
            )}
            {error && (
                <div className="snackbar error">
                    {error}
                    <button onClick={handleCloseSnackbar(setError)}>X</button>
                </div>
            )}
        </div>
    );
}

export default UserList;
