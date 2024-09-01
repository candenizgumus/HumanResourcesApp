import React, { useEffect } from 'react';
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
import aslan from '../../images/aslan.jpg';
import emir from '../../images/emir.jpg';
import deniz from '../../images/deniz.png';
import kerem from '../../images/kerem.jpeg';
import hicran from '../../images/hicran.jpeg';

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
            <Grid item xs={12} sx={{ textAlign: 'center', paddingTop: 2 }}>
              <Typography component="h1" variant="h4" align="center" color="primary.main" gutterBottom sx={{ paddingBottom: 5 }}>
                Our Team
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center', paddingTop: 2 }}>
              <Grid container spacing={4} display=' flex' justifyContent="center" alignItems="center">
                {/* Team Member Cards */}
                {[{ name: 'Can Deniz Gümüş', image: deniz, role: 'Full-Stack Java Developer & Game Developer', github: 'https://github.com/candenizgumus' },
                  { name: 'Heval Can Aslan Özen', image: aslan, role: 'Full Stack Developer', github: 'https://github.com/hcaslan' },
                  { name: 'Hicran Arslan', image: hicran, role: 'Software Developer', github: 'https://github.com/Hicranarslan' },
                  { name: 'Kenan Kerem Öktener', image: kerem, role: 'Developer', github: 'https://github.com/keremoktener' },
                  { name: 'Sami Emir Esen', image: emir, role: 'Software Engineer', github: 'https://github.com/EmirEsen' }]
                  .map((member, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index} sx={{
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.01)'
                      }
                    }}>
                      <ButtonBase onClick={() => handleCardClick(member.github)}>
                        <Paper elevation={3} sx={{ p: 2, textAlign: 'center', width: '350px', height: '200px', margin: '0 auto' }}>
                          <Avatar
                            alt={member.name}
                            src={member.image}
                            sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                          />
                          <Typography variant="h6">{member.name}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {member.role}
                          </Typography>
                        </Paper>
                      </ButtonBase>
                    </Grid>
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
    } />
  );
}

export default AboutUsPage;
