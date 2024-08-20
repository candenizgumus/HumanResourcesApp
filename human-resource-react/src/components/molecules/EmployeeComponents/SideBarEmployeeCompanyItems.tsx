import React, { useState, useEffect } from 'react';
import { TextField, Grid, Button } from '@mui/material';
import { HumanResources, useAppSelector } from "../../../store";
import { useDispatch } from "react-redux";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import {
    fetchApproveItemAssignmentByEmployee,
    fetchGetAssignedItemsOfEmployeeDetailed
} from "../../../store/feature/companyItemSlice";

import { CancelIcon, ApproveIcon } from '../../atoms/icons';
import { IEmployeeItemAssignments } from "../../../models/IEmployeeItemAssignments";
import RejectItemAssignmentDialog from "./RejectItemAssignmentDialog";

const employeeAssignmentColumns: GridColDef[] = [
    { field: "companyItemName", headerName: "Description", flex: 1, headerAlign: "center" },
    { field: "serialNumber", headerName: "Serial Number", flex: 1, headerAlign: "center" },
    { field: "assignDate", headerName: "Assign Date", flex: 1, headerAlign: "center" },
    { field: "status", headerName: "Status", flex: 1, headerAlign: "center" },
];

const SideBarEmployeeCompanyItems: React.FC = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [selectedCompanyItemId, setSelectedCompanyItemId] = useState<number | null>(null); // Add state for selected item ID
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useDispatch<HumanResources>();
    const [searchText, setSearchText] = useState('');
    const [employeeItemAssignments, setEmployeeItemAssignments] = useState<IEmployeeItemAssignments[]>([]);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

    const handleDialogOpen = () => {
        if (selectedRowIds.length === 0) {
            Swal.fire({
                icon: 'error',
                text: 'Please select an item to reject',
                confirmButtonColor: '#1976D2',
            });
            return;
        }
        setSelectedCompanyItemId(selectedRowIds[0]); // Set the selected item ID
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        dispatch(fetchGetAssignedItemsOfEmployeeDetailed(token)).then(data => {
            setEmployeeItemAssignments(data.payload);
        })
        setDialogOpen(false);
    };

    useEffect(() => {
        dispatch(fetchGetAssignedItemsOfEmployeeDetailed(token)).then(data => {
            setEmployeeItemAssignments(data.payload);
        })
    }, [dispatch, token]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const handleApproval = () => {
        if (selectedRowIds.length === 0) {
            Swal.fire({
                icon: 'error',
                text: 'Please select an item to approve',
                confirmButtonColor: '#1976D2',
            });
            return;
        }
        setLoading(true);
        dispatch(fetchApproveItemAssignmentByEmployee({ token: token, id: selectedRowIds[0] }))
            .then((data) => {
                if (data.payload.message) {
                    Swal.fire({
                        icon: 'error',
                        text: data.payload.message ?? 'Failed to approve item',
                        showConfirmButton: true,
                        confirmButtonColor: '#1976D2',
                    });
                } else {
                    Swal.fire({
                        icon: 'success',
                        text: 'Item has been approved',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
            .finally(() => {
                dispatch(fetchGetAssignedItemsOfEmployeeDetailed(token)).then(data => {
                    setEmployeeItemAssignments(data.payload);
                })
                setLoading(false);
                setSelectedRowIds([]);
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
                rows={employeeItemAssignments}
                columns={employeeAssignmentColumns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                onRowSelectionModelChange={handleRowSelection}
                getRowClassName={(params) =>
                    params.row.status === "APPROVED"
                        ? "approved-row"
                        : params.row.status === "REJECTED"
                            ? "rejected-row"
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
                    "& .approved-row": {
                        backgroundColor: "#e0f2e9", // Approved items green background
                    },
                    "& .rejected-row": {
                        backgroundColor: "#ffe0e0", // Rejected items red background
                    },
                    height: '407px'
                }}
                rowSelectionModel={selectedRowIds}
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
                    onClick={handleApproval}
                    variant="contained"
                    color="primary"
                    startIcon={<ApproveIcon />}
                    sx={{ marginRight: '1%', width: '200px' }}
                >
                    Approve
                </Button>
                <Button
                    onClick={handleDialogOpen}
                    variant="contained"
                    color="error"
                    disabled={loading || selectedRowIds.length === 0}
                    startIcon={<CancelIcon />}
                    sx={{ marginRight: '1%', width: '200px' }}
                >
                    Reject
                </Button>
            </Grid>
            <RejectItemAssignmentDialog
                open={dialogOpen}
                onClose={handleDialogClose}
                selectedCompanyItemId={selectedCompanyItemId} // Pass the selected item ID as a prop
            />
        </div>
    );
};

export default SideBarEmployeeCompanyItems;