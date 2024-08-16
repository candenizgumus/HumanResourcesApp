import React, {useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import {HumanResources, useAppSelector} from '../../../store';
import {fetchCreateHolidayAdmin, fetchHolidaysAdmin} from '../../../store/feature/holidaySlice';
import Swal from 'sweetalert2';
import { Box, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

import 'react-datepicker/dist/react-datepicker.css';
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import sweetalert2 from "sweetalert2";


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
                text: 'Please fill all the fields!',
                confirmButtonColor: '#1976D2',
            });
            return;
        }



        dispatch(fetchCreateHolidayAdmin({
            holidayName,
            holidayType,
            startDate: holidayStartDate,
            endDate: holidayEndDate,
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
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Holiday Start Date"
                            value={holidayStartDate ? dayjs(holidayStartDate) : null}

                            onChange={(newValue) => setHolidayStartDate(newValue ? newValue.toDate() : null)}

                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            shouldDisableDate={holidayStartDate ? (date) => date.isBefore(holidayStartDate) : undefined}
                            label="Holiday End Date"
                            value={holidayEndDate ? dayjs(holidayEndDate) : null}
                            onChange={(newValue) => setHolidayEndDate(newValue ? newValue.toDate() : null)}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={holidayStartDate === null || holidayEndDate === null || holidayName === '' || holidayType === ''}
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