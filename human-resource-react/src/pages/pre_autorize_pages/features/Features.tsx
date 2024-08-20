import React, { useEffect, useState } from 'react';
import {
    Typography,
    Container,
    CssBaseline,
    Box,
    Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { NavBar } from '../../../components/molecules/PreAuthorizedPageComponents/NavBar';
import FooterElement from '../../../components/molecules/PreAuthorizedPageComponents/FooterElement';
import FeatureCard from '../../../components/molecules/PreAuthorizedPageComponents/FeatureCard';
import { HumanResources, RootState } from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGetFeatures } from '../../../store/feature/featureSlice';
import CircularProgress from '@mui/material/CircularProgress';
import HeaderElement from '../../../components/atoms/Header';
import ThemeElement from '../../../components/atoms/ThemeElement';

const Root = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
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

const CardGrid = styled(Container)(({ theme }) => ({
    paddingTop: theme.spacing(2),
}));

function PerformanceEvaluationPage() {
    const dispatch: HumanResources = useDispatch();
    const featureList = useSelector((state: RootState) => state.feature.featuresList);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await dispatch(fetchGetFeatures()).unwrap();
                if (!result.code) {
                    setLoading(false);
                } else {
                    console.error('Unexpected result format:', result);
                }
            } catch (error) {
                console.error('Error fetching:', error);
            }

        };
        fetchData();
    }, [dispatch]);

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);
    return (
        <ThemeElement children={
            <Root>
                <CssBaseline />
                <NavBar />
                <HeaderElement headline='Products' text='Pricing based on your number of employees, use as much as you want, pay as much as you use' />
                <Body>
                    <Container maxWidth="lg">
                        <Box py={5}>
                            <Typography component="h1" variant="h4" align="center" color="primary.main" gutterBottom sx={{ paddingBottom: 5 }}>
                                Features
                            </Typography>
                            <CardGrid maxWidth="md" sx={{ marginBottom: '5%' }}>
                                {loading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '5%', marginTop: '5%' }}>
                                        <CircularProgress />
                                    </Box>
                                ) : (
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
                                )}
                            </CardGrid>
                        </Box>
                        <Box py={5}>
                            <Typography component="h1" variant="h4" align="center" color="primary.main" gutterBottom sx={{ paddingBottom: 5 }}>
                                Additional Features
                            </Typography>
                            <CardGrid maxWidth="md" sx={{ marginBottom: '5%' }}>
                                {loading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '5%', marginTop: '5%' }}>
                                        <CircularProgress />
                                    </Box>
                                ) : (
                                    <Grid container spacing={4}>
                                        {featureList.slice(3, featureList.length).map((feature) => (
                                            <FeatureCard
                                                key={feature.id}
                                                name={feature.name}
                                                shortDescription={feature.shortDescription}
                                                iconPath={feature.iconPath}
                                                isNavigatable={false}
                                            />
                                        ))}
                                    </Grid>
                                )}
                            </CardGrid>
                        </Box>
                    </Container>
                </Body>
                <Footer>
                    <CssBaseline />
                    <FooterElement />
                </Footer>
            </Root>
        } />
    );
}

export default PerformanceEvaluationPage;
