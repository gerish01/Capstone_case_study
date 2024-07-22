import React, { useState } from 'react';
import { List, ListItem, Card, CardContent, Typography, IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, Link } from 'react-router-dom';
import '../projectlist.css'; // Import your updated CSS file

function ProjectList({ projects, onProjectClick, onDelete, onEdit }) {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleClick = (project) => () => {
        onProjectClick(project);
    };

    const handleAddClick = (project) => (event) => {
        event.stopPropagation();
        navigate(`/projects/${project.id}`);
        if (onEdit) {
            onEdit(project); // Call the edit function passed as prop
        } else {
            alert("Only admins have access to add projects.");
        }
    };

    const handleDeleteClick = (project) => (event) => {
        event.stopPropagation();
        if (window.confirm('Are you sure you want to delete this Project?')) {
            if (onDelete) {
                onDelete(project.id); // Call the delete function passed as prop
            }
        } else {
            alert("Only admins have access to delete projects.");
        }
    };

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="project-list-container">
            <div className="header">
                <Typography variant="h4" gutterBottom>
                    Project List
                </Typography>
                <Link to="/projects/new" className="add-project-link">
                    <button className='add-project-button'>Add New Project</button>
                </Link>
            </div>
            <TextField
                label="Search Projects"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {
                filteredProjects.length > 0 ? (
                    <List className="project-list">
                        {filteredProjects.map((project) => (
                            <ListItem
                                key={project.id}
                                button
                                onClick={handleClick(project)}
                                divider
                                className="project-list-item"
                            >
                                <Card variant="outlined" sx={{ width: '100%' }}>
                                    <CardContent>
                                        <div className="project-content">
                                            <div className="project-info">
                                                <Typography variant="h6">{project.name}</Typography>
                                                <Typography color="textSecondary">{project.description}</Typography>
                                                <Typography color="textSecondary">
                                                    Start Date: {new Date(project.start_date).toLocaleDateString()}
                                                </Typography>
                                                <Typography color="textSecondary">
                                                    End Date: {new Date(project.end_date).toLocaleDateString()}
                                                </Typography>
                                            </div>
                                            <div className="action-buttons">
                                                <IconButton color="primary" onClick={handleAddClick(project)}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton color="secondary" onClick={handleDeleteClick(project)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography>No projects available</Typography>
                )
            }
        </div>
    );
}

export default ProjectList;
