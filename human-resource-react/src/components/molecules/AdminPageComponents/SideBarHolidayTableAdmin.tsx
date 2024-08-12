import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { HumanResources, RootState, useAppSelector } from '../../../store';
import {fetchDeleteHoliday, fetchHolidaysAdmin} from '../../../store/feature/holidaySlice';
import { IHoliday } from '../../../models/IHoliday';
import { Button, Grid, Box, Divider } from '@mui/material';
import SideBarHolidayFormAdmin from "./SideBarHolidayFormAdmin";
import { IHolidayFormatted } from "../../../models/IHolidayFormatted";

// Helper function to format epoch timestamp to human-readable date
function epochToHumanReadableWithoutTime(epochTime: number): string {
    const date = new Date(epochTime * 1000);

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        //timeZoneName: 'short'
    };

    return date.toLocaleDateString('tr-TR', options);
}

// Define the columns
const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 , headerAlign: "center"},
    { field: 'holidayName', headerName: 'Holiday', width: 250 , headerAlign: "center"},
    { field: 'holidayType', headerName: 'Type', width: 160 , headerAlign: "center"},
    {
        field: 'holidayStartDate',
        headerName: 'Start Date',
        width: 200
    , headerAlign: "center"
    },
    {
        field: 'holidayEndDate',
        headerName: 'End Date',
        width: 200
        , headerAlign: "center"
    },
];

export default function SideBarHolidayTableAdmin() {
    const holidays: IHoliday[] = useAppSelector((state: RootState) => state.holiday.holidayList);
    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [newHolidayList, setNewHolidayList] = useState<IHolidayFormatted[]>([]);

    useEffect(() => {
        dispatch(fetchHolidaysAdmin(token));
    }, [dispatch]);

    useEffect(() => {
        const formattedHolidays = holidays.map(holiday => ({
            id: holiday.id,
            holidayName: holiday.holidayName,
            holidayType: holiday.holidayType,
            holidayStartDate: epochToHumanReadableWithoutTime(holiday.holidayStartDate),
            holidayEndDate: epochToHumanReadableWithoutTime(holiday.holidayEndDate),
        }));
        setNewHolidayList(formattedHolidays);
    }, [holidays]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const handleConfirmDeletion = () => {
        selectedRowIds.forEach((id) => {
            dispatch(fetchDeleteHoliday({token, id}))
                .then(() => {
                    dispatch(fetchHolidaysAdmin(token));
                });
        });
    };

    return (
        <Box sx={{ flexGrow: 1, padding: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
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
                            }}
                        />
                        <Grid container spacing={2} style={{ marginTop: 16 }}>
                            <Grid item xs={12}>
                                <Button
                                    onClick={handleConfirmDeletion}
                                    variant="contained"
                                    color="error"
                                >
                                    Delete Selected
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <Divider sx={{ my: 4 }} />
                </Grid>
                <Grid item xs={12}>
                    <SideBarHolidayFormAdmin />
                </Grid>
            </Grid>
        </Box>
    );
}
