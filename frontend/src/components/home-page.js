import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './homepage.css'; // Import the CSS file for styling
import { Container, Typography, Button, Grid, Paper, Box, List, ListItem, ListItemText, Divider } from '@mui/material';


function HomePage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with actual auth logic
    const navigate = useNavigate();

    const handleGoToTaskTracker = () => {
        if (isLoggedIn) {
            navigate('/projects'); // Redirect to the Task Tracker page
        } else {
            if (window.confirm('Login First?')) {
                navigate('/login'); // Redirect to the Login page
            }
        }
    };

    return (
        <div className="home-page">
            <header className="header">
                <h1 className="title">TASK TRACKER</h1>
                <p className="subtitle">Your productivity starts here</p>
            </header>
            <div className="links">
                <Link to="/login" className="btn login-btn">Get Started</Link>
            </div>
            <section className="info-section">
                <h2 className="section-title">Discover the Benefits of Our Task Tracker</h2>
                <div className="info-content">
                    <div className="info-item">
                        <h3 className="info-title">Streamline Project Management</h3>
                        <p className="info-description">Organize tasks, track progress, and collaborate effectively with your team. Our Task Tracker provides an intuitive interface to keep all your project details in one place.</p>
                    </div>
                    <div className="info-item">
                        <h3 className="info-title">Enhanced Productivity</h3>
                        <p className="info-description">Boost team efficiency with features designed to help you manage your workload and deadlines. Prioritize tasks, set milestones, and get real-time updates.</p>
                    </div>
                    <div className="info-item">
                        <h3 className="info-title">Seamless Collaboration</h3>
                        <p className="info-description">Work together with ease using our collaboration tools. Share project details, provide feedback, and keep everyone aligned with minimal effort.</p>
                    </div>
                    <div className="info-item">
                        <h3 className="info-title">Real-Time Updates</h3>
                        <p className="info-description">Stay informed with instant notifications on task updates and project changes. Ensure everyone is on the same page and never miss important information.</p>
                    </div>
                </div>
                <footer className="footer">
                    <Typography variant="body2">tasktracker@tigerprojects.com</Typography>
                    <Typography variant="body2" gutterBottom>
                        © 2024, Gerish Pvt. Ltd. All Rights Reserved.
                    </Typography>
                    <Typography variant="body2">
                        <Link href="/privacy" underline="hover">Privacy Policy</Link> |
                        <Link href="/terms" underline="hover">Terms of Service</Link>
                    </Typography>
                </footer>
            </section>
        </div>
    );
}

export default HomePage;
