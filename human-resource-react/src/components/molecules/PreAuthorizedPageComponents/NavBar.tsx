import { useState, useEffect } from 'react';
import { AppBar, Button, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery, useTheme } from '@mui/material';
import logoDark from '../../../images/logo-full-dark.png';
import logoLight from '../../../images/logo-full-light.png';
import logo_hd from '../../../images/logo-full-light.png';

import ThemeElement from '../../atoms/ThemeElement';
import { Padding } from '@mui/icons-material';

export const NavBar = () => {
    const navigate = useNavigate();
    const isBigForScreen = useMediaQuery('(max-width:1200px)');
    const [scrolled, setScrolled] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleScroll = () => {
        const offset = window.scrollY;
        setScrolled(offset > 0);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const toggleDrawer = (open: boolean) => {
        setDrawerOpen(open);
    };

    const appBarStyle = {
        backgroundColor: scrolled ? 'myBackgroundColour.main' : 'primary.main',
        paddingLeft: 20,
        paddingRight: 20,
        transition: 'background-color 0.3s ease',
        height: 64, // Set a fixed height for the AppBar
    };

    const navigationsStyle = {
        color: scrolled ? 'primary.main' : 'myBackgroundColour.main',
        transition: 'color 0.3s ease',
        '&:hover': {
            color: 'myLightColour.main',
        },
    };

    const buttonStyle = {
        height: '36px', // Set a fixed height for the buttons
        mx: 1,
        borderRadius: '20px',
        transition: 'transform 0.3s ease-in-out',
        whiteSpace: 'nowrap', // Prevent text wrapping
    };

    const loginButtonStyle = {
        ...buttonStyle,
        bgcolor: scrolled ? 'primary.main' : 'myBackgroundColour.main',
        color: scrolled ? 'myBackgroundColour.main' : 'primary.main',
        border: '2px solid',
        borderColor: scrolled ? 'primary.main' : 'myBackgroundColour.main',
        '&:hover': {
            bgcolor: 'myLightColour.main',
            borderColor: 'myLightColour.main',
            transform: 'scale(1.1)',
        },
    };

    const getOfferButtonStyle = {
        ...buttonStyle,
        bgcolor: scrolled ? 'myBackgroundColour.main' : 'primary.main',
        color: scrolled ? 'primary.main' : 'myBackgroundColour.main',
        border: '2px solid',
        borderColor: scrolled ? 'primary.main' : 'myBackgroundColour.main',
        '&:hover': {
            color: 'myLightColour.main',
            borderColor: 'myLightColour.main',
            transform: 'scale(1.1)',
        },
    };

    const logoStyle = {
        flexGrow: 1,
        color: scrolled ? 'primary.main' : 'myBackgroundColour.main',
        transition: 'color 0.3s ease',
    };

    const drawerListItemStyle = {
        textAlign: 'center',
        padding: '10px',
        color: scrolled ? 'myLightColour.main' : 'primary.main',
        borderRadius: '5px',
        backgroundColor: scrolled ? 'primary.main' : 'myLightColour.main',
    };

    const drawerListItemLoginButtonStyle = {
        textAlign: 'center',
        padding: '10px',
        color: scrolled ? 'primary.main' : 'myLightColour.main',
        border: '2px solid',
        borderRadius: '5px',
        borderColor: scrolled ? 'primary.main' : 'myLightColour.main',
        backgroundColor: scrolled ? 'myBackgroundColour.main' : 'primary.main',
    }

    const menuIconStyle = {
        color: scrolled ? 'primary.main' : 'myBackgroundColour.main',
        transition: 'color 0.3s ease',
    };

    const menuItems = [
        { label: 'Features', onClick: () => navigate('/features') },
        { label: 'User Stories', onClick: () => navigate('/user-stories') },
        { label: 'About Us', onClick: () => navigate('/about-us') },
        { label: 'Contact', onClick: () => navigate('/contact') },
        { label: 'Login', onClick: () => navigate('/login'), style: loginButtonStyle },
        { label: 'Get Offer', onClick: () => navigate('/get-offer'), style: getOfferButtonStyle },
    ];

    return (
        <ThemeElement children={
            <AppBar position="sticky" sx={appBarStyle}>
                <Toolbar sx={{ alignItems: 'center', display: 'flex', flexWrap: 'nowrap' }}>
                    <Typography variant="h6" sx={logoStyle}>
                        <Button style={{ marginRight: '20px' }} sx={navigationsStyle} onClick={() => navigate('/')} color="inherit">
                            {scrolled ? <img src={logoDark} alt="logo" style={{ height: '52px' }} /> : <img src={logoLight} alt="logo" style={{ height: '52px' }} />}
                        </Button>
                    </Typography>
                    {isBigForScreen ? (
                        <>
                            <IconButton edge="end" color="inherit" aria-label="menu" onClick={() => toggleDrawer(true)}>
                                <MenuIcon sx={{color: scrolled ? 'primary.main' : 'myLightColour.main'}}/>
                            </IconButton>
                            <Drawer anchor="right" open={drawerOpen} onClose={() => toggleDrawer(false)}>
                                <List sx={{ backgroundColor: scrolled ? 'myBackgroundColour.main' : 'primary.main', height: '100vh', paddingRight: '10px' }}>
                                    {menuItems.map((item, index) => (
                                        <ListItem button key={index} onClick={item.onClick} sx={{marginBottom: '10px'}}>
                                            <ListItemText primary={item.label} sx={item.label==='Login' ? drawerListItemLoginButtonStyle : drawerListItemStyle}/>
                                        </ListItem>
                                    ))}
                                </List>
                            </Drawer>
                        </>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }}>
                            {menuItems.slice(0, 4).map((item, index) => (
                                <Button
                                    key={index}
                                    style={{ marginRight: '20px' }}
                                    sx={navigationsStyle}
                                    onClick={item.onClick}
                                    color="inherit"
                                >
                                    {item.label}
                                </Button>
                            ))}
                            <Button sx={loginButtonStyle} onClick={menuItems[4].onClick}>
                                {menuItems[4].label}
                            </Button>
                            <Button sx={getOfferButtonStyle} onClick={menuItems[5].onClick}>
                                {menuItems[5].label}
                            </Button>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        } />
    );
};
