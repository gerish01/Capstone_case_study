import React, { useState, useEffect } from "react";
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import { useCookies } from 'react-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import '../tasklist.css'; // Import your updated CSS file
import { green, yellow, orange, red, blue } from '@mui/material/colors';

function TaskList({ tasks }) {
    const [taskList, setTaskList] = useState(tasks);
    const [cookies] = useCookies(['mr-token']);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setTaskList(tasks);
    }, [tasks]);

    useEffect(() => {
        // Fetch the admin user details to determine if the logged-in user is an admin
        fetch('http://127.0.0.1:8000/api/users/1/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${cookies['mr-token']}`
            }
        })
            .then(resp => resp.json())
            .then(adminUser => {
                // Set isAdmin based on whether the fetched user is the admin
                // Assuming the admin ID is 1
                setIsAdmin(adminUser.id === 1);
            })
            .catch(error => console.error("Error fetching admin details:", error));
    }, [cookies]);

    const handleStatusUpdate = (taskId, newStatus) => {
        fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/update_status/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${cookies['mr-token']}`
            },
            body: JSON.stringify({ status: newStatus })
        })
            .then(resp => resp.json())
            .then(updatedTask => {
                setTaskList(prevTasks =>
                    prevTasks.map(task =>
                        task.id === taskId ? updatedTask : task
                    )
                );
            })
            .catch(error => console.log("Error updating task status:", error));
    };

    const handleDeleteClick = (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${cookies['mr-token']}`
                }
            })
                .then(() => {
                    setTaskList(prevTasks =>
                        prevTasks.filter(task => task.id !== taskId)
                    );
                })
                .catch(error => console.log("Error deleting task:", error));
        }
    };

    const handleUpdateClick = (taskId) => {
        navigate(`/tasks/${taskId}`);
    };

    return (
        <div className="task-list-container">
            <div className="header">
                <Typography variant="h4" gutterBottom>
                    Task List
                </Typography>
                <Link to="/tasks/new" className="add-task-link">
                    <button className='add-task-button'>Add New Task</button>
                </Link>
            </div>
            <div className="task-scroll-container">
                {
                    taskList.length > 0 ? (
                        taskList.map(task => (
                            <div key={task.id} className="task-item">
                                <div className="task-details">
                                    <Typography variant="h6">{task.description}</Typography>
                                    <Typography>Status: {task.status}</Typography>
                                    <Typography>Due Date: {task.due_date}</Typography>
                                    <Typography>Project: {task.project}</Typography>
                                    {task.owner_name && (
                                        <Typography>Assign to: {task.owner_name}</Typography>
                                    )}
                                </div>
                                <div className="task-actions">
                                    {isAdmin && (
                                        <IconButton color="primary" onClick={() => handleUpdateClick(task.id)}>
                                            <EditIcon />
                                        </IconButton>
                                    )}
                                    <IconButton color="secondary" onClick={() => handleDeleteClick(task.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                                <div>
                                    <Fab
                                        variant="extended"
                                        size="medium"
                                        sx={{ mr: 1, bgcolor: green[500], color: 'black' }}
                                        onClick={() => handleStatusUpdate(task.id, 'completed')}
                                    >
                                        Completed
                                    </Fab>
                                    <Fab
                                        variant="extended"
                                        size="medium"
                                        sx={{ mr: 1, bgcolor: blue[500], color: 'black' }}
                                        onClick={() => handleStatusUpdate(task.id, 'in-progress')}
                                    >
                                        In Progress
                                    </Fab>
                                    <Fab
                                        variant="extended"
                                        size="medium"
                                        sx={{ mr: 1, bgcolor: orange[500], color: 'black' }}
                                        onClick={() => handleStatusUpdate(task.id, 'blocked')}
                                    >
                                        Blocked
                                    </Fab>
                                    <Fab
                                        variant="extended"
                                        size="medium"
                                        sx={{ mr: 1, bgcolor: yellow[500], color: 'black' }}
                                        onClick={() => handleStatusUpdate(task.id, 'new')}
                                    >
                                        New
                                    </Fab>
                                    <Fab
                                        variant="extended"
                                        size="medium"
                                        sx={{ mr: 1, bgcolor: red[500], color: 'black' }}
                                        onClick={() => handleStatusUpdate(task.id, 'not started')}
                                    >
                                        Not Started
                                    </Fab>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No tasks available</p>
                    )
                }
            </div>
        </div>
    );
}

export default TaskList;
