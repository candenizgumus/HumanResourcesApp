import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { HumanResources } from '../../store';
import {fetchCreateHoliday, fetchHolidays} from '../../store/feature/holidaySlice';
import Swal from 'sweetalert2';
import {Box, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem} from '@mui/material';


const HolidayFormSection = () => {
    const dispatch = useDispatch<HumanResources>();

    const [holidayName, setHolidayName] = useState('');
    const [holidayType, setHolidayType] = useState('');
    const [holidayStartDate, setHolidayStartDate] = useState(0);
    const [holidayEndDate, setHolidayEndDate] = useState(0);

    const handleSubmit = () => {
        if (!holidayName || !holidayType || !holidayStartDate || !holidayEndDate) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill all the fields!',
            });
            return;
        }
        console.log('Holiday Start Date:', holidayStartDate);
        dispatch(fetchCreateHoliday({
            holidayName,
            holidayType,
            holidayStartDate,
            holidayEndDate
        }))
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Holiday has been submitted successfully.',
                });
            })
            .then(() => {
                dispatch(fetchHolidays());
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
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth required>
                        <InputLabel>Holiday Type</InputLabel>
                        <Select
                            value={holidayType}
                            onChange={(e) => setHolidayType(e.target.value)}
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
                    <TextField
                        label="Holiday Start Date"
                        value={holidayStartDate}
                        onChange={(e) => setHolidayStartDate(Number(e.target.value))}
                        fullWidth
                        required
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Holiday End Date"
                        value={holidayEndDate}
                        onChange={(e) => setHolidayEndDate(Number(e.target.value))}
                        fullWidth
                        required
                        InputLabelProps={{
                            shrink: true,
                        }}
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
}

export default HolidayFormSection;


