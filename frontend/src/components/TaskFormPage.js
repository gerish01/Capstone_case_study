import React, { useState, useEffect } from 'react';
import { Button, TextField, Container, Typography, Grid, MenuItem, Select, InputLabel, FormControl, Box, Card, CardContent, CardActions, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Navbar from './navbar';

function TaskFormPage() {
    const [taskData, setTaskData] = useState({
        description: "",
        due_date: "",
        status: "",
        owner: "",
        project: ""
    });
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);
    const [cookies] = useCookies(['mr-token']);
    const { taskId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/users/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${cookies['mr-token']}`
            }
        })
            .then(resp => resp.json())
            .then(data => setUsers(data))
            .catch(error => console.error("Error fetching users:", error));
    }, [cookies]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/projects/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${cookies['mr-token']}`
            }
        })
            .then(resp => resp.json())
            .then(data => setProjects(data))
            .catch(error => console.error("Error fetching projects:", error));
    }, [cookies]);

    useEffect(() => {
        const id = taskId || location.state?.taskId;
        if (id) {
            fetch(`http://127.0.0.1:8000/api/tasks/${id}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${cookies['mr-token']}`
                }
            })
                .then(resp => {
                    if (!resp.ok) {
                        throw new Error('Failed to fetch task');
                    }
                    return resp.json();
                })
                .then(data => {
                    setTaskData({
                        description: data.description || '',
                        due_date: data.due_date || '',
                        status: data.status || '',
                        owner: data.owner || '',
                        project: data.project || ''
                    });
                })
                .catch(error => {
                    console.error("Error fetching task:", error);
                    setError('Failed to fetch task details.');
                });
        }
    }, [taskId, location.state, cookies]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/tasks/${taskId ? taskId + '/' : ''}`, {
                method: taskId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${cookies['mr-token']}`
                },
                body: JSON.stringify(taskData)
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.error || 'Error saving task');
            }

            navigate('/tasks'); // Redirect after successful creation or update
        } catch (error) {
            setError(error.message || 'An unexpected error occurred.');
        }
    };

    const handleDeleteClick = async (event) => {
        event.preventDefault();
        if (window.confirm('Are you sure you want to delete this Task?')) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${cookies['mr-token']}`
                    }
                });

                if (!response.ok) {
                    const errorResponse = await response.json();
                    throw new Error(errorResponse.error || 'Only admins can delete tasks.');
                }

                navigate('/tasks'); // Redirect after deletion
            } catch (error) {
                setError(error.message || 'An unexpected error occurred.');
            }
        }
    };

    const handleClose = () => {
        navigate('/tasks'); // Redirect to tasks list or any other page
    };

    return (
        <>
            <Navbar />
            <Container maxWidth="md" sx={{ mt: 12 }}>
                <Card sx={{ position: 'relative' }}>
                    <IconButton
                        onClick={handleClose}
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            {taskId ? 'Edit Task' : 'Add New Task'}
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Description"
                                        name="description"
                                        value={taskData.description}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Due Date"
                                        name="due_date"
                                        type="date"
                                        value={taskData.due_date}
                                        onChange={handleChange}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            name="status"
                                            value={taskData.status}
                                            onChange={handleChange}
                                            label="Status"
                                        >
                                            <MenuItem value="new">New</MenuItem>
                                            <MenuItem value="in-progress">In Progress</MenuItem>
                                            <MenuItem value="blocked">Blocked</MenuItem>
                                            <MenuItem value="completed">Completed</MenuItem>
                                            <MenuItem value="not started">Not Started</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Owner</InputLabel>
                                        <Select
                                            label="Owner"
                                            name="owner"
                                            value={taskData.owner}
                                            onChange={handleChange}
                                        >
                                            {users.map(user => (
                                                <MenuItem key={user.id} value={user.id}>
                                                    {user.username}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Project</InputLabel>
                                        <Select
                                            label="Project"
                                            name="project"
                                            value={taskData.project}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="">Select Project</MenuItem>
                                            {projects.map(project => (
                                                <MenuItem key={project.id} value={project.id}>
                                                    {project.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                    <CardActions>
                        <Grid container spacing={2} justifyContent="flex-end">
                            <Grid item>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit}
                                >
                                    {taskId ? 'Save Changes' : 'Add Task'}
                                </Button>
                            </Grid>
                            {taskId && (
                                <Grid item>
                                    <Button
                                        type="button"
                                        variant="outlined"
                                        color="secondary"
                                        onClick={handleDeleteClick}
                                    >
                                        Delete Task
                                    </Button>
                                </Grid>
                            )}
                        </Grid>
                    </CardActions>
                </Card>
            </Container>
        </>
    );
}

export default TaskFormPage;
