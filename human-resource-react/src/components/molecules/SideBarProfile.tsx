import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { TextField, Button, Box, Grid, InputLabel, Select, MenuItem, FormControl, Avatar, Typography } from '@mui/material';
import { HumanResources, useAppSelector } from "../../store";
import { IUser } from "../../models/IUser";
import {
    fetchFindCompanyNameAndManagerNameOfUser,
    fetchFindUserByToken,
    fetchGetPositions, fetchUpdateUser
} from "../../store/feature/authSlice";
import { useDispatch } from "react-redux";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from "dayjs";
import sweetalert2 from "sweetalert2";
import Swal from "sweetalert2";
import { CloudUpload } from '@mui/icons-material';
import styled from '@emotion/styled';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { uploadPlayerProfileImage } from '../../store/feature/awsSlice';
import { IUpdateUserProfile } from '../../models/IUpdateUserProfile';
import { fetchGetDefinitions, IDefinition } from '../../store/feature/definitionSlice';
import { EDefinitionType } from '../../models/IDefinitionType';


const SideBarProfile = () => {
    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const user: IUser = useAppSelector((state) => state.auth.user);
    const [hireDate, setHireDate] = useState(user.hireDate ?? '');
    const [userType, setUserType] = useState<string>(user.userType ?? '');
    const [sector, setSector] = useState<string>(user.sector ?? '');
    const [employeeType, setEmployeeType] = useState<string>(user.employeeType ?? '');
    const [subscriptionType, setSubscriptionType] = useState<string>(user.subscriptionType ?? '');
    const [subscriptionStartDate, setSubscriptionStartDate] = useState(user.subscriptionStartDate ?? '');
    const [subscriptionEndDate, setSubscriptionEndDate] = useState(user.subscriptionEndDate ?? '');

    const [positions, setPositions] = useState<IDefinition[]>([]);
    const [employeeTypes, setEmployeeTypes] = useState<IDefinition[]>([]);

    const [companyName, setCompanyName] = useState<string>('');

    const [selectedPosition, setSelectedPosition] = useState<string>(user.position ?? '');
    const [loading, setLoading] = useState(true);

    const defaultDate = dayjs('1996-07-27');
    const initialDob = user.birthDate ? dayjs(user.birthDate) : defaultDate;
    const [dob, setDob] = useState<Dayjs | null>(initialDob);
    const [isUploading, setIsUploading] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const [birthDate, setBirthDate] = useState<Date | null>(null);

    const [formState, setFormState] = useState<IUpdateUserProfile>({
        name: user.name,
        surname: user.surname,
        phone: user.phone,
        title: user.title,
        location: user.location,
        birthDate: initialDob.toISOString(),
        position: user.position,
        photo: null
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: value,
        });
    };

    const setUserInfos = async () => {
        try {
            await dispatch(fetchFindUserByToken(token)).unwrap();

            let result = await dispatch(fetchFindCompanyNameAndManagerNameOfUser(token)).unwrap();
            if (result.code) {
                return;
            }

            setCompanyName(result.companyName ?? '');
            dispatch(fetchGetDefinitions({
                token: token,
                definitionType: EDefinitionType.EMPLOYEE_TYPE
            }))

            const positions = await dispatch(fetchGetDefinitions({
                token: token,
                definitionType: EDefinitionType.POSITION
            })).unwrap();
            setPositions(positions)

            setHireDate(user.hireDate ?? '');
            setUserType(user.userType ?? '');
            setSector(user.sector ?? '');
            setEmployeeType(user.employeeType ?? '');
            setSubscriptionType(user.subscriptionType ?? '');
            setSubscriptionStartDate(user.subscriptionStartDate ?? '');
            setSubscriptionEndDate(user.subscriptionEndDate ?? '');
            setSelectedPosition(user.position ?? '');

            const employeeTypes = await dispatch(fetchGetDefinitions({
                token: token,
                definitionType: EDefinitionType.EMPLOYEE_TYPE
            })).unwrap();
            setEmployeeTypes(employeeTypes)

        } catch (error) {
            console.error('Error in setUserInfos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setUserInfos();
    }, [token]);

    useEffect(() => {
        if (user && !loading) {
            setFormState({
                ...formState,
                name: user.name ?? '',
                surname: user.surname ?? '',
                phone: user.phone ?? '',
                title: user.title ?? '',
                location: user.location ?? '',
            });
            setBirthDate(user.birthDate ?? '');
            setHireDate(user.hireDate ?? '');
            setUserType(user.userType ?? '');
            setSector(user.sector ?? '');
            setEmployeeType(user.employeeType ?? '');
            setSubscriptionType(user.subscriptionType ?? '');
            setSubscriptionStartDate(user.subscriptionStartDate ?? '');
            setSubscriptionEndDate(user.subscriptionEndDate ?? '');
            setSelectedPosition(user.position ?? '');
        }
    }, [user, loading]);

    const updateUserProfile = async () => {


        if (!formState.name || !formState.surname || !formState.phone || !formState.title || birthDate === null || !selectedPosition || !formState.location) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill all the fields!',
            });
            return;
        }




        // After the image upload is successful, update the user profile
        dispatch(fetchUpdateUser({
            token: token,
            name: formState.name,
            surname: formState.surname,
            phone: formState.phone,
            title: formState.title,
            birthDate: birthDate,
            position: selectedPosition,
            location: formState.location
        })).then((data) => {
            // Handle the result of the profile update
            if (data.payload) {
                sweetalert2.fire({
                    icon: 'success',
                    title: 'Your profile has been updated successfully',
                    showConfirmButton: false,
                    timer: 1500
                });

                // Fetch the updated user data using the token
                return dispatch(fetchFindUserByToken(token));
            }
        })
            .catch((error) => {
                // Handle any errors that occurred during the image upload, profile update, or user data fetch
                console.error("Error updating profile:", error);
                sweetalert2.fire({
                    icon: 'error',
                    title: 'Failed to update your profile',
                    text: error.message || 'An unknown error occurred',
                    showConfirmButton: true,
                });
            });

    }

    const updatePhoto = () => {
        if (!formState.photo) {
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', formState.photo);
        try {
            dispatch(uploadPlayerProfileImage(formData))
                .then(() => {
                    return dispatch(fetchFindUserByToken(token));
                })
                .finally(() => {
                    setIsUploading(false);
                    setIsSelected(false);
                    sweetalert2.fire({
                        icon: 'success',
                        title: 'Your profile picture has been updated successfully',
                        showConfirmButton: false,
                        timer: 1500
                    });
                })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            sweetalert2.fire({
                icon: 'error',
                title: 'Failed to upload your profile image',
                text: errorMessage,
                showConfirmButton: true,
            });
        };
    };

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
    // 3073272
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic']
    const maxImageSize = 103073272
    const [error, setError] = useState('');

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

    console.log(user);
    return (


        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Box
                    component="form"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        maxWidth: 800,
                        margin: 'auto',
                        alignItems: 'center',
                    }}
                >
                    <label htmlFor="upload-photo">
                        {isSelected ?

                            <Avatar
                                src={formState.photo ? URL.createObjectURL(formState.photo) : undefined}
                                alt={user.name}
                                sx={{
                                    width: 100,
                                    height: 100,
                                    objectFit: 'cover',
                                    objectPosition: 'top',
                                    border: '1px solid',
                                    cursor: 'pointer', // Makes the avatar look clickable
                                }}
                            />


                            : <Avatar
                                src={user.photo}
                                alt={user.name}
                                sx={{
                                    width: 100,
                                    height: 100,
                                    objectFit: 'cover',
                                    objectPosition: 'top',
                                    border: '1px solid',
                                    cursor: 'pointer', // Makes the avatar look clickable
                                }}
                            />}

                    </label>
                    <VisuallyHiddenInput
                        id="upload-photo"
                        type="file"
                        onChange={handleFileChange}
                    />
                </Box>
            </Grid>
            <Grid sx={{ justifyContent: 'center' ,marginY: 3, marginLeft:0.8}} container spacing={2}>
                <Grid >
                    {error && (
                        <Typography color="error">{error}</Typography>
                    )}
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUpload />}
                        onClick={updatePhoto}
                        disabled={isUploading || !isSelected}
                    >
                        {isUploading ? 'Uploading...' : 'Upload Image'}

                    </Button>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <Box
                    component="form"
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
                        label='Name'
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        fullWidth
                        required
                        inputProps={{ maxLength: 50 }}

                    />
                    <TextField
                        label='Surname'
                        name="surname"
                        value={formState.surname}
                        onChange={handleChange}
                        fullWidth
                        required
                        inputProps={{ maxLength: 50 }}
                    />
                    <TextField
                        label='Phone'
                        name="phone"
                        value={formState.phone}
                        onChange={handleChange}
                        fullWidth
                        required
                        type={"tel"}
                        inputProps={{ maxLength: 50 }}
                    />

                    <TextField
                        label='Title'
                        name="title"
                        value={formState.title}
                        onChange={handleChange}
                        fullWidth
                        required
                        inputProps={{ maxLength: 50 }}
                    />
                    <TextField
                        label='Location'
                        name="location"
                        value={formState.location}
                        onChange={handleChange}
                        fullWidth
                        required
                        inputProps={{ maxLength: 50 }}
                    />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Birth Date"
                            value={birthDate ? dayjs(birthDate) : null}
                            onChange={(newValue) => setBirthDate(newValue ? newValue.toDate() : null)}

                        />
                    </LocalizationProvider>

                    <FormControl variant="outlined">
                        <InputLabel>{'Please Select Your Position'}</InputLabel>
                        <Select
                            value={selectedPosition}
                            onChange={event => setSelectedPosition(event.target.value as string)}
                            label="Position"
                        >
                            {Object.values(positions).map(position => (
                                <MenuItem key={position.name} value={position.name}>
                                    {position.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button onClick={updateUserProfile} sx={{ mt: 5 }} type="button" variant="contained" color="primary">
                        Update Profile
                    </Button>
                </Box>
            </Grid>
            <Grid item xs={6}>
                <Box
                    component="form"
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
                        label="Email"
                        name="email"
                        value={user.email}
                        fullWidth
                        disabled
                    />
                    <TextField
                        label="User Type"
                        name="userType"
                        value={userType}
                        fullWidth
                        disabled
                    />
                    
                    {
                        user.employeeType && (
                            <TextField
                                label="Employe Type"
                                name="employeeTypeDefinitionId"
                                value={user.employeeType}
                                fullWidth
                                disabled
                            />
                        )
                    }
                    {
                        user.sector && (
                            <TextField
                                label="Sector"
                                name="sector"
                                value={sector}
                                fullWidth
                                disabled
                            />
                        )
                    }

                    {
                        user.companyId &&
                        (
                            <TextField
                                label="Company Name"
                                name="companyName"
                                value={companyName}
                                fullWidth
                                disabled
                            />
                        )
                    }
                    {
                        user.subscriptionType && (
                            <TextField
                                label="Subscription Type"
                                name="subscriptionType"
                                value={subscriptionType}
                                fullWidth
                                disabled
                            />
                        )
                    }
                    {
                        user.subscriptionStartDate && (
                            <TextField
                                label="Subscription Start Date"
                                name="subscriptionStartDate"
                                value={subscriptionStartDate}
                                fullWidth
                                disabled
                            />
                        )
                    }

                    {
                        user.subscriptionEndDate && (
                            <TextField
                                label="Subscription End Date"
                                name="subscriptionEndDate"
                                value={subscriptionEndDate}
                                fullWidth
                                disabled
                            />
                        )
                    }

                    {
                        user.hireDate && (
                            <TextField
                                label="Hired Date"
                                name="hireDate"
                                value={hireDate}
                                fullWidth
                                disabled
                            />
                        )
                    }


                </Box>
            </Grid>
        </Grid>







    );
};

export default SideBarProfile;
