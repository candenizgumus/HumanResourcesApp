import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
    Typography,
    Container,
    CssBaseline,
    Box,
    Grid,
    Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { NavBar } from '../../components/molecules/PreAuthorizedPageComponents/NavBar';
import FooterElement from '../../components/molecules/PreAuthorizedPageComponents/FooterElement';
import LogoCard from '../../components/molecules/PreAuthorizedPageComponents/LogoCard';

const Root = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
}));

const Header = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(4),
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    padding: theme.spacing(3, 0),
}));

const Body = styled('main')(({ theme }) => ({
    flex: '1 0 auto',
    marginTop: theme.spacing(5),
}));

const Footer = styled('footer')(({ theme }) => ({
    flexShrink: 0,
}));

function UserStoryDetailPage() {
    const { companyName } = useParams();
    const location = useLocation();
    const userStory = location.state || {};

    // Split the long description into sentences
    const sentences = userStory.longDescription ? userStory.longDescription.split('. ') : [];

    return (
        <Root>
            <CssBaseline />
            <NavBar />
            <Header>
                <Container maxWidth="lg">
                    <Box py={4}>
                        <Typography variant="h2" align="left" sx={{ margin: '10px' }} gutterBottom>
                            {userStory.companyName}
                        </Typography>
                        <Typography variant="body1" align="left" sx={{ margin: '10px' }} paragraph>
                            {userStory.shortDescription}
                        </Typography>
                    </Box>
                </Container>
            </Header>
            <Body>
                <Container maxWidth="lg">
                    <Grid container spacing={4} sx={{ marginBottom: '5%', alignItems: 'stretch' }}>
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <Typography variant="h6" sx={{ margin: '10px' }}><strong>Sector</strong></Typography>
                                <Typography variant="h6" sx={{ margin: '10px' }}>{userStory.sector}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <Typography variant="h6" sx={{ margin: '10px' }}><strong>Employees</strong></Typography>
                                <Typography variant="h6" sx={{ margin: '10px' }}>{userStory.numberOfEmployees}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <Typography variant="h6" sx={{ margin: '10px' }}><strong>Country</strong></Typography>
                                <Typography variant="h6" sx={{ margin: '10px' }}>{userStory.country}</Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Grid container spacing={4} sx={{ alignItems: 'stretch' }}>
                        <Grid item xs={12} md={2}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                                <LogoCard
                                    logoSrc={userStory.logo}
                                    altText={userStory.companyName}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={10}>
                            {sentences.map((sentence: string, index:number) => (
                                <Typography key={index} variant="h6" sx={{ marginBottom: '20px', marginTop: '20px' }}>
                                    {sentence.trim() + '.'}
                                </Typography>
                            ))}
                        </Grid>
                    </Grid>
                </Container>
            </Body>
            <Footer>
                <CssBaseline />
                <FooterElement />
            </Footer>
        </Root>
    );
}

export default UserStoryDetailPage;
