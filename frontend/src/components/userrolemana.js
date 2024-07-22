// UserRoleManagement.js
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useCookies } from 'react-cookie';

function UserRoleManagement() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [cookies] = useCookies(['mr-token']);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        // Fetch users
        fetch('http://127.0.0.1:8000/api/users/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${cookies['mr-token']}`
            }
        })
            .then(resp => resp.json())
            .then(data => setUsers(data))
            .catch(error => setError("Error fetching users"));

        // Set roles - could be fetched from backend if needed
        setRoles(["admin", "task_creator", "individual"]);
    }, [cookies]);

    const handleRoleChange = (e) => {
        setSelectedRole(e.target.value);
    };

    const handleUserChange = (e) => {
        setSelectedUser(e.target.value);
    };

    const handleAssignRole = () => {
        fetch(`http://127.0.0.1:8000/api/userroles/${selectedUser}/assign_role/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${cookies['mr-token']}`
            },
            body: JSON.stringify({ role: selectedRole })
        })
            .then(resp => {
                if (resp.status === 403) {
                    throw new Error("You do not have permission to assign roles");
                }
                if (!resp.ok) {
                    throw new Error("Failed to assign role");
                }
                return resp.json();
            })
            .then(data => {
                setSuccess('Role assigned successfully');
                setError(null);
                // Optionally refresh the user list or update state
            })
            .catch(error => {
                setError(error.message || "Error assigning role");
                setSuccess(null);
            });
    };

    const UserRoleManagement = ({ userRole }) => {
        return (
            <Container>
                <Typography variant="h6" gutterBottom>
                    Manage Tasks
                </Typography>
                <Grid container spacing={3}>
                    {userRole === 'admin' && (
                        <>
                            <Grid item xs={12}>
                                <Button variant="contained" color="primary">
                                    Create Task
                                </Button>
                                {/* Additional admin controls */}
                            </Grid>
                        </>
                    )}
                    {userRole === 'task_creator' && (
                        <>
                            <Grid item xs={12}>
                                <Button variant="contained" color="primary">
                                    Create Task
                                </Button>
                                {/* Task creation controls */}
                            </Grid>
                        </>
                    )}
                </Grid>
            </Container>
        );
    }
}

export default UserRoleManagement;
