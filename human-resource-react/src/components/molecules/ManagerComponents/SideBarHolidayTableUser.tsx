import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DataGrid, GridColDef, GridRowSelectionModel, GridToolbar } from '@mui/x-data-grid';
import { HumanResources, RootState, useAppSelector } from '../../../store';
import {
    fetchChangeHolidayStatus,
    fetchDeleteHoliday, fetchHolidaysEmployee, fetchCreateHolidayManager, fetchHolidaysAdmin,

} from '../../../store/feature/holidaySlice';
import { IHoliday } from '../../../models/IHoliday';
import { IHolidayFormatted } from "../../../models/IHolidayFormatted";
import Swal from "sweetalert2";
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
import { DeleteIcon, EditIcon, AddIcon } from '../../atoms/icons';
import 'react-datepicker/dist/react-datepicker.css';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { myErrorColour, myLightColour } from '../../../util/MyColours';
// Define the columns
const columns: GridColDef[] = [
    { field: 'holidayName', headerName: 'Holiday', flex: 2.5, headerAlign: "center" },
    { field: 'holidayType', headerName: 'Type', flex: 1, headerAlign: "center" },
    {
        field: 'holidayStartDate',
        headerName: 'Start Date',
        flex: 1
        , headerAlign: "center"
    },
    {
        field: 'holidayEndDate',
        headerName: 'End Date',
        flex: 1
        , headerAlign: "center"
    },
    { field: 'status', headerName: 'Status', flex: 1, headerAlign: "center" },
];

