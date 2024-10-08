import React, { useState, useEffect } from 'react';
import { TextField, Grid, Button, Typography, Paper } from '@mui/material';
import { HumanResources, useAppSelector } from "../../../store";
import { useDispatch } from "react-redux";
import { DataGrid, GridColDef, GridRowSelectionModel, GridToolbar } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import {
    fetchCancelItemAssignmentByManager,
    fetchCompanyItemAssignments,
    fetchCompanyItems,
    fetchDeleteCompanyItem
} from "../../../store/feature/companyItemSlice";
import { ICompanyItem } from "../../../models/ICompanyItem";
import { DeleteIcon, AddIcon, CancelIcon } from '../../atoms/icons';
import AddCompanyItemDialog from './AddCompanyItem';
import { ICompanyItemAssignment } from "../../../models/ICompanyItemAssignment";
import { myLightColour } from '../../../util/MyColours';
import { Line } from "recharts";
import Divider from "@mui/material/Divider";

const itemColumns: GridColDef[] = [
    { field: "name", headerName: "Description", flex: 1, headerAlign: "center" },
    { field: "companyItemType", headerName: "Item Type", flex: 1, headerAlign: "center" },
    { field: "serialNumber", headerName: "Serial Number", flex: 1, headerAlign: "center" },
    { field: "status", headerName: "Status", flex: 1, headerAlign: "center" },
];

const assignmentColumns: GridColDef[] = [
    { field: "companyItemName", headerName: "Description", flex: 1, headerAlign: "center" },
    { field: "serialNumber", headerName: "Serial Number", flex: 0.7, headerAlign: "center" },
    { field: "employeeEmail", headerName: "Employee Email", flex: 1, headerAlign: "center" },
    { field: "assignDate", headerName: "Assign Date", flex: 0.6, headerAlign: "center" },
    { field: "status", headerName: "Status", flex: 0.6, headerAlign: "center" },
    { field: "message", headerName: "Reject Message", flex: 1.5, headerAlign: "center" },
];

const SideBarCompanyItems: React.FC = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [selectedRowIdsAssignment, setSelectedRowIdsAssignment] = useState<number[]>([]);
    const [hasCanceledRow, setHasCanceledRow] = useState(false);
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useDispatch<HumanResources>();
    const [searchText, setSearchText] = useState('');
    const [companyItems, setCompanyItems] = useState<ICompanyItem[]>([]);
    const [companyItemAssignments, setCompanyItemAssignments] = useState<ICompanyItemAssignment[]>([]);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);


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

    const handleRowSelectionAssignments = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIdsAssignment(newSelectionModel as number[]);
        const hasCanceled = newSelectionModel.some((id) => {
            const row = companyItemAssignments.find(item => item.id === id);
            return row?.status === "CANCELED";
        });
        setHasCanceledRow(hasCanceled);
    };

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
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
                    }).then(() => {
                        dispatch(fetchCompanyItemAssignments(
                            token)).then(data => {
                                setCompanyItemAssignments(data.payload)
                            })
                    })
                });
        });
    };

    const handleCancellation = () => {
        selectedRowIdsAssignment.forEach((id) => {
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

                        dispatch(fetchCompanyItems({
                            token: token,
                            page: 0,
                            searchText: searchText,
                            pageSize: 100,
                        })).then(data => {
                            setCompanyItems(data.payload);
                        })
                    }
                })
                .finally(() => {
                    dispatch(fetchCompanyItemAssignments(token)).then(data => {
                        if (data.payload) {
                            setCompanyItemAssignments(data.payload);
                        }
                    });
                    setLoading(false);
                    setSelectedRowIdsAssignment([]);
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
                slots={{
                    toolbar: GridToolbar,
                }}
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
            <Grid container spacing={2} sx={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'stretch', marginTop: '2%', marginBottom: '2%' }}>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleOnClickAddCompanyItem}
                        variant="contained"
                        color="success"
                        startIcon={<AddIcon />}
                        sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        Add
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleDelete}
                        variant="contained"
                        color="error"
                        disabled={loading || selectedRowIds.length === 0}
                        startIcon={<DeleteIcon />}
                        sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        Delete
                    </Button>
                </Grid>
            </Grid>
            <AddCompanyItemDialog open={dialogOpen} onClose={handleDialogClose} />
            <Divider sx={{ my: 2, backgroundColor: 'rgba(0, 0, 0, 0.87)' }} />
            <Grid item xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                    Assigned Items
                </Typography>
            </Grid>
            <DataGrid
                slots={{
                    toolbar: GridToolbar,
                }}
                rows={companyItemAssignments}
                columns={assignmentColumns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                onRowSelectionModelChange={handleRowSelectionAssignments}
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
                rowSelectionModel={selectedRowIdsAssignment}
            />
            <Grid container spacing={2} sx={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'stretch', marginTop: '2%', marginBottom: '2%' }}>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleCancellation}
                        variant="contained"
                        color="warning"
                        disabled={loading || selectedRowIdsAssignment.length === 0 || hasCanceledRow}
                        startIcon={<CancelIcon />}
                        sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        Cancel Item Assignment
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default SideBarCompanyItems;