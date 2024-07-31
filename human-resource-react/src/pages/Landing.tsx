import React, { useEffect, useRef } from 'react';
import {
    Typography,
    Button,
    Grid,
    Container,
    CssBaseline,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { HumanResources, RootState } from '../store';
import FeatureCard from '../components/molecules/FeatureCard';
import { fetchGetFeatures } from '../store/feature/featureSlice';
import Dashboard from '../images/default_dashboard.webp';
import { NavBar } from '../components/molecules/NavBar';
import {useLocation} from "react-router-dom";
import FooterElement from '../components/molecules/FooterElement';

const Root = styled('div')(({ theme }) => ({
    flexGrow: 1,
}));

const Header = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(4),
}));

const CardGrid = styled(Container)(({ theme }) => ({
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
}));

const Footer = styled('footer')(({ theme }) => ({
    padding: theme.spacing(0),
}));

function LandingPage() {
    const dispatch: HumanResources = useDispatch();
    const featureList = useSelector((state: RootState) => state.feature.featuresList);
    const featuresRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        dispatch(fetchGetFeatures());
    }, [dispatch]);

    return (
        <Root>
            <CssBaseline />
            <NavBar featuresRef={featuresRef} />

            <main>
                <Header sx={{ bgcolor: 'primary.main', width: '100%', paddingTop: '30px' }}>
                    <Container maxWidth="sm" sx={{ bgcolor: 'primary.main', paddingTop: 4, paddingBottom: 4 }}>
                        <Typography component="h1" variant="h3" align="center" color="white" gutterBottom>
                            Making your work easier one step at a time
                        </Typography>
                        <Grid container spacing={4} justifyContent="center">
                            <Grid item>
                                <Button variant="contained" sx={{ borderRadius: '20px', bgcolor: '#57B375', color: 'white' }}>
                                    Book Demo
                                </Button>
                            </Grid>
                            <Grid item>
                                <img
                                    src={Dashboard}
                                    alt="Description of the image"
                                    style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
                                />
                            </Grid>
                        </Grid>
                    </Container>
                </Header>

                <CardGrid maxWidth="md" sx={{ paddingTop: 0 }} ref={featuresRef}>
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
            </main>

            <Footer>
                <CssBaseline />
                <FooterElement/>
            </Footer>
        </Root>
    );
}

export default LandingPage;
