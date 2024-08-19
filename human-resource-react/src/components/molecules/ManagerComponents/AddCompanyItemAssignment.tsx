import React, { useState, useEffect } from 'react';
import { TextField, Grid, Button } from '@mui/material';
import { HumanResources, useAppSelector } from "../../../store";
import { useDispatch } from "react-redux";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import {
    fetchCompanyItems,
    fetchCreateCompanyItemAssignment
} from "../../../store/feature/companyItemSlice";
import { ICompanyItem } from "../../../models/ICompanyItem";
import { AddIcon } from '../../atoms/icons';

const columns: GridColDef[] = [
    { field: "id", headerName: "Id", flex: 1, headerAlign: "center" },
    { field: "name", headerName: "Name", flex: 1, headerAlign: "center" },
    { field: "companyItemType", headerName: "Item Type", flex: 1, headerAlign: "center" },
    { field: "serialNumber", headerName: "Serial Number", flex: 1, headerAlign: "center" },
    { field: "status", headerName: "Status", flex: 1, headerAlign: "center" },
];

const AddCompanyItemAssignment: React.FC = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const token = useAppSelector((state) => state.auth.token);
    const employeeId = useAppSelector((state) => state.auth.selectedEmployeeId);
    const dispatch = useDispatch<HumanResources>();
    const [searchText, setSearchText] = useState('');
    const [companyItems, setCompanyItems] = useState<ICompanyItem[]>([]);    //const personalDocuments =  useAppSelector((state) => state.personalDocument.personalDocuments);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        dispatch(fetchCompanyItems({
            token: token,
            page: 0,
            searchText: searchText,
            pageSize: 100,
        })).then(data => {
            setCompanyItems(data.payload);
        })

    }, [dispatch, token, searchText]);


    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const handleAssignCompanyItem = () => {
        if (selectedRowIds.length === 0) {
            Swal.fire({
                icon: 'error',
                text: 'Please select at least one item!',
                confirmButtonColor: '#1976D2',
            });
            return;
        }

        setLoading(true);
        for (let id of selectedRowIds) {
        dispatch(fetchCreateCompanyItemAssignment({
            employeeId,
            companyItemId: id,
            token,
        })).then((data) => {
            if (data.payload.message) {
                Swal.fire({
                    icon: 'error',
                    text: data.payload.message ?? 'Failed to assign item',
                    showConfirmButton: true,
                    confirmButtonColor: '#1976D2',
                });
            } else {
                Swal.fire({
                    icon: 'success',
                    text: 'Item has been assigned',
                    showConfirmButton: true,
                    confirmButtonColor: '#1976D2',
                });
            }
            });
        setLoading(false);
        }
    };

    return (
        <div style={{ height: "auto", width: "inherit" }}>
            <TextField
                label="Search By Serial Number"
                variant="outlined"
                onChange={(event) => setSearchText(event.target.value)}
                value={searchText}
                style={{ marginBottom: "1%", marginTop: "1%" }}
                fullWidth
                inputProps={{ maxLength: 50 }}
            />
            <DataGrid
                rows={companyItems}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
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
                    height: '407px'
                }}
            />
            <Grid sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: '2%', marginBottom: '2%' }}>
                <Button
                    onClick={handleAssignCompanyItem}
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    sx={{ marginRight: '1%', width: '200px' }}
                    disabled={loading || selectedRowIds.length === 0}
                >
                    Assign
                </Button>
            </Grid>
        </div>
    );
};

export default AddCompanyItemAssignment;