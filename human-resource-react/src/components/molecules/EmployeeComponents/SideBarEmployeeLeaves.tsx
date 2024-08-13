import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel,
} from "@mui/x-data-grid";
import {
    Button, FormControl,
    Grid, InputAdornment, InputLabel, OutlinedInput,
    TextField, Typography
} from "@mui/material";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { parseISO } from 'date-fns';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from '@mui/x-date-pickers';
import {
    fetchDeleteLeave,
    fetchSaveLeave,
    fetchGetLeavesOfEmployee,
    fetchCancelLeave
} from "../../../store/feature/leaveSlice"; // Import your actions
import { HumanResources, useAppSelector } from "../../../store"; // Import your hooks
import { ELeaveType } from "../../../models/ELeaveType";
import { clearToken, fetchFindUserByToken } from "../../../store/feature/authSlice";
import MyDropzone from "../../atoms/DropZone";

const leaveColumns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70, headerAlign: "center" },
    { field: "description", headerName: "Description", width: 200, headerAlign: "center" },

    { field: "startDate", headerName: "Start Date", width: 150, headerAlign: "center" },
    { field: "endDate", headerName: "End Date", width: 150, headerAlign: "center" },
    { field: "leaveType", headerName: "Leave Type", width: 150, headerAlign: "center" },
    { field: "isLeaveApproved", headerName: "Approval Status", headerAlign: "center", width: 250 },
    { field: "approveDate", headerName: "Approval Date", width: 150, headerAlign: "center" },
    { field: "status", headerName: "Status", width: 120, headerAlign: "center" },

];

