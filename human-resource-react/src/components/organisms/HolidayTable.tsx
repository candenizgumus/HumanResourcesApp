import * as React from 'react';
import {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {DataGrid, GridColDef, GridRowSelectionModel} from '@mui/x-data-grid';
import { HumanResources, RootState } from '../../store';
import { fetchHolidays } from '../../store/feature/holidaySlice';
import { IHoliday } from '../../models/IHoliday';
import {Button, Grid} from "@mui/material";

// Define the columns
const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'holidayName', headerName: 'Holiday', width: 130 },
    { field: 'holidayType', headerName: 'Type', width: 160 },
    {
        field: 'holidayStartDate',
        headerName: 'Start Date',
        width: 130,
    },
    {
        field: 'holidayEndDate',
        headerName: 'End Date',
        width: 130,
    },
];

export default function HolidayTable() {
    const holidays: IHoliday[] = useSelector((state: RootState) => state.holiday.holidayList);
    const dispatch = useDispatch<HumanResources>();
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);

    useEffect(() => {
        dispatch(fetchHolidays());
    }, [dispatch]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const handleConfirmSelection = () => {
        // Burada seçilen ID'lerle yapılacak işlemleri belirleyebilirsiniz
        console.log('Selected Row IDs:', selectedRowIds);
        // Örneğin, bu ID'lerle bir API çağrısı yapabilirsiniz.
    };

    return (
        <div style={{ height: 400, width: 'inherit' }}>
            <DataGrid
                rows={holidays}
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
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: 'rgba(224, 224, 224, 1)',
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                        textAlign: 'center',
                        fontWeight: 'bold',
                    },
                    '& .MuiDataGrid-cell': {
                        textAlign: 'center',
                    },
                }}

            />
            <Grid  container spacing={2} style={{ marginTop: 16 }}>
                <Grid  item xs={12}>
                    <Button
                        onClick={handleConfirmSelection}
                        variant="contained"
                        color="primary"
                    >
                        Confirm Selection
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
}