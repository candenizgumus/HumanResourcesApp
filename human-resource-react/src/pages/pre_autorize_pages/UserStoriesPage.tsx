import { styled } from "@mui/material/styles";
import React, { useRef } from "react";
import { CssBaseline } from "@mui/material";
import { NavBar } from "../../components/molecules/PreAuthorizedPageComponents/NavBar";
import FooterElement from "../../components/molecules/PreAuthorizedPageComponents/FooterElement";
import UserStoryCard from "../../components/molecules/PreAuthorizedPageComponents/UserStoryCard";
import { Container, Grid, Typography, TextField, Box } from "@mui/material";

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
    const featuresRef = useRef<HTMLDivElement>(null);

    return (
        <Root>
            <CssBaseline />
            <NavBar/>
            <Header sx={{ bgcolor: 'primary.main', width: '100%', padding: '2%' }}>
                <Container maxWidth="lg">
                    <Box sx={{ height: '100%', width: '100%' }}>
                        <Box sx={{bgcolor: 'primary.main',color:'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 2 }}>
                            <Typography variant="h4" gutterBottom>
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
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <UserStoryCard />
                    </Grid>
                </Container>
            </Body>
            <Footer>
                <CssBaseline />
                <FooterElement />
            </Footer>
        </Root>
    );
};
