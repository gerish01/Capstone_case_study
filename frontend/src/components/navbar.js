// Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Task Tracker
                </Typography>
                <Button color="inherit" component={Link} to="/projects">DashBoard</Button>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
