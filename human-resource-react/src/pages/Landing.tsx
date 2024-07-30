import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Container,
    CssBaseline,
} from '@mui/material';
import { styled } from '@mui/material/styles';

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

const StyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
}));

const CardMediaStyled = styled(CardMedia)({
    height: 140,
});

const Footer = styled('footer')(({ theme }) => ({
    padding: theme.spacing(6),
}));

function LandingPage() {
    return (
        <Root>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Kolay İK
                    </Typography>
                    <Button color="inherit">Giriş Yap</Button>
                    <Button color="inherit">Teklif Alın</Button>
                </Toolbar>
            </AppBar>

            <main>
                <Header>
                    <Container maxWidth="sm">
                        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                            Dünyanın işini kolaylaştırıyoruz
                        </Typography>
                        <Typography variant="h5" align="center" color="textSecondary" paragraph>
                            Kolay İK ile üç kolay adımda insan kaynakları süreçlerinizi yönetin.
                        </Typography>
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item>
                                <Button variant="contained" color="primary">
                                    15 Gün Ücretsiz Deneyin
                                </Button>
                            </Grid>
                        </Grid>
                    </Container>
                </Header>

                <CardGrid maxWidth="md">
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6} md={4}>
                            <StyledCard>
                                <CardMediaStyled
                                    image="https://source.unsplash.com/random"
                                    title="Image title"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        Feature One
                                    </Typography>
                                    <Typography>
                                        A brief description of this amazing feature.
                                    </Typography>
                                </CardContent>
                            </StyledCard>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <StyledCard>
                                <CardMediaStyled
                                    image="https://source.unsplash.com/random"
                                    title="Image title"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        Feature Two
                                    </Typography>
                                    <Typography>
                                        A brief description of another great feature.
                                    </Typography>
                                </CardContent>
                            </StyledCard>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <StyledCard>
                                <CardMediaStyled
                                    image="https://source.unsplash.com/random"
                                    title="Image title"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        Feature Three
                                    </Typography>
                                    <Typography>
                                        More details about this wonderful feature.
                                    </Typography>
                                </CardContent>
                            </StyledCard>
                        </Grid>
                    </Grid>
                </CardGrid>
            </main>

            <Footer>
                <Typography variant="h6" align="center" gutterBottom>
                    Kolay İK
                </Typography>
                <Typography variant="subtitle1" align="center" color="textSecondary">
                    Making your work easier, one step at a time.
                </Typography>
            </Footer>
        </Root>
    );
}

export default LandingPage;
