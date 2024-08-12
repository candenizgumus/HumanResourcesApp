import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {HumanResources, useAppSelector} from '../../../store';
import {fetchCreateHolidayAdmin, fetchHolidaysAdmin} from '../../../store/feature/holidaySlice';
import Swal from 'sweetalert2';
import { Box, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const SideBarHolidayFormAdmin: React.FC = () => {
    const dispatch = useDispatch<HumanResources>();

    const [holidayName, setHolidayName] = useState<string>('');
    const [holidayType, setHolidayType] = useState<string>('');
    const token = useAppSelector((state) => state.auth.token);
    const [holidayStartDate, setHolidayStartDate] = useState<Date | null>(null);
    const [holidayEndDate, setHolidayEndDate] = useState<Date | null>(null);

    const handleSubmit = () => {
        if (!holidayName || !holidayType || !holidayStartDate || !holidayEndDate) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill all the fields!',
            });
            return;
        }

        const startEpoch = holidayStartDate.getTime() / 1000;
        const endEpoch = holidayEndDate.getTime() / 1000;

        dispatch(fetchCreateHolidayAdmin({
            holidayName,
            holidayType,
            holidayStartDate: startEpoch,
            holidayEndDate: endEpoch,
            token
        }))
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Holiday has been submitted successfully.',
                });
                dispatch(fetchHolidaysAdmin(token));
            })
            .catch(() => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error. Please try again later.',
                });
            });
    };

    return (
        <Box sx={{ flexGrow: 1, padding: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Holiday Name"
                        value={holidayName}
                        onChange={(e) => setHolidayName(e.target.value)}
                        fullWidth
                        required
                        autoComplete="off"
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth required>
                        <InputLabel>Holiday Type</InputLabel>
                        <Select
                            value={holidayType}
                            onChange={(e) => setHolidayType(e.target.value as string)}
                        >
                            <MenuItem value="PUBLIC">PUBLIC</MenuItem>
                            <MenuItem value="RELIGIOUS">RELIGIOUS</MenuItem>
                            <MenuItem value="NATIONAL">NATIONAL</MenuItem>
                            <MenuItem value="INTERNATIONAL">INTERNATIONAL</MenuItem>
                            <MenuItem value="OTHER">OTHER</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <DatePicker
                        selected={holidayStartDate}
                        onChange={(date: Date | null) => setHolidayStartDate(date)}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select start date"
                        customInput={<TextField
                            fullWidth
                            required
                            autoComplete="off" />}
                    />
                </Grid>
                <Grid item xs={12}>
                    <DatePicker
                        selected={holidayEndDate}
                        onChange={(date: Date | null) => setHolidayEndDate(date)}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select end date"
                        customInput={<TextField
                            fullWidth
                            required
                            autoComplete="off" />}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SideBarHolidayFormAdmin;