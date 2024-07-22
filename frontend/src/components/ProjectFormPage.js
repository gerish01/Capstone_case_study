import React, { useState, useEffect } from 'react'; //React and React hook useState, useEffect For creating and managing the component’s state and lifecycle.
import { Button, TextField, Container, Typography, Grid, MenuItem, Select, InputLabel, FormControl, Box, Card, CardContent, CardActions, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useParams, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Navbar from './navbar';

function ProjectFormPage() {
    const [projectData, setProjectData] = useState({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
    });

    const [editedProject, setEditedProject] = useState(null);
    const [users, setUsers] = useState([]); // State for users
    const [cookies] = useCookies(['mr-token']);
    const { projectId } = useParams(); // Get projectId from URL params
    const navigate = useNavigate();

    // Fetch users for owner dropdown for user
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
    }, [cookies['mr-token']]);

    // Fetch project data if editing
    useEffect(() => {
        if (projectId) {
            fetch(`http://127.0.0.1:8000/api/projects/${projectId}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${cookies['mr-token']}`
                }
            })
                .then(resp => resp.json())
                .then(data => {
                    setProjectData({
                        name: data.name,
                        description: data.description,
                        start_date: data.start_date,
                        end_date: data.end_date,
                        owner: data.owner || '',
                    });
                    setEditedProject(data);
                })
                .catch(error => console.error("Error fetching project:", error));
        } else {
            setEditedProject(null); // Reset editedProject if no projectId
        }
    }, [projectId, cookies['mr-token']]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProjectData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = editedProject
            ? `http://127.0.0.1:8000/api/projects/${editedProject.id}/`
            : "http://127.0.0.1:8000/api/projects/";

        const method = editedProject ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${cookies['mr-token']}`
            },
            body: JSON.stringify(projectData)
        })
            .then(resp => resp.json())
            .then(data => {
                if (editedProject) {
                    console.log('Project updated:', data);
                } else {
                    console.log('New project created:', data);
                }
                navigate('/projects'); // Redirect after submission
            })
            .catch(error => console.error("Error saving project:", error));
    };

    const handleDeleteClick = (event) => {
        event.preventDefault();
        if (window.confirm('Are you sure you want to delete this Project?')) {
            if (editedProject) {
                fetch(`http://127.0.0.1:8000/api/projects/${editedProject.id}/`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${cookies['mr-token']}`
                    }
                })
                    .then(resp => {
                        if (resp.ok) {
                            console.log('Project deleted');
                            navigate('/projects'); // Redirect after deletion
                        } else {
                            console.error("Error deleting project");
                        }
                    })
                    .catch(error => console.error("Error deleting project:", error));
            }
        }
    };

    const handleClose = () => {
        navigate('/projects'); // Redirect to projects list or any other page
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
                            {editedProject ? 'Edit Project' : 'Add New Project'}
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Name"
                                        name="name"
                                        value={projectData.name}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Description"
                                        name="description"
                                        value={projectData.description}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Start Date"
                                        name="start_date"
                                        type="date"
                                        value={projectData.start_date}
                                        onChange={handleChange}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="End Date"
                                        name="end_date"
                                        type="date"
                                        value={projectData.end_date}
                                        onChange={handleChange}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Owner</InputLabel>
                                        <Select
                                            label="Owner"
                                            name="owner"
                                            value={projectData.owner}
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
                                    {editedProject ? 'Save Changes' : 'Add Project'}
                                </Button>
                            </Grid>
                            {editedProject && (
                                <Grid item>
                                    <Button
                                        type="button"
                                        variant="outlined"
                                        color="secondary"
                                        onClick={handleDeleteClick}
                                    >
                                        Delete Project
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

export default ProjectFormPage;
