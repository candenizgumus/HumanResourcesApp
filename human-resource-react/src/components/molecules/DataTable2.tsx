import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
];

const rows = [
  { id: 1, lastName: 'asdfgawegawergaerga', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'eargaergaerg', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'asdf', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'fdgadf', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targadfggaryen', firstName: 'adfg', age: null },
  { id: 6, lastName: 'Meladfgisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifadfgford', firstName: 'adfg', age: 44 },
  { id: 8, lastName: 'Fraadfgnces', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxadfgie', firstName: 'Harvey', age: 65 },
];

export default function DataTable2() {
  return (
    <div style={{ height: 400, width: 'inherit'  }}>
      <DataGrid
        rows={rows}
        columns={columns}
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
}
