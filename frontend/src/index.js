import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Auth from './components/auth';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import ProjectFormPage from './components/ProjectFormPage';
import TaskFormPage from './components/TaskFormPage';
import HomePage from './components/home-page';
import UserRoleManagement from './components/userrolemana';

function Router() {
  return (
    <React.StrictMode>
      <CookiesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/projects" element={<App />} />
            <Route path="/projects/new" element={<ProjectFormPage />} />
            <Route path="/projects/:projectId" element={<ProjectFormPage />} />
            <Route path="/tasks" element={<App />} />
            <Route path="/tasks/new" element={<TaskFormPage />} />
            <Route path="/tasks/:taskId" element={<TaskFormPage />} />
            <Route path="/manage-roles" element={<UserRoleManagement />} />
          </Routes>
        </BrowserRouter>
      </CookiesProvider>
    </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Router />);
