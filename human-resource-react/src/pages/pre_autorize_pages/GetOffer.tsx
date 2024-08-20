import React, { useEffect, useRef } from 'react';
import { Container, Typography, Box, Grid, CssBaseline } from '@mui/material';
import HeroSection from '../../components/molecules/PreAuthorizedPageComponents/HeroSection'
import OfferFormSection from "../../components/molecules/PreAuthorizedPageComponents/OfferFormSection";
import FeaturesSection from "../../components/molecules/PreAuthorizedPageComponents/FeaturesSection";
import FAQSection from "../../components/molecules/PreAuthorizedPageComponents/FAQSection";
import FooterElement from "../../components/molecules/PreAuthorizedPageComponents/FooterElement";
import { NavBar } from '../../components/molecules/PreAuthorizedPageComponents/NavBar';
import { styled } from "@mui/material/styles";
import ThemeElement from '../../components/atoms/ThemeElement';

const Root = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.myBackgroundColour.main,
}));

const Body = styled('main')(({ theme }) => ({
    flex: '1',
    width: '100%',
    marginTop: theme.spacing(1),
}));

const Footer = styled('footer')(({ theme }) => ({
    padding: theme.spacing(0),
}));

const GetOffer = () => {
    const featuresRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);
    return (
        <ThemeElement children={
            <Root>
                <CssBaseline />
                <NavBar />
                <HeroSection />
                <Body >
                    <Container maxWidth="lg" sx={{bgcolor: 'myBackgroundColour.main'}}>
                        <OfferFormSection />
                        <FeaturesSection />
                        <FAQSection />
                    </Container>
                </Body>
                <Footer>
                    <FooterElement />
                </Footer>
            </Root>
        } />
    );
};

export default GetOffer;