import React, { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  Grid,
  Container,
  CssBaseline,
  IconButton,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { HumanResources, RootState } from '../../store';
import FeatureCard from '../../components/molecules/PreAuthorizedPageComponents/FeatureCard';
import { fetchGetFeatures } from '../../store/feature/featureSlice';
import Dashboard from '../../images/default_dashboard.webp';
import { NavBar } from '../../components/molecules/PreAuthorizedPageComponents/NavBar';
import FooterElement from '../../components/molecules/PreAuthorizedPageComponents/FooterElement';
import { fetchGetCompanies, fetchGetCompanyLogos } from "../../store/feature/companySlice";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LogoCard from "../../components/molecules/PreAuthorizedPageComponents/LogoCard";

const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
}));

const Header = styled('header')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100vh - 64px)',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.primary.main,
  width: '100%',
  padding: theme.spacing(4, 0),
}));

const Body = styled('main')(({ theme }) => ({
  flex: '1',
  width: '100%',
  marginTop: theme.spacing(5),
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

function LandingPage() {
  const dispatch: HumanResources = useDispatch();
  const featureList = useSelector((state: RootState) => state.feature.featuresList);
  const logoList = useSelector((state: RootState) => state.company.logoList);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchGetFeatures());
      await dispatch(fetchGetCompanyLogos());
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (!loading) {
      const intervalId = setInterval(() => {
        handleNext();
      }, 3000);
      return () => clearInterval(intervalId);
    }
  }, [loading, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % logoList.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex - 1 + logoList.length) % logoList.length
    );
  };

  const visibleLogos = [
    ...logoList.slice(currentIndex, currentIndex + 5),
    ...logoList.slice(0, Math.max(0, (currentIndex + 5) - logoList.length)),
  ];

  return (
    <Root>
      <CssBaseline />
      <NavBar />
      <Header>
        <Container maxWidth="sm">
          <Box sx={{ textAlign: 'center' }}>
            <Typography component="h1" variant="h3" align="center" color="white" gutterBottom>
              Making your work easier one step at a time
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              <Grid item>
                <Button variant="contained" sx={{ borderRadius: '20px', bgcolor: '#57B375', color: 'white' }}>
                  Book Demo
                </Button>
              </Grid>
            </Grid>
            <Box sx={{ mt: 4 }}>
              <img
                src={Dashboard}
                style={{ width: '100%' }}
                alt="Description of the image"
              />
            </Box>
          </Box>
        </Container>
      </Header>
      <Body>
        {!loading && (
          <LogoContainer sx={{ marginBottom: '5%', marginTop: '5%' }}>
            <IconButton onClick={handlePrev}>
              <ArrowBackIosIcon />
            </IconButton>
            <Logos>
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
        )}
        <CardGrid maxWidth="md" sx={{ marginBottom: '5%' }}>
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
      <Footer>
        <CssBaseline />
        <FooterElement />
      </Footer>
    </Root>
  );
}

export default LandingPage;
