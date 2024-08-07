import React, {useRef} from 'react';
import {Container, Typography, Box, Grid, CssBaseline} from '@mui/material';
import HeroSection from '../../components/molecules/PreAuthorizedPageComponents/HeroSection'
import OfferFormSection from "../../components/molecules/PreAuthorizedPageComponents/OfferFormSection";
import FeaturesSection from "../../components/molecules/PreAuthorizedPageComponents/FeaturesSection";
import FAQSection from "../../components/molecules/PreAuthorizedPageComponents/FAQSection";
import FooterElement from "../../components/molecules/PreAuthorizedPageComponents/FooterElement";
import { NavBar } from '../../components/molecules/PreAuthorizedPageComponents/NavBar';
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
                    <OfferFormSection/>
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