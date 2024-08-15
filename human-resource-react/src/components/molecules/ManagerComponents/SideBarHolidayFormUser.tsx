import React, {useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import {HumanResources, useAppSelector} from '../../../store';
import {
    fetchCreateHolidayManager, fetchHolidaysAdmin, fetchHolidaysEmployee,
    fetchHolidaysUser
} from '../../../store/feature/holidaySlice';
import Swal from 'sweetalert2';
import {
    Box,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent, Typography, Divider
} from '@mui/material';

import 'react-datepicker/dist/react-datepicker.css';
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";


const SideBarHolidayFormUser: React.FC = () => {
    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const [holidayName, setHolidayName] = useState<string>('');
    const [holidayType, setHolidayType] = useState<string>('');
    const [holidayStartDate, setHolidayStartDate] = useState<Date | null>(null);
    const [holidayEndDate, setHolidayEndDate] = useState<Date | null>(null);
    const [holidays, setHolidays] = useState<any[]>([]);
    const [selectedHolidayId, setSelectedHolidayId] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchHolidaysAdmin(token)).then((action: any) => {
            setHolidays(action.payload);
        });
    }, [dispatch, token]);

    const handleHolidaySelect = (event: SelectChangeEvent<number>) => {
        const selectedId = event.target.value as number;
        setSelectedHolidayId(selectedId);
        const selectedHoliday = holidays.find(holiday => holiday.id === selectedId);
        if (selectedHoliday) {
            setHolidayName(selectedHoliday.holidayName);
            setHolidayType(selectedHoliday.holidayType);
            setHolidayStartDate(new Date(selectedHoliday.startDate));
            setHolidayEndDate(new Date(selectedHoliday.endDate));
        }
    };

    const handleSubmit = () => {
        if (!holidayName || !holidayType || !holidayStartDate || !holidayEndDate) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill all the fields!',
            });
            return;
        }



        dispatch(fetchCreateHolidayManager({
            holidayName,
            holidayType,
            startDate: new Date(holidayStartDate.setHours(12)), // Convert Dayjs to JS Date and add 12 hours
            endDate: new Date(holidayEndDate.setHours(12)), // Convert Dayjs to JS Date and add 12 hours
            token
        }))
            .then(data => {
                if (data.payload.message) {
                    Swal.fire({
                        icon: 'error',
                        text: data.payload.message ?? 'Failed to add holiday',
                        showConfirmButton: true
                    })
                }else{
                    Swal.fire({
                        icon: 'success',
                        text: 'Holiday has been added',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
                dispatch(fetchHolidaysEmployee(token));
            });
    };

    return (
        <Box sx={{ flexGrow: 1, padding: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold'}}>
                        Add From Menu
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>Select Holiday</InputLabel>
                        <Select
                            value={selectedHolidayId || ''}
                            onChange={handleHolidaySelect}
                        >
                            {holidays.map(holiday => (
                                <MenuItem key={holiday.id} value={holiday.id}>
                                    {holiday.holidayName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Divider sx={{ my: 2, backgroundColor: 'rgba(0, 0, 0, 0.87)' }} />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Holiday Name"
                        value={holidayName}
                        onChange={(e) => setHolidayName(e.target.value)}
                        fullWidth
                        required
                        autoComplete="off"
                        inputProps={{ maxLength: 50 }}
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
                            label="Holiday End Date"
                            value={holidayEndDate ? dayjs(holidayEndDate) : null}
                            shouldDisableDate={holidayStartDate ? (date) => date.isBefore(holidayStartDate) : undefined}
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

export default SideBarHolidayFormUser;



