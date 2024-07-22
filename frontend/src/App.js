import React, { useState, useEffect } from 'react';
import './App.css';
import ProjectList from './components/project-list';
import TaskList from './components/task-list';
import UserList from './components/UserList';
import { useCookies } from 'react-cookie';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import UserRoleManagement from './components/userrolemana';
// Update the path as necessary

function App() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editedProject, setEditedProject] = useState(null);
  const [editedTask, setEditedTask] = useState(null);
  const [cookies, setCookies, deleteCookies] = useCookies(['mr-token']);
  const [anchorEl, setAnchorEl] = useState(null);
  const [username, setUsername] = useState('');



  useEffect(() => {
    if (!cookies['mr-token']) {
      window.location.href = '/';
    } else {
      fetch("http://127.0.0.1:8000/api/user_details/", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${cookies['mr-token']}`
        }
      })
        .then(resp => resp.json())
        .then(userData => {
          setUsername(userData.username);
          const userId = userData.id;
          fetch(`http://127.0.0.1:8000/api/projects/?owner=${userId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${cookies['mr-token']}`
            }
          })
            .then(resp => resp.json())
            .then(data => setProjects(data))
            .catch(error => console.log("Error fetching projects:", error));
        })
        .catch(error => console.log("Error fetching user details:", error));
    }
  }, [cookies]);

  useEffect(() => {
    if (selectedProject) {
      fetch(`http://127.0.0.1:8000/api/tasks/?project=${selectedProject.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${cookies['mr-token']}`
        }
      })
        .then(resp => resp.json())
        .then(data => setTasks(data))
        .catch(error => console.log("Error fetching tasks:", error));
    } else {
      setTasks([]);
    }
  }, [selectedProject, cookies]);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleSaveProject = (projectData) => {
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
          setProjects(prevProjects =>
            prevProjects.map(p => (p.id === data.id ? data : p))
          );
        } else {
          setProjects(prevProjects => [...prevProjects, data]);
        }
        setEditedProject(null);
      })
      .catch(error => console.error("Error handling project:", error));
  };

  const handleDeleteProject = (projectId) => {
    fetch(`http://127.0.0.1:8000/api/projects/${projectId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${cookies['mr-token']}`
      }
    })
      .then(resp => {
        if (resp.ok) {
          setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
          setEditedProject(null);
        } else {
          console.error("Error deleting project");
        }
      })
      .catch(error => console.error("Error deleting project:", error));
  };

  const handleSaveTask = (taskData) => {
    const url = editedTask
      ? `http://127.0.0.1:8000/api/tasks/${editedTask.id}/`
      : "http://127.0.0.1:8000/api/tasks/";

    const method = editedTask ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${cookies['mr-token']}`
      },
      body: JSON.stringify(taskData)
    })
      .then(resp => resp.json())
      .then(data => {
        if (editedTask) {
          setTasks(prevTasks =>
            prevTasks.map(t => (t.id === data.id ? data : t))
          );
        } else {
          setTasks(prevTasks => [...prevTasks, data]);
        }
        setEditedTask(null);
      })
      .catch(error => console.error("Error handling task:", error));
  };

  const handleDeleteTask = (taskId) => {
    fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${cookies['mr-token']}`
      }
    })
      .then(resp => {
        if (resp.ok) {
          setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        } else {
          console.error("Error deleting task");
        }
      })
      .catch(error => console.error("Error deleting task:", error));
  };

  const handleEditTask = (task) => {
    setEditedTask(task);
  };

  const handleCancelEdit = () => {
    setEditedTask(null);
  };

  const handleEditProject = (project) => {
    setEditedProject(project);
  };

  const handleUpdateTaskStatus = (taskId, status) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (taskToUpdate) {
      const updatedTask = { ...taskToUpdate, status };

      fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${cookies['mr-token']}`
        },
        body: JSON.stringify(updatedTask)
      })
        .then(resp => resp.json())
        .then(data => {
          setTasks(prevTasks =>
            prevTasks.map(t => (t.id === data.id ? data : t))
          );
        })
        .catch(error => console.error("Error updating task status:", error));
    }
  };

  const logoutUser = () => {
    deleteCookies(['mr-token']);
    window.location.href = '/'; // Redirect to login page or homepage
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'account-popover' : undefined;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Task Tracker</h1>
        {cookies['mr-token'] && (
          <div className="header-right">
            <div className="account-circle">
              <AccountCircleIcon onClick={handleClick} />
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <Typography sx={{ p: 2, fontWeight: 'bold' }}>
                  {username}
                </Typography>
              </Popover>
            </div>
            <button className="logout-button" onClick={logoutUser}>
              <LogoutIcon />
            </button>
          </div>
        )}
      </header>
      <div className='layout'>
        <div className="project-list-section">
          <ProjectList
            projects={projects}
            onProjectClick={handleProjectClick}
            onDelete={handleDeleteProject}
            onEdit={handleEditProject}
          />
        </div>
        <div className="task-list-section">
          <UserRoleManagement />
          <TaskList
            tasks={tasks}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onUpdateTaskStatus={handleUpdateTaskStatus}
          />
        </div>
        <UserList />
      </div>
    </div>
  );
}

export default App;
