import { useState, useEffect } from 'react';
import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// @ts-ignore
export const NavBar = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

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

    const appBarStyle = {
        backgroundColor: scrolled ? 'white' : '',
        paddingLeft: 20,
        paddingRight: 20,
        transition: 'background-color 0.3s ease',
        height: 64, // Set a fixed height for the AppBar
    };

    const navigationsStyle = {
        color: scrolled ? 'primary.main' : 'white',
        transition: 'color 0.3s ease',
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
        bgcolor: scrolled ? 'primary.main' : 'white',
        color: scrolled ? 'white' : 'primary.main',
        border: '2px solid',
        borderColor: scrolled ? 'primary.main' : 'white',
        '&:hover': {
            bgcolor: scrolled ? 'primary.main' : 'white',
            transform: 'scale(1.1)',
        },
    };

    const getOfferButtonStyle = {
        ...buttonStyle,
        bgcolor: scrolled ? 'white' : 'primary.main',
        color: scrolled ? 'primary.main' : 'white',
        border: '2px solid',
        borderColor: scrolled ? 'primary.main' : 'white',
        '&:hover': {
            bgcolor: scrolled ? 'white' : 'primary.main',
            transform: 'scale(1.1)',
        },
    };

    const logoStyle = {
        flexGrow: 1,
        color: scrolled ? 'primary.main' : 'white',
        transition: 'color 0.3s ease',
    };

    /*
    const scrollToFeatures = () => {
        if (featuresRef.current === null) {
            navigate('/features');
        } else if (featuresRef.current) {
            featuresRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };
    */

    return (
        <AppBar position="sticky" sx={appBarStyle}>
            <Toolbar sx={{ alignItems: 'center', display: 'flex', flexWrap: 'nowrap' }}>
                <Typography variant="h6" sx={logoStyle}>
                    <Button style={{ marginRight: '20px' }} sx={navigationsStyle} onClick={() => navigate('/')} color="inherit">
                        Kolay IK
                    </Button>
                </Typography>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }}>
                    <Button style={{ marginRight: '20px' }} sx={navigationsStyle} onClick={() => navigate('/features')} color="inherit">
                        Features
                    </Button>
                    <Button style={{ marginRight: '20px' }} sx={navigationsStyle} onClick={() => navigate('/user-stories')} color="inherit">
                        User Stories
                    </Button>
                    <Button style={{ marginRight: '20px' }} sx={navigationsStyle} onClick={() => navigate('/about-us')} color="inherit">
                        About Us
                    </Button>
                    <Button style={{ marginRight: '20px' }} sx={navigationsStyle} onClick={() => navigate('/contact')} color="inherit">
                        Contact
                    </Button>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }}>
                    <Button onClick={() => navigate('/login')} sx={loginButtonStyle}>
                        Login
                    </Button>
                    <Button onClick={() => navigate('/get-offer')} sx={getOfferButtonStyle}>
                        Get Offer
                    </Button>
                </div>
            </Toolbar>
        </AppBar>
    );
};
