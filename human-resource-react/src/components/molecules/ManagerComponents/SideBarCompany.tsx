import React, { useState, FormEvent, useEffect } from 'react';
import { TextField, Button, Box, Grid, Avatar } from '@mui/material';
import { HumanResources, useAppSelector } from "../../../store";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { fetchGetCompanyDataOfManager, fetchUpdateCompanyByManager } from "../../../store/feature/companySlice";
import sweetalert2 from "sweetalert2";

const SideBarCompany: React.FC = () => {


    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useDispatch<HumanResources>();
    const company = useAppSelector((state) => state.company.company);
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const [numberOfEmployee, setNumberOfEmployee] = useState<string>('');
    const [logo, setLogo] = useState<string>('');


    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:',);
    };

    const setCompanyData = async () => {
        try {
            await dispatch(fetchGetCompanyDataOfManager(token)).then(data => {

                setName(data.payload.name);
                setDescription(data.payload.description);
                setCountry(data.payload.country);
                setLogo(data.payload.logo);
                setNumberOfEmployee(data.payload.numberOfEmployee);

            })

        } catch (error) {
            console.error('Error in handleLogin:', error);  // Handle other errors
        }
    };

    useEffect(() => {
        setCompanyData();

    }, [])


    const updateCompany = () => {

        if (!name || !description || !country) {
            Swal.fire({
                icon: 'error',
                text: 'Please fill all the fields!',
                confirmButtonColor: '#1976D2',
            });
            return;
        }
        dispatch(fetchUpdateCompanyByManager({

            token: token,
            name: name,
            description: description,
            country: country,

        })).then((data) => {
            if (data.payload.message) {
                sweetalert2.fire({
                    icon: 'error',
                    text: data.payload.message ?? 'Failed to update company',
                    showConfirmButton: true
                })

            } else {
                sweetalert2.fire({
                    icon: 'success',
                    title: 'Your company has been updated successfully',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        })
    }

    return (

        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        maxWidth: 800,
                        margin: 'auto',
                        alignItems: 'center',
                    }}
                >
                    <Box
                        sx={{
                            width: 150,
                            height: 150,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar
                            alt="Company Logo"
                            src={company.logo}
                            sx={{
                                width: '100%',
                                height: '100%',
                                '& img': {
                                    objectFit: 'contain', // Ensures the image fits within the Avatar
                                },
                            }}
                        />
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={6}>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        maxWidth: 800,
                        margin: 'auto',
                        padding: 2,
                    }}
                >

                    <TextField
                        label='Company Name'
                        name="name"
                        value={name}
                        onChange={event => setName(event.target.value)}
                        fullWidth
                        required
                        inputProps={{ maxLength: 50 }}
                    />
                    <TextField
                        label='Description'
                        name="description"
                        value={description}
                        onChange={event => setDescription(event.target.value)}
                        fullWidth
                        required
                        inputProps={{ maxLength: 50 }}
                    />

                    <TextField
                        label='Country'
                        name="country"
                        value={country}
                        onChange={event => setCountry(event.target.value)}
                        fullWidth
                        required
                        inputProps={{ maxLength: 50 }}
                    />
                    <Button onClick={updateCompany} sx={{ mt: 5 }} type="button" variant="contained" color="primary">
                        Update Company
                    </Button>
                </Box>
            </Grid>
            <Grid item xs={6}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        maxWidth: 800,
                        margin: 'auto',
                        padding: 2,
                    }}
                >
                    <TextField
                        label='Number Of Employees'
                        name="numberOfEmployee"
                        value={numberOfEmployee}
                        fullWidth
                        disabled={true}

                    />
                </Box>
            </Grid>
        </Grid>
    );
};

export default SideBarCompany;
