import React, {useState} from 'react';
import { Container, Typography, Box, TextField, Button, Grid, Paper } from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import {HumanResources, useAppSelector} from "../../store";
import {fetchCreateOffer} from "../../store/feature/getOfferSlice";

const FormSection = () => {

    const dispatch = useDispatch<HumanResources>();

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [title, setTitle] = useState('');
    const [numberOfEmployee, setNumberOfEmployee] = useState('');
    const [companyName, setCompanyName] = useState('');
    //const token = useAppSelector((state) => state.auth.token);

    const handleSubmit = () => {
        dispatch(fetchCreateOffer({
            name: name,
            surname: surname,
            email: email,
            phone: phone,
            title: title,
            numberOfEmployee: numberOfEmployee,
            companyName: companyName
            //token: token
        }))
    }


    return (
        <Box sx={{ py: 8, bgcolor: 'background.default' }}>
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Get Offer
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField onChange={(e) => setName(e.target.value)} fullWidth label="Name" variant="outlined" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField onChange={(e) => setSurname(e.target.value)} fullWidth label="Surname" variant="outlined" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField onChange={(e) => setEmail(e.target.value)} fullWidth label="E-mail" variant="outlined" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField onChange={(e) => setPhone(e.target.value)} fullWidth label="Phone" variant="outlined" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField onChange={(e) => setTitle(e.target.value)} fullWidth label="Title" variant="outlined" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField onChange={(e) => setNumberOfEmployee(e.target.value)} fullWidth label="Employee Count" variant="outlined" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField onChange={(e) => setCompanyName(e.target.value)} fullWidth label="Company Name" variant="outlined" />
                        </Grid>
                        <Grid item xs={12}>
                            <Button onClick={handleSubmit} fullWidth variant="contained" color="primary" size="large">GET YOUR OFFER</Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
};

export default FormSection;