import React, {useRef} from 'react';
import {Container, Typography, Box, Grid, CssBaseline} from '@mui/material';
import HeroSection from '../../components/molecules/HeroSection'
import FormSection from "../../components/molecules/FormSection";
import FeaturesSection from "../../components/molecules/FeaturesSection";
import FAQSection from "../../components/molecules/FAQSection";
import FooterElement from "../../components/molecules/FooterElement";
import { NavBar } from '../../components/molecules/NavBar';
import {styled} from "@mui/material/styles";
const Root = styled('div')(({ theme }) => ({
    flexGrow: 1,
}));
const Footer = styled('footer')(({ theme }) => ({
    padding: theme.spacing(0),
}));
const GetOffer = () => {
    const featuresRef = useRef<HTMLDivElement>(null);
    return (
        <Root>
            <CssBaseline/>
            <NavBar/>
            <main>
                <Container maxWidth="lg" sx={{mt: 4}}>
                    <HeroSection/>
                    <FormSection/>
                    <FeaturesSection/>
                    <FAQSection/>

                </Container>
            </main>
            <Footer>
                <FooterElement/>
            </Footer>
        </Root>
);
};

export default GetOffer;