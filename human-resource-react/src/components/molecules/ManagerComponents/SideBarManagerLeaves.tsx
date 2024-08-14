import React, {useEffect, useState} from "react";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel,
} from "@mui/x-data-grid";
import {
    Button,
    Grid,
    TextField
} from "@mui/material";
import {HumanResources, useAppSelector} from "../../../store";
import {useDispatch} from "react-redux";
import Swal from "sweetalert2";
import {
    fetchGetLeavesOfManager, fetchApproveLeave,
    fetchDeleteLeave, fetchCancelLeave
} from "../../../store/feature/leaveSlice";
import { clearToken, fetchFindUserByToken } from "../../../store/feature/authSlice";

const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70, headerAlign: "center" },
    { field: "description", headerName: "Description", width: 200, headerAlign: "center" },

    { field: "startDate", headerName: "Start Date", width: 150, headerAlign: "center" },
    { field: "endDate", headerName: "End Date", width: 150, headerAlign: "center" },
    { field: "leaveType", headerName: "Leave Type", width: 150, headerAlign: "center" },
    { field: "isLeaveApproved", headerName: "Approval Status", headerAlign: "center", width: 250 },
    { field: "approveDate", headerName: "Approval Date", width: 150, headerAlign: "center" },
    { field: "status", headerName: "Status", width: 120, headerAlign: "center" },
];

const SideBarManagerLeaves = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');

    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const leaves = useAppSelector((state) => state.leave.leaveList);
    const [loading, setLoading] = useState(false);
    const [isActivating, setIsActivating] = useState(false);

    useEffect(() => {
        dispatch(
            fetchGetLeavesOfManager({
                token: token,
                page: 0,
                pageSize: 100,
                searchText: searchText,
            })
        )
            .catch(() => {
                dispatch(clearToken());
            });
    }, [dispatch, searchText, token, loading, isActivating]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const handleApprove = async () => {
        for (let id of selectedRowIds) {
            const selectedLeave = leaves.find((leave) => leave.id === id);
            if (!selectedLeave) continue;

            if (selectedLeave.isLeaveApproved){
                Swal.fire({
                    title: "Error",
                    text: 'Leave already approved',
                    icon: "error",
                    confirmButtonText: "OK",
                });
                return
            }
            setLoading(true);

            try {
                const result = await Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, approve it!"
                });

                if (result.isConfirmed) {
                    const data = await dispatch(fetchApproveLeave({
                        token: token,
                        id: selectedLeave.id,
                    }));

                    if (data.payload.message) {
                        await Swal.fire({
                            title: "Error",
                            text: data.payload.message,
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                        setLoading(false);
                        return;
                    } else {
                        await Swal.fire({
                            title: "Approved!",
                            text: "The leave has been approved.",
                            icon: "success"
                        });

                        await dispatch(fetchGetLeavesOfManager({
                            token: token,
                            page: 0,
                            pageSize: 100,
                            searchText: searchText,
                        }));
                    }
                }
            } catch (error) {
                localStorage.removeItem("token");
                dispatch(clearToken());
            }
        }
        setLoading(false);
    };

    const handleReject = async () => {
        for (let id of selectedRowIds) {
            const selectedLeave = leaves.find((leave) => leave.id === id);
            if (!selectedLeave) continue;

            if (selectedLeave.isLeaveApproved) {
                await Swal.fire({
                    title: "Error",
                    text: 'Leave already approved',
                    icon: "error",
                    confirmButtonText: "OK",
                });
                continue;
            }

            setIsActivating(true);
            try {
                const result = await Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, reject it!"
                });

                if (result.isConfirmed) {
                    const data = await dispatch(fetchDeleteLeave({
                        token: token,
                        id: selectedLeave.id,
                    }));

                    if (data.payload.message) {
                        await Swal.fire({
                            title: "Error",
                            text: data.payload.message,
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                        return;
                    } else {
                        await Swal.fire({
                            title: "Rejected!",
                            text: "The leave has been rejected.",
                            icon: "success"
                        });

                        await dispatch(fetchGetLeavesOfManager({
                            token: token,
                            page: 0,
                            pageSize: 100,
                            searchText: searchText,
                        }));
                    }
                }
            } catch (error) {
                localStorage.removeItem("token");
                dispatch(clearToken());
            }
        }
        setIsActivating(false);
    };

    const handleAddDay = async () => {
        
    }

    const handleCancel = async () => {
        for (let id of selectedRowIds) {
            const selectedLeave = leaves.find((leave) => leave.id === id);
            if (!selectedLeave) continue;

            if (!selectedLeave.isLeaveApproved) {
                await Swal.fire({
                    title: "Error",
                    text: 'Leave not yet approved, cannot cancel.',
                    icon: "error",
                    confirmButtonText: "OK",
                });
                continue;
            }
            setLoading(true);
            try {
                const result = await Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, cancel it!"
                });

                if (result.isConfirmed) {
                    const data = await dispatch(fetchCancelLeave({
                        token: token,
                        id: selectedLeave.id,
                    }));

                    if (data.payload.message) {
                        await Swal.fire({
                            title: "Error",
                            text: data.payload.message,
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                        return;
                    } else {
                        await Swal.fire({
                            title: "Cancelled!",
                            text: "The leave has been cancelled.",
                            icon: "success"
                        });

                        await dispatch(fetchGetLeavesOfManager({
                            token: token,
                            page: 0,
                            pageSize: 100,
                            searchText: searchText,
                        }));
                    }
                }
            } catch (error) {
                localStorage.removeItem("token");
                dispatch(clearToken());
            }
        }
        setLoading(false);
    };

    return (
        <div style={{height: 400, width: "inherit"}}>
            <TextField
                label="Description"
                variant="outlined"
                onChange={(event) => setSearchText(event.target.value)}
                value={searchText}
                style={{marginBottom: "10px"}}
            />
            <DataGrid
                rows={leaves}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {page: 1, pageSize: 5},
                    },
                }}
                getRowClassName={(params) =>
                    params.row.isLeaveApproved
                        ? "approved-row"
                        : "unapproved-row"
                }
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
                    "& .approved-row": {
                        backgroundColor: "#e0f2e9",
                    },
                    "& .unapproved-row": {
                        backgroundColor: "#ffe0e0",
                    },
                }}
            />

            <Grid container spacing={1} style={{marginTop: 16}} direction="row">
                <Grid item>
                    <Button
                        onClick={handleApprove}
                        variant="contained"
                        color="primary"
                        disabled={loading || selectedRowIds.length === 0}
                    >
                        {loading ? "Approving..." : "Approve"}
                    </Button>
                </Grid>

                <Grid item>
                    <Button
                        onClick={handleReject}
                        variant="contained"
                        color="secondary"
                        disabled={loading || selectedRowIds.length === 0}
                    >
                        {loading ? "Rejecting..." : "Reject"}
                    </Button>
                </Grid>

                <Grid item>
                    <Button
                        onClick={handleCancel}
                        variant="contained"
                        color="error"
                        disabled={loading || selectedRowIds.length === 0}
                    >
                        {loading ? "Cancelling..." : "Cancel"}
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={1} style={{marginTop: 16}} direction="row">
                <Grid item>
                    <Button
                        onClick={handleAddDay}
                        variant="contained"
                        color="primary"
                    >
                        Add Annual Leave Day
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default SideBarManagerLeaves;
