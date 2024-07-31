import React, { useEffect, useRef, useState } from 'react';
import {
    Typography,
    Button,
    Grid,
    Container,
    CssBaseline,
    IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { HumanResources, RootState } from '../store';
import FeatureCard from '../components/molecules/FeatureCard';
import { fetchGetFeatures } from '../store/feature/featureSlice';
import Dashboard from '../images/default_dashboard.webp';
import { NavBar } from '../components/molecules/NavBar';
import FooterElement from '../components/molecules/FooterElement';
import { fetchGetCompanies } from "../store/feature/companySlice";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LogoCard from "../components/molecules/LogoCard";

const Root = styled('div')(({ theme }) => ({
    flexGrow: 1,
}));

const Header = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(4),
}));

const Body = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(4),
}));

const CardGrid = styled(Container)(({ theme }) => ({
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
}));

const Footer = styled('footer')(({ theme }) => ({
    padding: theme.spacing(0),
}));

const LogoContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
}));

const Logos = styled('div')(({ theme }) => ({
    display: 'flex',
    transition: 'transform 0.5s ease-in-out',
    width: 'fit-content',
}));

const Logo = styled('img')(({ theme }) => ({
    height: '50px',
    width: 'auto',
    margin: theme.spacing(2),
}));

function LandingPage() {
    const dispatch: HumanResources = useDispatch();
    const featureList = useSelector((state: RootState) => state.feature.featuresList);
    const companyList = useSelector((state: RootState) => state.company.companiesList);
    const featuresRef = useRef<HTMLDivElement>(null);

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        dispatch(fetchGetFeatures());
        dispatch(fetchGetCompanies());
    }, [dispatch]);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % companyList.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            (prevIndex - 1 + companyList.length) % companyList.length
        );
    };

    const visibleLogos = [
        ...companyList.slice(currentIndex, currentIndex + 5),
        ...companyList.slice(0, Math.max(0, (currentIndex + 5) - companyList.length))
    ];

    const imageStyle = {
        position: 'absolute',
        top: '60%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    };

    return (
        <Root>
            <CssBaseline />
            <NavBar featuresRef={featuresRef} />

            <main>
                <Header sx={{ bgcolor: 'primary.main', height: '60vh', width: '100%', paddingTop: '30px' }}>
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
                            <Grid item sx={imageStyle}>
                                <img
                                    src={Dashboard}
                                    alt="Description of the image"
                                    style={{ maxHeight: '500px', objectFit: 'contain' }}
                                />
                            </Grid>
                        </Grid>
                    </Container>
                </Header>
                <Body sx={{ width: '100%', marginTop: '35vh' }}>
                    <LogoContainer sx={{ bgcolor: 'primary.main', padding: 5 }}>
                        <IconButton onClick={handlePrev}>
                            <ArrowBackIosIcon />
                        </IconButton>
                        <Logos sx={{ maxWidth: '1092px' }}>
                            {visibleLogos.map((company, index) => (
                                <LogoCard
                                    key={index}
                                    logoSrc={company.logo}
                                    altText={company.name}
                                />
                            ))}
                        </Logos>
                        <IconButton onClick={handleNext}>
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </LogoContainer>
                    <CardGrid maxWidth="md" sx={{ marginTop: 15 }} ref={featuresRef}>
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
                </Body>
            </main>

            <Footer>
                <CssBaseline />
                <FooterElement />
            </Footer>
        </Root>
    );
}

export default LandingPage;
