import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import Header from '../components/molecules/Header';
import HeroSection from "../components/molecules/HeroSection";
import FormSection from "../components/molecules/FormSection";
import FeaturesSection from "../components/molecules/FeaturesSection";
import FAQSection from "../components/molecules/FAQSection";
import Footer from "../components/molecules/Footer";

const GetOffer = () => {
    return (
        <Box>
            <Header />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <HeroSection />
                <FormSection />
                <FeaturesSection />
                <FAQSection />
                <Footer />
            </Container>
        </Box>
    );
};

export default GetOffer;