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
import image from "../../../images/manage_your_recruitment_processes_from_a_single_platform.png";
import RetargetImg from "../../../images/retargeting.png";
import ReportsImg from "../../../images/generate_reports.png";
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

function RecruitmentPage() {
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
                                    <Box
                                        component="img"
                                        src={image}
                                        alt="Header Image"
                                        sx={{ width: '100%', height: 'auto' }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h2" gutterBottom>
                                        Recruitment & Candidate Tracking System
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        Our comprehensive recruitment and candidate tracking system streamlines the hiring process, making it easier to find the right talent for your organization.
                                    </Typography>
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
                                        <Typography variant="h6">Automated Job Posting</Typography>
                                        <Typography variant="body1" sx={{ flexGrow: 1 }}>
                                            Post jobs to multiple platforms with a single click, saving time and reaching a wider audience.
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
                                        <Typography variant="h6">Candidate Management</Typography>
                                        <Typography variant="body1" sx={{ flexGrow: 1 }}>
                                            Easily track and manage candidates through each stage of the recruitment process.
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%' }}>
                                        <CardMedia
                                            component="img"
                                            image={ReportsImg}
                                            title={""}
                                            sx={{ mx: 'auto', mb: 2 }}
                                            style={{ width: '64px', height: '64px', objectFit: 'contain' }}
                                        />
                                        <Typography variant="h6">Analytics and Reporting</Typography>
                                        <Typography variant="body1" sx={{ flexGrow: 1 }}>
                                            Generate insightful reports to analyze recruitment performance and make data-driven decisions.
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

export default RecruitmentPage;
