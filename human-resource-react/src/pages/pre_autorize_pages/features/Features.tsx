import React, { useRef } from 'react';
import {
    Typography,
    Container,
    CssBaseline,
    Box,
    Grid,
    Paper,
    Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { NavBar } from '../../../components/molecules/PreAuthorizedPageComponents/NavBar';
import FooterElement from '../../../components/molecules/PreAuthorizedPageComponents/FooterElement';
import FeatureCard from '../../../components/molecules/PreAuthorizedPageComponents/FeatureCard';
import { HumanResources, RootState } from '../../../store';
import { useDispatch, useSelector } from 'react-redux';

const Root = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
}));

const HeaderContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
});

const Header = styled('header')(({ theme }) => ({
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
    width: '100%',
    padding: theme.spacing(3, 0),
}));

const Body = styled('main')(({ theme }) => ({
    flex: '1',
    width: '100%',
    marginTop: theme.spacing(1),
}));

const CardGrid = styled(Container)(({ theme }) => ({
    paddingTop: theme.spacing(2),
}));

const Footer = styled('footer')(({ theme }) => ({
    padding: theme.spacing(0),
}));

function PerformanceEvaluationPage() {
    const featuresRef = useRef(null);
    const dispatch: HumanResources = useDispatch();
    const featureList = useSelector((state: RootState) => state.feature.featuresList);

    return (
        <Root>
            <CssBaseline />
            <NavBar />
            <Header>
                <Container maxWidth="lg">
                    <Box py={5}>
                        <Typography variant="h2" align="center" sx={{color:'white'}} gutterBottom>
                            Products
                        </Typography>
                        <Typography variant="body1" align="center" sx={{color:'white'}} paragraph>
                            Pricing based on your number of employees, use as much as you want, pay as much as you use
                        </Typography>
                    </Box>
                </Container>
            </Header>
            <Body>
                <Container maxWidth="lg">
                    <Box py={2}>
                        <CardGrid maxWidth="md" ref={featuresRef} sx={{ marginBottom: '5%' }}>
                            <Typography component="h1" variant="h4" align="center" color="primary.main" gutterBottom sx={{ paddingBottom: 5 }}>
                                Features
                            </Typography>
                            <Grid container spacing={4}>
                                {featureList.map((feature) => (
                                    <FeatureCard
                                        key={feature.id}
                                        name={feature.name}
                                        shortDescription={feature.shortDescription}
                                        iconPath={feature.iconPath}
                                    />
                                ))}
                            </Grid>
                        </CardGrid>
                    </Box>
                    <Box py={2}>
                        <CardGrid maxWidth="md" ref={featuresRef} sx={{ marginBottom: '5%' }}>
                            <Typography component="h1" variant="h4" align="center" color="primary.main" gutterBottom sx={{ paddingBottom: 5 }}>
                                Additional Features
                            </Typography>
                            <Grid container spacing={4}>
                                    <FeatureCard
                                        name="High Data Security"
                                        shortDescription="Ensure the utmost security of your data with Easy HR, where all user data is encrypted using SSL certificates that meet bank standards."
                                        iconPath="data_security.png"
                                    />
                                    <FeatureCard
                                        name="Flexible Pricing Options"
                                        shortDescription="Choose from a variety of packages tailored to your company's size and needs, paying only for the services you use and appreciate."
                                        iconPath="pricing.png"
                                    />
                                    <FeatureCard
                                        name="Easy Access Support"
                                        shortDescription="Easily access support for any inquiries or issues via the chat application conveniently situated at the bottom right within the app, or through email."
                                        iconPath="support.png"
                                    />
                            </Grid>
                        </CardGrid>
                    </Box>
                </Container>
            </Body>
            <Footer>
                <CssBaseline />
                <FooterElement />
            </Footer>
        </Root>
    );
}

export default PerformanceEvaluationPage;
