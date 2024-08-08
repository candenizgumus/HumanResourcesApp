import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Header = () => {
    return (
        <AppBar position="static" color="transparent" elevation={0}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Easy HR
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                    <Button color="inherit">Apps</Button>
                    <Button color="inherit">Consulting</Button>
                    <Button color="inherit">User Stories</Button>
                    <Button color="inherit">Resources</Button>
                </Box>
                <Button variant="outlined" color="primary" sx={{ mr: 2 }}>Giriş Yap</Button>
            </Toolbar>
        </AppBar>
    );
};

export default Header;