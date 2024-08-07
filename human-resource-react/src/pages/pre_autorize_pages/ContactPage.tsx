import React, { useState, useRef } from 'react';
import {
  Typography,
  Button,
  Grid,
  Container,
  CssBaseline,
  TextField,
  Box,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { NavBar } from '../../components/molecules/NavBar';
import FooterElement from '../../components/molecules/FooterElement';
import Swal from 'sweetalert2';

const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
}));

const Header = styled('header')(({ theme }) => ({
  marginBottom: theme.spacing(4),
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  paddingTop: '0.5%',
}));

const Body = styled('main')(({ theme }) => ({
  marginBottom: theme.spacing(4),
  width: '100%',
  flex: '1',
}));

const Footer = styled('footer')(({ theme }) => ({
  padding: theme.spacing(0),
}));

const ContactForm = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: 'auto',
  maxWidth: 600,
  textAlign: 'center',
}));

function ContactUsPage() {
  const featuresRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Here you can perform any form submission logic, such as sending data to a server.
    // For now, we'll just show a success message and clear the form.

    Swal.fire({
      title: 'Success!',
      text: 'Your message has been sent successfully.',
      icon: 'success',
      confirmButtonText: 'OK',
    });

    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  return (
    <Root>
      <CssBaseline />
      <NavBar/>
      <Header>
        <Container maxWidth="lg">
          <Box py={5} textAlign="center">
            <Typography variant="h2" align="center" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body1" align="center" paragraph>
              We would love to hear from you! Please fill out the form below and
              we will get in touch with you as soon as possible.
            </Typography>
          </Box>
        </Container>
      </Header>
      <Body>
        <Container maxWidth="lg">
          <Box py={5}>
            <ContactForm elevation={3}>
              <Typography component="h1" variant="h5" gutterBottom>
                Get in Touch
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="name"
                      label="Name"
                      variant="outlined"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="email"
                      label="Email"
                      variant="outlined"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="subject"
                      label="Subject"
                      variant="outlined"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="message"
                      label="Message"
                      multiline
                      rows={4}
                      variant="outlined"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </ContactForm>
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

export default ContactUsPage;