export default function SideBarEmployeeLeaves() {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');
    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const user = useAppSelector((state) => state.auth.user);
    const leaveList = useAppSelector((state) => state.leave.leaveList);
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState('');
    const [leaveType, setLeaveType] = useState<ELeaveType>(ELeaveType.ANNUAL); // Default to ANNUAL
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [files, setFiles] = useState<File[]>([]);

    useEffect(() => {
        dispatch(
            fetchGetLeavesOfEmployee({
                token: token,
                page: 0,
                pageSize: 100,
                searchText: searchText,
            })
        ).then(()=> {
            dispatch(fetchFindUserByToken(token))
        }).catch(() => {
            // handle error, e.g., clear token
        });
    }, [dispatch, searchText, token]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const handleDelete = async () => {
        for (let id of selectedRowIds) {
            const selectedLeave = leaveList.find(
                (leave) => leave.id === id
            );
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

            setLoading(true);
            try {
                const result = await Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!"
                });

                if (result.isConfirmed) {
                    await dispatch(fetchDeleteLeave({ token, id: selectedLeave.id }));
                    await Swal.fire({
                        title: "Deleted!",
                        text: "Your leave has been deleted.",
                        icon: "success"
                    });
                    dispatch(fetchGetLeavesOfEmployee({ token, page: 0, pageSize: 100, searchText }));
                }
            } catch (error) {
                // handle error, e.g., clear token
            } finally {
                setLoading(false);
            }
        }
    };

    const handleCancel = async () => {
        for (let id of selectedRowIds) {
            const selectedLeave = leaveList.find(
                (leave) => leave.id === id
            );
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
                    await dispatch(fetchCancelLeave({ token, id: selectedLeave.id }));
                    await Swal.fire({
                        title: "Cancelled!",
                        text: "Your leave has been cancelled.",
                        icon: "success"
                    });
                    dispatch(fetchGetLeavesOfEmployee({ token, page: 0, pageSize: 100, searchText }));
                }
            } catch (error) {
                // handle error, e.g., clear token
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSaveLeave = async () => {
        // Validate required fields
        if (!description || !startDate || !endDate || !leaveType) {
            Swal.fire({
                title: "Error",
                text: "Please fill in all required fields.",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        setLoading(true);
        try {
            const result = await dispatch(fetchSaveLeave({
                token,
                description,
                startDate: new Date(startDate.setHours(12)), // Convert Dayjs to JS Date and add 12 hours
                endDate: new Date(endDate.setHours(12)), // Convert Dayjs to JS Date and add 12 hours
                leaveType,
                files: files,
            })).unwrap();

            if (!result.code) {
                Swal.fire({
                    title: "Success",
                    text: "Leave has been added",
                    icon: "success",
                    confirmButtonText: "OK",
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Something went wrong.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }

            dispatch(fetchGetLeavesOfEmployee({ token, page: 0, pageSize: 100, searchText }));
        } catch (error) {
            dispatch(clearToken())
        } finally {
            setLoading(false);
        }
    };



    return (
        <div style={{ height: 400, width: "inherit" }}>
            <Grid container spacing={1} style={{ marginTop: 16 }} direction="row" alignItems="center">
                <Grid item>
                    <TextField
                        label="Search by Description"
                        variant="outlined"
                        onChange={(event) => setSearchText(event.target.value)}
                        value={searchText}
                        style={{ marginBottom: "10px" }}
                    />
                </Grid>
                <Grid item sx={{ marginLeft: '10px' }}>
                    <Typography
                        sx={{
                            fontWeight: "bold",
                            marginBottom: "10px",
                            color: 'red',
                            borderRadius: '5px',
                            border: '1px solid',
                            borderColor: 'red',
                            padding: '10px',
                            minHeight: '56px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        Remaining Annual Leave: {user.remainingAnnualLeave} day{user.remainingAnnualLeave > 0 ? 's' : ''}
                    </Typography>
                </Grid>
            </Grid>
            <DataGrid
                rows={leaveList}
                columns={leaveColumns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 1, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                getRowClassName={(params) =>
                    params.row.isLeaveApproved
                        ? "approved-row"
                        : "unapproved-row"
                }
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

            <Grid container spacing={1} style={{ marginTop: 16 }} direction="row">
                <Grid item>
                    <Button
                        onClick={handleDelete}
                        variant="contained"
                        color="error"
                        disabled={loading || selectedRowIds.length === 0}
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        onClick={handleCancel}
                        variant="contained"
                        color="warning"
                        disabled={loading || selectedRowIds.length === 0}
                    >
                        {loading ? "Cancelling..." : "Cancel"}
                    </Button>
                </Grid>
            </Grid>

            <Grid container spacing={2} style={{ marginTop: 16 }} alignItems="center">
                <Grid item xs={2}>
                    <Typography sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                        Add Leave
                    </Typography>
                </Grid>

                <Grid container item xs={12} spacing={2} alignItems="center">
                    <Grid item>
                        <TextField
                            label="Description"
                            name="description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                            style={{ width: 259 }}
                        />
                    </Grid>

                    <Grid item >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                shouldDisableDate={(date) => date.isBefore(dayjs().subtract(1, 'day'))}
                                label="Leave Start Date"
                                value={startDate ? dayjs(startDate) : null}
                                onChange={(newValue) => setStartDate(newValue ? newValue.toDate() : null)}
                            />
                        </LocalizationProvider>
                    </Grid>

                    <Grid item >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                shouldDisableDate={startDate ? (date) => date.isBefore(startDate) : undefined}
                                label="Leave End Date"
                                value={endDate ? dayjs(endDate) : null}
                                onChange={(newValue) => setEndDate(newValue ? newValue.toDate() : null)}
                            />
                        </LocalizationProvider>
                    </Grid>

                    <Grid item >
                        <TextField
                            select
                            label="Leave Type"
                            value={leaveType}
                            onChange={e => setLeaveType(e.target.value as ELeaveType)}
                            required
                            SelectProps={{ native: true }}
                            style={{ width: 259 }}
                        >
                            {Object.values(ELeaveType).map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item style={{ width: 399, height: 72 }}>
                        <MyDropzone onFilesAdded={setFiles} />
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSaveLeave}
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save Leave"}
                        </Button>
                    </Grid>
                </Grid>
            </Grid>

        </div>
    );
}
