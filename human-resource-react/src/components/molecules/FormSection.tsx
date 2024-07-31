import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Grid, Paper, FormControlLabel, Checkbox } from '@mui/material';
import { useDispatch } from "react-redux";
import { HumanResources } from "../../store";
import { fetchCreateOffer } from "../../store/feature/getOfferSlice";
import Swal from "sweetalert2";

const FormSection = () => {
    const dispatch = useDispatch<HumanResources>();

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [title, setTitle] = useState('');
    const [numberOfEmployees, setNumberOfEmployees] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const handleSubmit = () => {
        if (!name || !surname || !email || !phone || !title || !numberOfEmployees || !companyName) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill all the fields!',
            });
            return;
        }

        if (!agreedToTerms) {
            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'You must agree to the terms before submitting.',
            });
            return;
        }

        dispatch(fetchCreateOffer({
            name,
            surname,
            email,
            phone,
            title,
            numberOfEmployees,
            companyName
        }))
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Your offer has been submitted successfully.',
                });
            })
            .catch(() => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error submitting your offer. Please try again later.',
                });
            });
    };

    return (
        <Box sx={{ py: 8, bgcolor: 'background.default' }}>
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Get Offer
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                onChange={(e) => setName(e.target.value)}
                                fullWidth
                                label="Name"
                                variant="outlined"
                                value={name}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                onChange={(e) => setSurname(e.target.value)}
                                fullWidth
                                label="Surname"
                                variant="outlined"
                                value={surname}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                onChange={(e) => setEmail(e.target.value)}
                                fullWidth
                                label="E-mail"
                                variant="outlined"
                                value={email}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                onChange={(e) => setPhone(e.target.value)}
                                fullWidth
                                label="Phone"
                                variant="outlined"
                                value={phone}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                onChange={(e) => setTitle(e.target.value)}
                                fullWidth
                                label="Title"
                                variant="outlined"
                                value={title}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                onChange={(e) => setNumberOfEmployees(e.target.value)}
                                fullWidth
                                label="Employee Count"
                                variant="outlined"
                                value={numberOfEmployees}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                onChange={(e) => setCompanyName(e.target.value)}
                                fullWidth
                                label="Company Name"
                                variant="outlined"
                                value={companyName}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label="I agree to the legal terms"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                onClick={handleSubmit}
                                fullWidth
                                variant="contained"
                                color="primary"
                                size="large"
                            >
                                GET YOUR OFFER
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
};

export default FormSection;
