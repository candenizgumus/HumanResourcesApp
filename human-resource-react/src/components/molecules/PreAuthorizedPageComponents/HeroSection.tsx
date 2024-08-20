import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import image from '../../../images/test2.png';
import { styled } from '@mui/material/styles';
import WordPullUp from '../../atoms/WordPullUp';

const Header = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(4),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.myBackgroundColour.main,
    padding: theme.spacing(3, 0),
}));

const HeroSection = () => {
    return (
        <Header>
            <Container maxWidth="lg">
                <Box py={5}>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="h2" gutterBottom>
                                <WordPullUp textAlign={"left"} words={"Streamline Your Workforce Management"} />
                            </Typography>
                            <Typography variant="body1" paragraph>
                                Effortlessly Manage Hiring, Benefits, and Employee Records with Our Cutting-Edge HR Platform.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box
                                component="img"
                                src={image}
                                alt="Header Image"
                                sx={{ width: '100%', height: 'auto' }}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Header>
    );
};

export default HeroSection;