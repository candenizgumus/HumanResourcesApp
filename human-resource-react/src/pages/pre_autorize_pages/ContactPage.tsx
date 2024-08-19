import React, { useState, useEffect } from 'react';
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
import { HumanResources } from '../../store';
import { useDispatch } from 'react-redux';
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

const ContactForm = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: 'auto',
  maxWidth: 600,
  textAlign: 'center',
}));

const loginButtonStyle = {
  backgroundColor:  'primary.main',
  color: 'white',
  mt: 3, mb: 2,
  '&:hover': {
    color: 'primary.main',
        },
};

function ContactUsPage() {
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
    <ThemeElement children={
      <Root>
        <CssBaseline />
        <NavBar />
        <HeaderElement headline='Contact Us' text='We would love to hear from you! Please fill out the form below and
              we will get in touch with you as soon as possible'/>
        <Body>
          <Container maxWidth="lg">
            <Box py={5}>
              <Typography component="h1" variant="h4" align="center" color="primary.main" gutterBottom sx={{ paddingBottom: 5 }}>
                Get in Touch
              </Typography>
              <ContactForm elevation={3}>
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
                        sx={loginButtonStyle}
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
    } />
  );
}

export default ContactUsPage;
