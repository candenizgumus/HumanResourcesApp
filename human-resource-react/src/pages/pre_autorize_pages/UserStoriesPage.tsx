import { styled } from "@mui/material/styles";
import React, { useEffect, useRef, useState } from "react";
import { CssBaseline } from "@mui/material";
import { NavBar } from "../../components/molecules/PreAuthorizedPageComponents/NavBar";
import FooterElement from "../../components/molecules/PreAuthorizedPageComponents/FooterElement";
import UserStoryCard from "../../components/molecules/PreAuthorizedPageComponents/UserStoryCard";
import { Container, Grid, Typography, TextField, Box } from "@mui/material";
import { HumanResources, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetUserStories, IUserStoryResponse } from "../../store/feature/userStorySlice";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';

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

const SearchBar = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(4),
    width: '50%',
    backgroundColor: '#fff',
    borderRadius: theme.shape.borderRadius,
}));

export default function UserStoriesPage() {
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
    return (
        <Root>
            <CssBaseline />
            <NavBar />
            <Header sx={{ bgcolor: 'primary.main', width: '100%', padding: '2%' }}>
                <Container maxWidth="lg">
                    <Box sx={{ height: '100%', width: '100%' }}>
                        <Box sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 2 }}>
                            <Typography variant="h2" gutterBottom>
                                User Stories
                            </Typography>

                            <Typography variant="h6" gutterBottom>
                                Together with 1000s of human resources professionals, we make HR easier.
                            </Typography>
                            {
                                // <SearchBar placeholder="Kullanıcı" variant="outlined" />
                            }
                        </Box>
                    </Box>
                </Container>
            </Header>
            <Body sx={{ width: '100%', marginTop: '3.45%' }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '5%', marginTop: '5%' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Container maxWidth="lg">
                        <Grid container spacing={4} sx={{ marginBottom: '10%' }}>
                            {userStories.map((userStory) => (
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
                    </Container>
                )}
            </Body>
            <Footer>
                <CssBaseline />
                <FooterElement />
            </Footer>
        </Root>
    );
};
