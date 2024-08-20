import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DataGrid, GridColDef, GridRowSelectionModel, GridToolbar } from '@mui/x-data-grid';
import { HumanResources, RootState, useAppSelector } from '../../../store';
import { fetchDeleteHoliday, fetchHolidaysAdmin, fetchCreateHolidayAdmin } from '../../../store/feature/holidaySlice';
import { IHoliday } from '../../../models/IHoliday';
import { IHolidayFormatted } from "../../../models/IHolidayFormatted";
import Swal from 'sweetalert2';
import 'react-datepicker/dist/react-datepicker.css';
import { Box, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {AddIcon, DeleteIcon} from '../../atoms/icons';
import { myErrorColour, myLightColour } from '../../../util/MyColours';
// Define the columns
const columns: GridColDef[] = [
    { field: 'holidayName', headerName: 'Holiday', flex: 2, headerAlign: "center" },
    { field: 'holidayType', headerName: 'Type', flex: 1, headerAlign: "center" },
    {
        field: 'holidayStartDate',
        headerName: 'Start Date',
        flex: 1,
        headerAlign: "center",
    },
    {
        field: 'holidayEndDate',
        headerName: 'End Date',
        flex: 1,
        headerAlign: "center",
    },
];

export default function SideBarHolidayTableAdmin() {
    const holidays: IHoliday[] = useAppSelector((state: RootState) => state.holiday.holidayListAdmin);
    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [newHolidayList, setNewHolidayList] = useState<IHolidayFormatted[]>([]);

    const formatDate = (date: Date | string | undefined): string => {
        if (!date) return '';

        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const d = new Date(date);
        const day = d.getDate();
        const month = months[d.getMonth()]; // Get month name

        return `${day} ${month}`;
    };

    const [holidayName, setHolidayName] = useState<string>('');
    const [holidayType, setHolidayType] = useState<string>('');
    const [holidayStartDate, setHolidayStartDate] = useState<Date | null>(null);
    const [holidayEndDate, setHolidayEndDate] = useState<Date | null>(null);

    const handleSubmit = () => {
        // Validate form data before submitting
        if (!holidayName || !holidayType || !holidayStartDate || !holidayEndDate) {
            Swal.fire({
                icon: 'error',
                text: 'Please fill all the fields!',
                confirmButtonColor: myLightColour,
                cancelButtonColor: myErrorColour,
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
                    confirmButtonColor: myLightColour,
                    cancelButtonColor: myErrorColour,
                });
                dispatch(fetchHolidaysAdmin(token));
            })
            .catch(() => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error. Please try again later.',
                    confirmButtonColor: myLightColour,
                    cancelButtonColor: myErrorColour,
                });
            });
    };

    useEffect(() => {
        dispatch(fetchHolidaysAdmin(token));
    }, [dispatch]);

    useEffect(() => {
        const formattedHolidays = holidays.map(holiday => ({
            id: holiday.id,
            holidayName: holiday.holidayName,
            holidayType: holiday.holidayType,
            holidayStartDate: formatDate(holiday.startDate),
            holidayEndDate: formatDate(holiday.endDate),
        }));
        setNewHolidayList(formattedHolidays);
    }, [holidays]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const handleConfirmDeletion = () => {
        selectedRowIds.forEach((id) => {
            dispatch(fetchDeleteHoliday({ token, id }))
                .then(() => {
                    dispatch(fetchHolidaysAdmin(token));
                });
        });
    };

    return (
        <div style={{ height: 'auto', width: "inherit" }}>
            <DataGrid
                rows={newHolidayList}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 1, pageSize: 5 },
                    },
                }}
                slots={{
                    toolbar: GridToolbar,
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                onRowSelectionModelChange={handleRowSelection}
                sx={{
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "rgba(224, 224, 224, 1)",
                    },
                    "& .MuiDataGrid-columnHeaderTitle": {
                        textAlign: "center",
                        fontWeight: "bold",
                    },
                    "& .MuiDataGrid-cell": {
                        textAlign: "center",
                    },
                    marginTop: '2%',
                    height:'407px'
                }}
            />
            <Grid sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: '2%', marginBottom: '2%' }}>
                <Button
                    onClick={handleConfirmDeletion}
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    disabled={selectedRowIds.length === 0}
                    sx={{ marginRight: '1%', width: '200px' }}
                >
                    Delete
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    disabled={holidayStartDate === null || holidayEndDate === null || holidayName === '' || holidayType === ''}
                    onClick={handleSubmit}
                    startIcon={<AddIcon />}
                    sx={{ marginRight: '1%', width: '200px' }}
                >
                    Create
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            label="Holiday Name"
                            value={holidayName}
                            onChange={(e) => setHolidayName(e.target.value)}
                            fullWidth
                            required
                            autoComplete="off"
                        />
                    </Grid>
                    <Grid item xs={6}>
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
                    <Grid item xs={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Holiday Start Date"
                                value={holidayStartDate ? dayjs(holidayStartDate) : null}
                                sx={{ width: '100%' }}
                                onChange={(newValue) => setHolidayStartDate(newValue ? newValue.toDate() : null)}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                shouldDisableDate={holidayStartDate ? (date) => date.isBefore(holidayStartDate) : undefined}
                                label="Holiday End Date"
                                sx={{ width: '100%' }}
                                value={holidayEndDate ? dayjs(holidayEndDate) : null}
                                onChange={(newValue) => setHolidayEndDate(newValue ? newValue.toDate() : null)}
                            />
                        </LocalizationProvider>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}
