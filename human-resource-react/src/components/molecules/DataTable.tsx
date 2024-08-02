import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'email',
    headerName: 'Email',
    //type: 'number',
    width: 130,
  },
  {
    field: 'phone',
    headerName: 'Phone',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    //valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
  {
    field: 'companyName',
    headerName: 'Company Name',
    width: 130,
  },
  {
    field: 'title',
    headerName: 'Title',
    width: 130,
  },
  {
    field: 'numberOfEmployee',
    headerName: 'Employee Count',
    type: 'number',
    width: 120,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', email: 'uZJbG@example.com', phone: '123456789', companyName: 'Facebook', title: 'Software Engineer', numberOfEmployee: 35 },
  {id:2, lastName: 'Lannister', firstName: 'Cersei', email: 'uZJbG@example.com', phone: '123456789', companyName: 'Facebook', title: 'Software Engineer', numberOfEmployee: 42 },
  {id:3, lastName: 'Lannister', firstName: 'Jaime', email: 'uZJbG@example.com', phone: '123456789', companyName: 'Facebook', title: 'Software Engineer', numberOfEmployee: 45 },
  {id:4, lastName: 'Stark', firstName: 'Arya', email: 'uZJbG@example.com', phone: '123456789', companyName: 'Facebook', title: 'Software Engineer', numberOfEmployee: 16 },
  {id:5, lastName: 'Targaryen', firstName: 'Daenerys', email: 'uZJbG@example.com', phone: '123456789', companyName: 'Facebook', title: 'Software Engineer', numberOfEmployee: null },
  {id:6, lastName: 'Melisandre', firstName: null, email: 'uZJbG@example.com', phone: '123456789', companyName: 'Facebook', title: 'Software Engineer', numberOfEmployee: 150 },
  {id:7, lastName: 'Clifford', firstName: 'Ferrara', email: 'uZJbG@example.com', phone: '123456789', companyName: 'Facebook', title: 'Software Engineer', numberOfEmployee: 44 },
  {id:8, lastName: 'Frances', firstName: 'Rossini', email: 'uZJbG@example.com', phone: '123456789', companyName: 'Facebook', title: 'Software Engineer', numberOfEmployee: 36 },
  {id:9, lastName: 'Roxie', firstName: 'Harvey', email: 'uZJbG@example.com', phone: '123456789', companyName: 'Facebook', title: 'Software Engineer', numberOfEmployee: 65 }
];

export default function DataTable() {
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
