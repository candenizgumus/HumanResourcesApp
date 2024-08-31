import React, { useState, FormEvent, useEffect } from 'react';
import {
    TextField,
    Button,
    Box,
    Grid,
    Avatar,
    IconButton,
    InputLabel,
    Select,
    MenuItem,
    FormControl
} from '@mui/material';
import { HumanResources, useAppSelector } from "../../../store";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { fetchGetCompanyDataOfManager, fetchUpdateCompanyByManager } from "../../../store/feature/companySlice";
import sweetalert2 from "sweetalert2";
import styled from "@emotion/styled";
import { IFile } from "../../../models/IFile";
import { CloudUpload } from "@mui/icons-material";
import { myErrorColour, myLightColour } from '../../../util/MyColours';
import { ICountries } from "../../../models/ICountries";

const SideBarCompany: React.FC = () => {


    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useDispatch<HumanResources>();
    const company = useAppSelector((state) => state.company.company);
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const [numberOfEmployee, setNumberOfEmployee] = useState<string>('');
    const [logo, setLogo] = useState<string>('');
    const [formState, setFormState] = useState<IFile>({
        photo: null
    });

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


    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic']
    const maxImageSize = 103073272
    const [error, setError] = useState('');
    const [isSelected, setIsSelected] = useState(false);

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {

            const file = e.target.files[0];
            console.log(file);
            if (!validImageTypes.find(fileType => fileType === file.type) || file.size > maxImageSize) {
                setError('File must be in [jpg, png, heic] format. Max size 3.1 Mb!');
                return;
            }
            console.log('not reachable')
            setFormState({
                ...formState,
                photo: e.target.files[0]
            });
            setIsSelected(true)
        }

    };
    const updateCompany = () => {

        if (!name || !description || !country) {
            Swal.fire({
                icon: 'error',
                text: 'Please fill all the fields!',
                confirmButtonColor: myLightColour,
                cancelButtonColor: myErrorColour,
            });
            return;
        }
        dispatch(fetchUpdateCompanyByManager({

            token: token,
            name: name,
            description: description,
            country: country,
            photo: formState.photo

        })).then((data) => {
            if (data.payload.message) {
                sweetalert2.fire({
                    icon: 'error',
                    text: data.payload.message ?? 'Failed to update company',
                    showConfirmButton: true,
                    confirmButtonColor: myLightColour,
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

        <Grid container spacing={2} sx={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'stretch', margin: '0', padding: '0' }}>
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
                    <label htmlFor="upload-photo">
                        <Box sx={{ position: 'relative', display: 'inline-block' }}>
                            <Avatar
                                sx={{
                                    width: 100,
                                    height: 100,
                                    border: '1px solid',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <img
                                    src={formState.photo ? URL.createObjectURL(formState.photo) : logo}
                                    alt="Profile"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',  // Resmin tamamını sığdırır
                                    }}
                                />
                            </Avatar>
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                    padding: 0.5,
                                }}
                                component="span"
                            >
                                <CloudUpload />
                            </IconButton>
                        </Box>
                    </label>
                    <VisuallyHiddenInput
                        id="upload-photo"
                        type="file"
                        onChange={handleFileChange}
                    />
                </Box>

            </Grid>
            <Grid item xs={6}>
                <Grid container spacing={2} sx={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'stretch' }}>
                    <Grid item xs={12}>
                        <TextField
                            label='Company Name'
                            name="name"
                            value={name}
                            onChange={event => setName(event.target.value)}
                            fullWidth
                            required
                            inputProps={{ maxLength: 50 }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label='Description'
                            name="description"
                            value={description}
                            onChange={event => setDescription(event.target.value)}
                            fullWidth
                            required
                            inputProps={{ maxLength: 50 }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl variant="outlined" sx={{ width: '100%' }}>
                            <InputLabel>{'Please Select Your Country'}</InputLabel>
                            <Select
                                required
                                value={country}
                                onChange={event => setCountry(event.target.value as string)}
                                label="Country"
                                
                            >
                                {Object.values(ICountries).map(country => (
                                    <MenuItem key={country.valueOf()} value={country.valueOf()}>
                                        {country.valueOf()}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button onClick={updateCompany} sx={{ width: '100%' }} type="button" variant="contained" color="success">
                            Update Company
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <Grid container spacing={2} sx={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'stretch' }}>
                    <Grid item xs={12}>
                        <TextField
                            label='Number Of Employees'
                            name="numberOfEmployee"
                            value={numberOfEmployee}
                            fullWidth
                            disabled={true}

                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SideBarCompany;
