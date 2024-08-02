import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { HumanResources, RootState } from '../../store';
import { fetchHolidays } from '../../store/feature/holidaySlice';
import { IHoliday } from '../../models/IHoliday';

// Define the columns
const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'holidayName', headerName: 'Holiday', width: 130 },
    {
        field: 'holidayStartDate',
        headerName: 'Start Date',
        width: 130,
        valueGetter: (params: { row: IHoliday }) => {
            if (!params.row || params.row.holidayStartDate == null) {
                return '';
            }
            return new Date(params.row.holidayStartDate).toLocaleDateString();
        }
    },
    {
        field: 'holidayEndDate',
        headerName: 'End Date',
        width: 130,
        valueGetter: (params: { row: IHoliday }) => {
            if (!params.row || params.row.holidayEndDate == null) {
                return '';
            }
            return new Date(params.row.holidayEndDate).toLocaleDateString();
        }
    },
    { field: 'holidayType', headerName: 'Type', width: 160 },
];

const HolidayTable: React.FC = () => {
    const dispatch: HumanResources = useDispatch();
    const holidayList = useSelector((state: RootState) => state.holiday.holidayList);

    useEffect(() => {
        dispatch(fetchHolidays());
    }, [dispatch]);

    const rowsWithId = holidayList.map((holiday, index) => ({
        ...holiday,
        id: index // Use a unique identifier or field
    }));

    return (
        <div style={{ height: 400, width: 'inherit' }}>
            <DataGrid
                rows={rowsWithId}
                columns={columns}
                getRowId={(row) => row.id} // Ensure each row has a unique ID
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
            />
        </div>
    );
};

export default HolidayTable;