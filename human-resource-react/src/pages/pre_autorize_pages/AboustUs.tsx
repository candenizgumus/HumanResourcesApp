import React, { useEffect, useRef } from 'react';
import {
  Typography,
  Container,
  CssBaseline,
  Box,
  Grid,
  Paper,
  Avatar,
  ButtonBase,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { NavBar } from '../../components/molecules/PreAuthorizedPageComponents/NavBar';
import FooterElement from '../../components/molecules/PreAuthorizedPageComponents/FooterElement';
import HeaderElement from '../../components/atoms/Header';
import ThemeElement from '../../components/atoms/ThemeElement';

const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
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

function AboutUsPage() {
  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);
  // Define the handler function
  const handleCardClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <ThemeElement children={
      <Root>
        <CssBaseline />
        <NavBar />
        <HeaderElement headline='About Us' text='We are a group of developers dedicated to building the best solutions for our customers.' />
        <Body>
          <Container maxWidth="lg">
            <Box py={5}>
              <Typography component="h1" variant="h4" align="center" color="primary.main" gutterBottom sx={{ paddingBottom: 5 }}>
                Our Team
              </Typography>
              <Grid container spacing={4} justifyContent="center">
                {/* Team Member 1 */}
                <Grid item xs={12} sm={6} md={4} sx={{
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.01)'
                  }
                }}>
                  <ButtonBase onClick={() => handleCardClick('https://github.com/candenizgumus')}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                      <Avatar
                        alt="Can Deniz Gümüş"
                        src="/path/to/avatar1.jpg"
                        sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                      />
                      <Typography variant="h6">Can Deniz Gümüş</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Developer
                      </Typography>
                      <Typography variant="body1">
                        Short bio about the team member, their experience, and role in the project.
                      </Typography>
                    </Paper>
                  </ButtonBase>
                </Grid>
                {/* Team Member 2 */}
                <Grid item xs={12} sm={6} md={4} sx={{
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.01)'
                  }
                }}>
                  <ButtonBase onClick={() => handleCardClick('https://github.com/hcaslan')}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                      <Avatar
                        alt="Heval Can Aslan Özen"
                        src="/path/to/avatar2.jpg"
                        sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                      />
                      <Typography variant="h6">Heval Can Aslan Özen</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Developer
                      </Typography>
                      <Typography variant="body1">
                        Short bio about the team member, their experience, and role in the project.
                      </Typography>
                    </Paper>
                  </ButtonBase>
                </Grid>
                {/* Team Member 3 */}
                <Grid item xs={12} sm={6} md={4} sx={{
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.01)'
                  }
                }}>
                  <ButtonBase onClick={() => handleCardClick('https://github.com/Hicranarslan')}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                      <Avatar
                        alt="Hicran Arslan"
                        src="/path/to/avatar3.jpg"
                        sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                      />
                      <Typography variant="h6">Hicran Arslan</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Developer
                      </Typography>
                      <Typography variant="body1">
                        Short bio about the team member, their experience, and role in the project.
                      </Typography>
                    </Paper>
                  </ButtonBase>
                </Grid>
                {/* Team Member 4 */}
                <Grid item xs={12} sm={6} md={4} sx={{
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.01)'
                  }
                }}>
                  <ButtonBase onClick={() => handleCardClick('https://github.com/keremoktener')}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                      <Avatar
                        alt="Kenan Kerem Öktener"
                        src="/path/to/avatar4.jpg"
                        sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                      />
                      <Typography variant="h6">Kenan Kerem Öktener</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Developer
                      </Typography>
                      <Typography variant="body1">
                        Short bio about the team member, their experience, and role in the project.
                      </Typography>
                    </Paper>
                  </ButtonBase>
                </Grid>
                {/* Team Member 5 */}
                <Grid item xs={12} sm={6} md={4} sx={{
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.01)'
                  }
                }}>
                  <ButtonBase onClick={() => handleCardClick('https://github.com/EmirEsen')}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                      <Avatar
                        alt="Sami Emir Esen"
                        src="/path/to/avatar5.jpg"
                        sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                      />
                      <Typography variant="h6">Sami Emir Esen</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Developer
                      </Typography>
                      <Typography variant="body1">
                        Short bio about the team member, their experience, and role in the project.
                      </Typography>
                    </Paper>
                  </ButtonBase>
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

export default AboutUsPage;
