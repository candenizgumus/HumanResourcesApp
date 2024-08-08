import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import image from '../../../images/istockphoto-962351120-612x612.jpg';

const HeroSection = () => {
    return (
        <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
            <Container maxWidth="lg">
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography variant="h2" component="h1" gutterBottom>
                            Pay as you go without any licencing fees
                        </Typography>
                        <Typography variant="h5" component="p" gutterBottom>
                            Avoid surprise bills with per-employee pricing.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <img src={image} alt="Easy HR" style={{ width: '100%' }} />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default HeroSection;