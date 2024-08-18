import React, { useEffect, useState } from 'react';
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
import { HumanResources, RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGetUserStories, IUserStoryResponse } from '../../store/feature/userStorySlice';
import UserStoryCard from '../../components/molecules/PreAuthorizedPageComponents/UserStoryCard';
import CircularProgress from '@mui/material/CircularProgress';

const Root = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
}));
const CardGrid = styled(Container)(({ theme }) => ({
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
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
    const dispatch: HumanResources = useDispatch();
    const userStories = useSelector((state: RootState) => state.userStory.storyList) as IUserStoryResponse[];
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await dispatch(fetchGetUserStories()).unwrap();
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
    // Split the long description into sentences
    const sentences = userStory.longDescription ? userStory.longDescription.split('. ') : [];

    return (
        <Root>
            <CssBaseline />
            <NavBar />
            <Header>
            {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '5%', marginTop: '5%'}}>
                            <CircularProgress sx={{color:'white'}} />
                        </Box>
                    ) : (
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
                    )}
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
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '5%', marginTop: '5%' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
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
                                {sentences.map((sentence: string, index: number) => (
                                    <Typography key={index} variant="h6" sx={{ marginBottom: '20px', marginTop: '20px' }}>
                                        {sentence.trim() + '.'}
                                    </Typography>
                                ))}
                            </Grid>
                        </Grid>
                    )}
                    <CardGrid maxWidth="md" sx={{ marginBottom: '5%' }}>
                        <Typography component="h1" variant="h4" align="center" color="primary.main" gutterBottom sx={{ paddingBottom: 5 }}>
                            Other User Stories
                        </Typography>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '5%', marginTop: '5%' }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Grid container spacing={4}>
                                {userStories.filter(story => story.id !== userStory.id).map((userStory) => (
                                    <UserStoryCard
                                        key={userStory.id}
                                        id={userStory.id}
                                        managerName={userStory.managerName}
                                        companyName={userStory.companyName}
                                        title={userStory.title}
                                        shortDescription={userStory.shortDescription}
                                        longDescription={userStory.longDescription}
                                        photo={userStory.photo}
                                        sector={userStory.sector}
                                        numberOfEmployees={userStory.numberOfEmployees}
                                        logo={userStory.logo}
                                        country={userStory.country}
                                    />
                                ))}
                            </Grid>
                        )}
                    </CardGrid>
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
