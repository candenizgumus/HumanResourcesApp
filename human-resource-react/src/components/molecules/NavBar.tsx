import { useState, useEffect } from 'react';
import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// @ts-ignore
export const NavBar = ({ featuresRef }) => {
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
    };

    const navigationsStyle = {
        color: scrolled ? 'primary.main' : 'white',
        transition: 'color 0.3s ease',
    };

    const loginButtonStyle = {
        bgcolor: scrolled ? 'primary.main' : 'white',
        color: scrolled ? 'white' : 'primary.main',
        mx: 1,
        border: '2px solid',
        borderColor: scrolled ? 'primary.main' : 'white',
        borderRadius: '20px',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
            bgcolor: scrolled ? 'primary.main' : 'white',
            transform: 'scale(1.1)',
        },
    };

    const getOfferButtonStyle = {
        bgcolor: scrolled ? 'white' : 'primary.main',
        color: scrolled ? 'primary.main' : 'white',
        mx: 1,
        border: '2px solid',
        borderColor: scrolled ? 'primary.main' : 'white',
        borderRadius: '20px',
        transition: 'transform 0.3s ease-in-out',
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

    // Function to scroll to the Features section
    const scrollToFeatures = () => {
        if(featuresRef.current === null){
            navigate('/features');
        }
        else if (featuresRef.current) {
            featuresRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const navigateToLogin = () => {
        navigate('/login');
    };

    const navigateToGetOffer = () => {
        navigate('/get-offer');
    };

    const navigateToHome = () => {
        navigate('/');
    };

    const navigateToAbout = () => {
        navigate('/about');
    };

    const navigateToUserStories = () => {
        navigate('/user-stories');
    };

    const navigateToContact = () => {
        navigate('/contact');
    };

    return (
        <>
            <AppBar position="sticky" sx={appBarStyle}>
                <Toolbar>
                    <Typography variant="h6" sx={logoStyle}>
                        <Button style={{ marginRight: '20px' }} sx={navigationsStyle} onClick={navigateToHome} color="inherit">
                            Kolay IK
                        </Button>
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button style={{ marginRight: '20px' }} sx={navigationsStyle} onClick={scrollToFeatures} color="inherit">
                            Features
                        </Button>
                        <Button style={{ marginRight: '20px' }} sx={navigationsStyle} onClick={navigateToUserStories} color="inherit">
                            User Stories
                        </Button>
                        <Button style={{ marginRight: '20px' }} sx={navigationsStyle} onClick={navigateToAbout} color="inherit">
                            About
                        </Button>
                        <Button style={{ marginRight: '20px' }} sx={navigationsStyle} onClick={navigateToContact} color="inherit">
                            Contact
                        </Button>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                        <Button onClick={navigateToLogin} sx={loginButtonStyle}>
                            Login
                        </Button>
                        <Button onClick={navigateToGetOffer} sx={getOfferButtonStyle}>
                            Get Offer
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>
        </>
    );
};