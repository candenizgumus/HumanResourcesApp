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
import { NavBar } from '../../../components/molecules/PreAuthorizedPageComponents/NavBar';
import FooterElement from '../../../components/molecules/PreAuthorizedPageComponents/FooterElement';
import Image from '../../../images/involve_employees_in_online_performance_appraisal.png'
import RetargetImg from "../../../images/retargeting.png";
import ThemeElement from '../../../components/atoms/ThemeElement';
const Root = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: theme.palette.myBackgroundColour.main,
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

function PerformanceEvaluationPage() {
    const featuresRef = useRef(null);

    return (
        <ThemeElement children={
            <Root>
                <CssBaseline />
                <NavBar />
                <Header>
                    <Container maxWidth="lg">
                        <Box py={5}>
                            <Grid container spacing={4} alignItems="center">
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h2" gutterBottom>
                                        Performance Evaluation
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        Our performance evaluation feature helps you track and assess the performance of your employees
                                        with ease and efficiency.
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box
                                        component="img"
                                        src={Image}
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
                                            title={""}
                                            sx={{ mx: 'auto', mb: 2 }}
                                            style={{ width: '64px', height: '64px', objectFit: 'contain' }}
                                        />
                                        <Typography variant="h6">Comprehensive Reports</Typography>
                                        <Typography variant="body1" sx={{ flexGrow: 1 }}>
                                            Generate detailed performance reports to gain insights into your team's productivity and areas of improvement.
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%' }}>
                                        <CardMedia
                                            component="img"
                                            image={RetargetImg}
                                            title={""}
                                            sx={{ mx: 'auto', mb: 2 }}
                                            style={{ width: '64px', height: '64px', objectFit: 'contain' }}
                                        />
                                        <Typography variant="h6">Real-time Feedback</Typography>
                                        <Typography variant="body1" sx={{ flexGrow: 1 }}>
                                            Provide immediate feedback to your employees to help them improve their performance in real-time.
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%' }}>
                                        <CardMedia
                                            component="img"
                                            image={RetargetImg}
                                            title={""}
                                            sx={{ mx: 'auto', mb: 2 }}
                                            style={{ width: '64px', height: '64px', objectFit: 'contain' }}
                                        />
                                        <Typography variant="h6">Customizable Criteria</Typography>
                                        <Typography variant="body1" sx={{ flexGrow: 1 }}>
                                            Customize the evaluation criteria to match your company's unique performance metrics and standards.
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
        } />
    );
}

export default PerformanceEvaluationPage;
