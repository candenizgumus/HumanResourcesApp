import * as React from 'react';
import {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {DataGrid, GridColDef, GridRowSelectionModel} from '@mui/x-data-grid';
import {HumanResources, RootState, useAppSelector} from '../../../store';
import {
    fetchChangeHolidayStatus,
    fetchDeleteHoliday, fetchHolidaysEmployee,

} from '../../../store/feature/holidaySlice';
import {IHoliday} from '../../../models/IHoliday';
import {Button, Grid, Box, Divider} from '@mui/material';
import {IHolidayFormatted} from "../../../models/IHolidayFormatted";
import SideBarHolidayFormUser from "./SideBarHolidayFormUser";
import Swal from "sweetalert2";

// Define the columns
const columns: GridColDef[] = [
    {field: 'holidayName', headerName: 'Holiday', flex :2.5, headerAlign: "center"},
    {field: 'holidayType', headerName: 'Type', flex :1, headerAlign: "center"},
    {
        field: 'holidayStartDate',
        headerName: 'Start Date',
        flex :1
        , headerAlign: "center"
    },
    {
        field: 'holidayEndDate',
        headerName: 'End Date',
        flex :1
        , headerAlign: "center"
    },
    {field: 'status', headerName: 'Status', flex :1, headerAlign: "center"},
];

export default function SideBarHolidayTableUser() {
    const holidays: IHoliday[] = useAppSelector((state: RootState) => state.holiday.holidayList);
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
            dispatch(fetchDeleteHoliday({token, id}))
                .then(data => {
                    if (data.payload.message) {
                        Swal.fire({
                            icon: 'error',
                            text: data.payload.message ?? 'Failed to delete holiday',
                            showConfirmButton: true,
                            confirmButtonColor: '#1976D2',
                        })
                    }else{
                        Swal.fire({
                            icon: 'success',
                            text: 'Holiday has been deleted',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                    dispatch(fetchHolidaysEmployee(token));
                })
        });
    };

    const handleConfirmChangeStatus = () => {
        selectedRowIds.forEach((id) => {
            dispatch(fetchChangeHolidayStatus({token, id}))
                .then(() => {
                    dispatch(fetchHolidaysEmployee(token));
                });
        });
    }


    return (
        <Box sx={{flexGrow: 1, padding: 2}}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <div style={{height: "auto", width: '100%'}}>
                        <DataGrid
                            rows={newHolidayList}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: {page: 1, pageSize: 5},
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
                            }}
                        />
                        <Grid container spacing={2} style={{marginTop: 16}}>
                            <Grid item xs={12}>
                                <Button
                                    style={{marginRight: 4}}
                                    onClick={handleConfirmDeletion}
                                    variant="contained"
                                    color="error"
                                >
                                    Delete Selected
                                </Button>
                                <Button
                                    style={{marginRight: 4}}
                                    onClick={handleConfirmChangeStatus}
                                    variant="contained"
                                    color="warning"
                                >
                                    Change Status
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <Divider sx={{my: 4}}/>
                </Grid>
                <Grid item xs={12}>
                    <SideBarHolidayFormUser/>
                </Grid>
            </Grid>
        </Box>
    );
}
