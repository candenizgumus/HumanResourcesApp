import React, {useEffect, useState} from 'react';
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    Grid,
    Paper,
    FormControlLabel,
    Checkbox,
    InputLabel, Select, MenuItem, FormControl
} from '@mui/material';
import { useDispatch } from "react-redux";
import { HumanResources } from "../../../store";
import { fetchCreateOffer } from "../../../store/feature/offerSlice";
import Swal from "sweetalert2";
import {
     fetchGetSectors
} from "../../../store/feature/authSlice";

const OfferFormSection = () => {
    const dispatch = useDispatch<HumanResources>();

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [title, setTitle] = useState('');
    const [numberOfEmployees, setNumberOfEmployees] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [sector, setSector] = useState([]);
    const [selectedSector, setSelectedSector] = useState<string>('');

    const handleSubmit = () => {
        if (!name || !surname || !email || !phone || !title || !numberOfEmployees || !companyName || !selectedSector) {
            Swal.fire({
                icon: 'error',
                text: 'Please fill all the fields!',
                confirmButtonColor: '#1976D2',
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
            companyName,
            sector: selectedSector
        }))
            .then((data) => {
                if (data.payload.code) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.payload.message,
                    });
                    return;
                }
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Your offer has been submitted successfully.',
                    confirmButtonColor: '#1976D2',
                });
            })

    };

    useEffect(() => {
        dispatch(fetchGetSectors())
            .then(data => {
                setSector(data.payload);
            });
    }, []);

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
                                inputProps={{ maxLength: 50 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                onChange={(e) => setSurname(e.target.value)}
                                fullWidth
                                label="Surname"
                                variant="outlined"
                                value={surname}
                                inputProps={{ maxLength: 50 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                onChange={(e) => setEmail(e.target.value)}
                                fullWidth
                                label="E-mail"
                                variant="outlined"
                                type={"email"}
                                value={email}
                                inputProps={{ maxLength: 50 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                onChange={(e) => setPhone(e.target.value)}
                                fullWidth
                                label="Phone"
                                variant="outlined"
                                value={phone}
                                type={"number"}
                                inputProps={{ maxLength: 50 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                onChange={(e) => setTitle(e.target.value)}
                                fullWidth
                                label="Title"
                                variant="outlined"
                                value={title}
                                inputProps={{ maxLength: 50 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                onChange={(e) => setNumberOfEmployees(e.target.value)}
                                fullWidth
                                label="Employee Count"
                                variant="outlined"
                                value={numberOfEmployees}
                                type={"number"}
                                inputProps={{ maxLength: 50 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                onChange={(e) => setCompanyName(e.target.value)}
                                fullWidth
                                label="Company Name"
                                variant="outlined"
                                value={companyName}
                                inputProps={{ maxLength: 50 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>{'Please Select Your Sector'}</InputLabel>
                                <Select
                                    value={selectedSector}
                                    onChange={event => setSelectedSector(event.target.value as string)}
                                    label="Position"
                                >
                                    {sector.map((sector) => (
                                        <MenuItem key={sector} value={sector}>
                                            {sector}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
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

export default OfferFormSection;
