import React, { useRef } from 'react';
import {
  Typography,
  Container,
  CssBaseline,
  Box,
  Grid,
  Paper,
  Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { NavBar } from '../../components/molecules/PreAuthorizedPageComponents/NavBar';
import FooterElement from '../../components/molecules/PreAuthorizedPageComponents/FooterElement';

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

function AboutUsPage() {
  const featuresRef = useRef(null);

  return (
    <Root>
      <CssBaseline />
      <NavBar/>
      <Header>
        <Container maxWidth="lg">
          <Box py={5}>
            <Typography variant="h2" align="center" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body1" align="center" paragraph>
              We are a group of developers dedicated to building a platform similar to Kolay IK, providing
              seamless solutions for businesses. Our team is committed to innovation, quality, and
              customer satisfaction.
            </Typography>
          </Box>
        </Container>
      </Header>
      <Body>
        <Container maxWidth="lg">
          <Box py={5}>
            <Grid container spacing={4} justifyContent="center">
              {/* Team Member 1 */}
              <Grid item xs={12} sm={6} md={4}>
                <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                  <Avatar
                    alt="Member Name"
                    src="/path/to/avatar1.jpg"
                    sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                  />
                  <Typography variant="h6">Member Name</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Position
                  </Typography>
                  <Typography variant="body1">
                    Short bio about the team member, their experience, and role in the project.
                  </Typography>
                </Paper>
              </Grid>
              {/* Team Member 2 */}
              <Grid item xs={12} sm={6} md={4}>
                <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                  <Avatar
                    alt="Member Name"
                    src="/path/to/avatar2.jpg"
                    sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                  />
                  <Typography variant="h6">Member Name</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Position
                  </Typography>
                  <Typography variant="body1">
                    Short bio about the team member, their experience, and role in the project.
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

export default AboutUsPage;