export default function SideBarHolidayTableUser() {
    const holidays: IHoliday[] = useAppSelector((state: RootState) => state.holiday.holidayListEmployee);
    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [newHolidayList, setNewHolidayList] = useState<IHolidayFormatted[]>([]);
    const [holidayName, setHolidayName] = useState<string>('');
    const [holidayType, setHolidayType] = useState<string>('');
    const [holidayStartDate, setHolidayStartDate] = useState<Date | null>(null);
    const [holidayEndDate, setHolidayEndDate] = useState<Date | null>(null);
    const [predefinedholidays, setPredefinedHolidays] = useState<any[]>([]);
    const [selectedHolidayId, setSelectedHolidayId] = useState<number>(0);
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

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
    useEffect(() => {
        dispatch(fetchHolidaysEmployee(token));
    }, [dispatch]);

    useEffect(() => {
        const formattedHolidays = holidays.map(holiday => ({
            id: holiday.id,
            holidayName: holiday.holidayName,
            holidayType: holiday.holidayType,
            holidayStartDate: formatDate(holiday.startDate),
            holidayEndDate: formatDate(holiday.endDate),
            status: holiday.status
        }));
        setNewHolidayList(formattedHolidays);
    }, [holidays]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const handleConfirmDeletion = () => {
        selectedRowIds.forEach((id) => {
            dispatch(fetchDeleteHoliday({ token, id }))
                .then(data => {
                    if (data.payload.message) {
                        Swal.fire({
                            icon: 'error',
                            text: data.payload.message ?? 'Failed to delete holiday',
                            showConfirmButton: true,
                            confirmButtonColor: myLightColour,
                            cancelButtonColor: myErrorColour,
                        })
                    } else {
                        Swal.fire({
                            icon: 'success',
                            text: 'Holiday has been deleted',
                            confirmButtonColor: myLightColour,
                            cancelButtonColor: myErrorColour,
                        })
                    }
                    dispatch(fetchHolidaysEmployee(token));
                })
        });
        setSelectedRowIds([]);

    };

    const handleConfirmChangeStatus = () => {
        selectedRowIds.forEach((id) => {
            dispatch(fetchChangeHolidayStatus({ token, id }))
                .then(() => {
                    dispatch(fetchHolidaysEmployee(token));
                }).then(() => {
                    Swal.fire({
                        icon: 'success',
                        text: 'Status has been changed',
                        confirmButtonColor: myLightColour,
                        cancelButtonColor: myErrorColour,
                    })
                })
        });
        setSelectedRowIds([]);
    }

    useEffect(() => {
        dispatch(fetchHolidaysAdmin(token)).then((action: any) => {
            setPredefinedHolidays(action.payload);
        });
    }, [dispatch, token]);

    const handleHolidaySelect = (event: SelectChangeEvent<number>) => {
        const selectedId = event.target.value as number;
        setSelectedHolidayId(selectedId);
        const selectedHoliday = predefinedholidays.find(holiday => holiday.id === selectedId);
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
                text: 'Please fill all the fields!',
                confirmButtonColor: myLightColour,
                cancelButtonColor: myErrorColour,
            });
            return;
        }



        dispatch(fetchCreateHolidayManager({
            holidayName,
            holidayType,
            startDate: holidayStartDate,
            endDate: holidayEndDate,
            token,
            holidayId: selectedHolidayId
        }))
            .then(data => {
                if (data.payload.message) {
                    Swal.fire({
                        icon: 'error',
                        text: data.payload.message ?? 'Failed to add holiday',
                        showConfirmButton: true,
                        confirmButtonColor: myLightColour,
                        cancelButtonColor: myErrorColour,
                    })
                } else {
                    Swal.fire({
                        icon: 'success',
                        text: 'Holiday has been added',
                        confirmButtonColor: myLightColour,
                        cancelButtonColor: myErrorColour,
                    })
                }
                dispatch(fetchHolidaysEmployee(token));
            });
    };

    return (
        <div style={{ height: "auto", width: "inherit" }}>
            <DataGrid
                slots={{
                    toolbar: GridToolbar,
                }}
                rows={newHolidayList}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 1, pageSize: 5 },
                    },
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
                    height: '407px'
                }}
                rowSelectionModel={selectedRowIds}
            />
            <Grid container spacing={2} sx={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'stretch', marginTop: '2%', marginBottom: '2%' }}>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleConfirmDeletion}
                        variant="contained"
                        color="error"
                        sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        startIcon={<DeleteIcon />}
                        disabled={selectedRowIds.length === 0}
                    >
                        Delete
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleConfirmChangeStatus}
                        variant="contained"
                        color="warning"
                        sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        startIcon={<EditIcon />}
                        disabled={selectedRowIds.length === 0}
                    >
                        Change Status
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        variant="contained"
                        color="success"
                        disabled={holidayStartDate === null || holidayEndDate === null || holidayName === '' || holidayType === ''}
                        onClick={handleSubmit}
                        sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        startIcon={<AddIcon />}
                    >
                        Create/Add
                    </Button>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Add From Menu
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <FormControl fullWidth>
                            <InputLabel>Select Holiday</InputLabel>
                            <Select
                                value={selectedHolidayId}
                                onChange={handleHolidaySelect}
                            >
                                {predefinedholidays.map(holiday => (
                                    <MenuItem key={holiday.id} value={holiday.id}>
                                        {holiday.holidayName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    {/*
                    <Grid item xs={12}>
                        <Divider sx={{ my: 2, backgroundColor: 'rgba(0, 0, 0, 0.87)' }} />
                    </Grid>
                    */}
                    <Grid item xs={12}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Create Custom
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
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
                    <Grid item xs={12} sm={6} md={6} lg={6}>
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
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Holiday Start Date"
                                value={holidayStartDate ? dayjs(holidayStartDate) : null}
                                sx={{ width: '100%' }}
                                onChange={(newValue) => setHolidayStartDate(newValue ? newValue.toDate() : null)}

                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Holiday End Date"
                                value={holidayEndDate ? dayjs(holidayEndDate) : null}
                                shouldDisableDate={holidayStartDate ? (date) => date.isBefore(holidayStartDate) : undefined}
                                onChange={(newValue) => setHolidayEndDate(newValue ? newValue.toDate() : null)}
                                sx={{ width: '100%' }}
                            />
                        </LocalizationProvider>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}
