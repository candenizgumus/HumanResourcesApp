import React, { useState, useRef, useEffect } from 'react';
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
import { NavBar } from '../../components/molecules/PreAuthorizedPageComponents/NavBar';
import FooterElement from '../../components/molecules/PreAuthorizedPageComponents/FooterElement';
import Swal from 'sweetalert2';
import { fetchSaveContactUsNotification } from '../../store/feature/notificationSlice';
import { HumanResources, useAppSelector } from '../../store';
import { useDispatch } from 'react-redux';

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
  const dispatch = useDispatch<HumanResources>();
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
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
  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form data before dispatch:", formData);
    try {
      await dispatch(fetchSaveContactUsNotification({
        senderName: formData.senderName,
        senderEmail: formData.senderEmail,
        subject: formData.subject,
        message: formData.message,
      })).then(() => {
        setFormData({
          senderName: '',
          senderEmail: '',
          subject: '',
          message: '',
        });
      })
      Swal.fire("Success", "Your message has been sent successfully.", "success");
    } catch (error) {
      console.error("Error sending message:", error);
      Swal.fire("Error", "There was a problem sending the message.", "error");
    }
  };

  return (
    <Root>
      <CssBaseline />
      <NavBar />
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
                      id="senderName"
                      label="Name"
                      variant="outlined"
                      value={formData.senderName}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="senderEmail"
                      label="Email"
                      variant="outlined"
                      value={formData.senderEmail}
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
