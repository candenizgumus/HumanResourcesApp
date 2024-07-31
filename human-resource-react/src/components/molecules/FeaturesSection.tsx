import React from 'react';
import { Container, Typography, Grid, Box, Paper, Avatar } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import AppsIcon from '@mui/icons-material/Apps';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SupportIcon from '@mui/icons-material/Support';

const features = [
    { icon: <SecurityIcon fontSize="large" />, title: 'High Data Security', description: 'With Kolay IK, all data communication between users is protected with SSL certificates in accordance with international security standards.' },
    { icon: <AppsIcon fontSize="large" />, title: 'Free Applications', description: 'Get many free applications such as personnel management, bank integration, overtime, meal card, training and development management with Kolay HR.' },
    { icon: <LocalOfferIcon fontSize="large" />, title: 'Reasonable Prices', description: 'Choose the packages that suit your company, use them if you don\'t like them, pay as you use them.' },
    { icon: <SupportIcon fontSize="large" />, title: 'Lifetime Support', description: 'You can reach our lifetime support team, which is ready to help you whenever you have a problem, by phone or e-mail.' },
];

const FeaturesSection = () => {
    return (
        <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
            <Container maxWidth="lg">
                <Typography variant="h4" align="center" gutterBottom>
                    Additional features
                </Typography>
                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} md={3} key={index}>
                            <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                                <Avatar sx={{ bgcolor: 'primary.main', mb: 2, width: 56, height: 56 }}>
                                    {feature.icon}
                                </Avatar>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body2" component="p">
                                    {feature.description}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default FeaturesSection;