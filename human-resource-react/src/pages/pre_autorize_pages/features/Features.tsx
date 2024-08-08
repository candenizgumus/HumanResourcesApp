import React, { useEffect, useRef } from 'react';
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
import { fetchGetFeatures } from '../../../store/feature/featureSlice';

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
    useEffect(() => {
        const fetchData = async () => {
            const response = await dispatch(fetchGetFeatures());
        };
        fetchData();
    }, [dispatch]);
    return (
        <Root>
            <CssBaseline />
            <NavBar />
            <Header>
                <Container maxWidth="lg">
                    <Box py={5}>
                        <Typography variant="h2" align="center" sx={{ color: 'white' }} gutterBottom>
                            Products
                        </Typography>
                        <Typography variant="body1" align="center" sx={{ color: 'white' }} paragraph>
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
                                {featureList.slice(0, 3).map((feature) => (
                                    <FeatureCard
                                        key={feature.id}
                                        name={feature.name}
                                        shortDescription={feature.shortDescription}
                                        iconPath={feature.iconPath}
                                        isNavigatable={true}
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
                                {featureList.slice(3,featureList.length).map((feature) => (
                                    <FeatureCard
                                        key={feature.id}
                                        name={feature.name}
                                        shortDescription={feature.shortDescription}
                                        iconPath={feature.iconPath}
                                        isNavigatable={false}
                                    />
                                ))}
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
