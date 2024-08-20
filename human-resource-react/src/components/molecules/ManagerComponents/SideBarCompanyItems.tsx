import React, { useState, useEffect } from 'react';
import { TextField, Grid, Button } from '@mui/material';
import { HumanResources, useAppSelector } from "../../../store";
import { useDispatch } from "react-redux";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import {
    fetchCancelItemAssignmentByManager,
    fetchCompanyItemAssignments,
    fetchCompanyItems,
    fetchDeleteCompanyItem
} from "../../../store/feature/companyItemSlice";
import { ICompanyItem } from "../../../models/ICompanyItem";
import { changePageState } from "../../../store/feature/authSlice";
import { DeleteIcon, AddIcon } from '../../atoms/icons';
import AddCompanyItemDialog from './AddCompanyItem';
import {ICompanyItemAssignment} from "../../../models/ICompanyItemAssignment";
import { myLightColour } from '../../../util/MyColours';

const itemColumns: GridColDef[] = [
    { field: "name", headerName: "Description", flex: 1, headerAlign: "center" },
    { field: "companyItemType", headerName: "Item Type", flex: 1, headerAlign: "center" },
    { field: "serialNumber", headerName: "Serial Number", flex: 1, headerAlign: "center" },
    { field: "status", headerName: "Status", flex: 1, headerAlign: "center" },
];

const assignmentColumns: GridColDef[] = [
    { field: "companyItemName", headerName: "Description", flex: 1, headerAlign: "center" },
    { field: "serialNumber", headerName: "Serial Number", flex: 1, headerAlign: "center" },
    { field: "employeeEmail", headerName: "Employee Email", flex: 1, headerAlign: "center" },
    { field: "assignDate", headerName: "Assign Date", flex: 1, headerAlign: "center" },
    { field: "status", headerName: "Status", flex: 1, headerAlign: "center" },
    { field: "message", headerName: "Employee Message", flex: 1, headerAlign: "center" },
];

const SideBarCompanyItems: React.FC = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [hasCanceledRow, setHasCanceledRow] = useState(false);
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useDispatch<HumanResources>();
    const [searchText, setSearchText] = useState('');
    const [companyItems, setCompanyItems] = useState<ICompanyItem[]>([]);
    const [companyItemAssignments, setCompanyItemAssignments] = useState<ICompanyItemAssignment[]>([]);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    useEffect(() => {
        dispatch(fetchCompanyItemAssignments(token)).then(data => {
            if (data.payload) {
                setCompanyItemAssignments(data.payload);
            }
        });
    }, [dispatch, token]);

    const handleDialogClose = () => {
        dispatch(fetchCompanyItems({
            token: token,
            page: 0,
            searchText: searchText,
            pageSize: 100,
        })).then(data => {
            setCompanyItems(data.payload);
        })
        setDialogOpen(false);
    };

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
        const hasCanceled = newSelectionModel.some((id) => {
            const row = companyItemAssignments.find(item => item.id === id);
            return row?.status === "CANCELED";
        });
        setHasCanceledRow(hasCanceled);
    };

    const handleOnClickAddCompanyItem = () => {
        handleDialogOpen();
    }

    const handleDelete = () => {
        selectedRowIds.forEach((id) => {
            setLoading(true);
            dispatch(fetchDeleteCompanyItem({ token, id }))
                .then(data => {
                    if (data.payload.message) {
                        Swal.fire({
                            icon: 'error',
                            text: data.payload.message ?? 'Failed to delete the item',
                            showConfirmButton: true,
                            confirmButtonColor: myLightColour,
                        })
                    } else {
                        Swal.fire({
                            icon: 'success',
                            text: 'Item has been deleted',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                    setLoading(false);
                    dispatch(fetchCompanyItems({
                        token: token,
                        page: 0,
                        searchText: searchText,
                        pageSize: 100,
                    })).then(data => {
                        setCompanyItems(data.payload);
                    })
                });
        });
    };

    const handleCancellation = () => {
        selectedRowIds.forEach((id) => {
            setLoading(true);
            dispatch(fetchCancelItemAssignmentByManager({ token, id }))
                .then(data => {
                    if (data.payload.message) {
                        Swal.fire({
                            icon: 'error',
                            text: data.payload.message ?? 'Failed to cancel the assignment',
                            showConfirmButton: true
                        })
                    } else {
                        Swal.fire({
                            icon: 'success',
                            text: 'Assignment has been canceled',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                    setLoading(false);
                    dispatch(fetchCompanyItemAssignments(token)).then(data => {
                        if (data.payload) {
                            setCompanyItemAssignments(data.payload);
                        }
                    });
                });
        });
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
                columns={itemColumns}
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
            <Grid sx={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginTop: '2%',
                marginBottom: '2%'
            }}>
                <Button
                    onClick={handleOnClickAddCompanyItem}
                    variant="contained"
                    color="success"
                    startIcon={<AddIcon />}
                    sx={{ marginRight: '1%', width: '200px' }}
                >
                    Add
                </Button>
                <Button
                    onClick={handleDelete}
                    variant="contained"
                    color="error"
                    disabled={loading || selectedRowIds.length === 0}
                    startIcon={<DeleteIcon />}
                    sx={{ marginRight: '1%', width: '200px' }}
                >
                    Delete
                </Button>
            </Grid>
            <AddCompanyItemDialog open={dialogOpen} onClose={handleDialogClose} />

            <DataGrid
                rows={companyItemAssignments}
                columns={assignmentColumns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                onRowSelectionModelChange={handleRowSelection}
                getRowClassName={(params) =>
                    params.row.status === "CANCELED"
                        ? "canceled-row"
                        : ""
                }
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
            <Grid sx={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginTop: '2%',
                marginBottom: '2%'
            }}>
                <Button
                    onClick={handleCancellation}
                    variant="contained"
                    color="error"
                    disabled={loading || selectedRowIds.length === 0 || hasCanceledRow}
                    startIcon={<DeleteIcon />}
                    sx={{ marginRight: '1%', width: '200px' }}
                >
                    Cancel Item Assignment
                </Button>
            </Grid>
        </div>
    );
};

export default SideBarCompanyItems;