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
import CircularProgress from '@mui/material/CircularProgress';
import HeaderElement from "../../components/atoms/Header";
import ThemeElement from "../../components/atoms/ThemeElement";

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



export default function UserStoriesPage() {
    const dispatch: HumanResources = useDispatch();
    const userStories = useSelector((state: RootState) => state.userStory.storyList) as IUserStoryResponse[];
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);
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
        <ThemeElement children={
            <Root>
                <CssBaseline />
                <NavBar />
                <HeaderElement headline='User Stories' text='Together with 1000s of human resources professionals, we make HR easier' />
                <Body >
                    <Container maxWidth="lg">
                        <Box py={5}>
                            <Typography component="h1" variant="h4" align="center" color="primary.main" gutterBottom sx={{ paddingBottom: 5 }}>
                                Stories
                            </Typography>
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
};
