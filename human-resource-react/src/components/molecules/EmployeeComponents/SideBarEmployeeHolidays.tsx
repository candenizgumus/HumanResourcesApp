import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {DataGrid, GridColDef, GridRowSelectionModel, GridToolbar} from '@mui/x-data-grid';
import { HumanResources, RootState, useAppSelector } from '../../../store';
import { fetchHolidaysEmployee } from '../../../store/feature/holidaySlice';
import { IHoliday } from '../../../models/IHoliday';
import { Grid, Box } from '@mui/material';
import { IHolidayFormatted } from "../../../models/IHolidayFormatted";

// Helper function to format epoch timestamp to human-readable date


// Define the columns
const columns: GridColDef[] = [
    { field: 'holidayName', headerName: 'Holiday', flex: 3, headerAlign: "center" },
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
];

export default function SideBarEmployeeHolidays() {
    const holidays: IHoliday[] = useAppSelector((state: RootState) => state.holiday.holidayListEmployee);
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
        }));
        setNewHolidayList(formattedHolidays);
    }, [holidays]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
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
                    marginTop:'2%',
                    height:'407px'
                }}
            />
        </div>
    );
}
