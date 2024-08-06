import React, { useRef } from 'react';
import {
    Typography,
    Container,
    CssBaseline,
    Box,
    Grid,
    Paper,
    CardMedia,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { NavBar } from '../../../components/molecules/NavBar';
import FooterElement from '../../../components/molecules/FooterElement';
import HeaderImage from '../../../images/plan_and_manage_your_working_time_in_the_most_efficient_way.png'
import RetargetImg from "../../../images/retargeting.png";

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

function SchedulingManagementPage() {
    const featuresRef = useRef(null);

    return (
        <Root>
            <CssBaseline />
            <NavBar featuresRef={featuresRef} />
            <Header>
                <Container maxWidth="lg">
                    <Box py={5}>
                        <Grid container spacing={4} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <Typography variant="h2" gutterBottom>
                                    Scheduling Management
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    Efficiently manage employee schedules and ensure smooth operations with our scheduling management feature.
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box
                                    component="img"
                                    src={HeaderImage}
                                    alt="Header Image"
                                    sx={{ width: '100%', height: 'auto' }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </Header>
            <Body>
                <Container maxWidth="lg">
                    <Box py={5}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper elevation={3} sx={{ p: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <CardMedia
                                        component="img"
                                        image={RetargetImg}
                                        title="Automated Scheduling"
                                        sx={{ mx: 'auto', mb: 2 }}
                                        style={{ width: '64px', height: '64px', objectFit: 'contain' }}
                                    />
                                    <Typography variant="h6">Automated Scheduling</Typography>
                                    <Typography variant="body1" sx={{ flexGrow: 1 }}>
                                        Automatically create schedules based on employee availability and preferences.
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper elevation={3} sx={{ p: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <CardMedia
                                        component="img"
                                        image={RetargetImg}
                                        title="Shift Swapping"
                                        sx={{ mx: 'auto', mb: 2 }}
                                        style={{ width: '64px', height: '64px', objectFit: 'contain' }}
                                    />
                                    <Typography variant="h6">Shift Swapping</Typography>
                                    <Typography variant="body1" sx={{ flexGrow: 1 }}>
                                        Allow employees to easily swap shifts with their colleagues.
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper elevation={3} sx={{ p: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <CardMedia
                                        component="img"
                                        image={RetargetImg}
                                        title="Real-Time Notifications"
                                        sx={{ mx: 'auto', mb: 2 }}
                                        style={{ width: '64px', height: '64px', objectFit: 'contain' }}
                                    />
                                    <Typography variant="h6">Real-Time Notifications</Typography>
                                    <Typography variant="body1" sx={{ flexGrow: 1 }}>
                                        Receive instant updates and notifications about schedule changes.
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </Body>
            <Footer>
                <CssBaseline />
                <FooterElement />
            </Footer>
        </Root>
    );
}

export default SchedulingManagementPage;
