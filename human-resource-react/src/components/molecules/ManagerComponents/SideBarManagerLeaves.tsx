import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel,
} from "@mui/x-data-grid";
import CircularProgress from '@mui/material/CircularProgress';
import {
    Button,
    Grid,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Autocomplete,
    Box,
} from "@mui/material";
import { HumanResources, useAppSelector } from "../../../store";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from '@mui/x-date-pickers';
import MyDropzone from "../../atoms/DropZone";
import DownloadButtonFromS3 from "../../atoms/DownloadButtonFromS3";
import {
    fetchGetLeavesOfManager, fetchApproveLeave,
    fetchDeleteLeave, fetchCancelLeave, fetchUpdateAnnualLeaveDays,
    fetchAssignLeave,
    ILeave,
    fetchGetLeaveById,
    fetchUpdateLeave,
} from "../../../store/feature/leaveSlice";

import {fetchGetDefinitions} from "../../../store/feature/definitionSlice";
import { clearToken, fetchGetAllUsersOfManager } from "../../../store/feature/authSlice";
import { EDefinitionType } from "../../../models/IDefinitionType";
import { idID } from "@mui/material/locale";

const SideBarManagerLeaves = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');

    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const leaves = useAppSelector((state) => state.leave.leaveList);
    const leaveTypes = useAppSelector((state) => state.definition.definitionList);
    const [loading, setLoading] = useState(false);
    const [isActivating, setIsActivating] = useState(false);
    const [openChangeAnnualLeaveDayModal, setOpenChangeAnnualLeaveDayModal] = useState(false);
    const [openAssignLeaveModal, setOpenAssignLeaveModal] = useState(false);
    const [openEditLeaveModal, setOpenEditLeaveModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
    const [newLeaveDays, setNewLeaveDays] = useState(0);
    const employees = useAppSelector((state) => state.auth.userList);
    const [description, setDescription] = useState('');
    const [leaveType, setLeaveType] = useState('ANNUAL'); // Default to ANNUAL
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const selectedLeave = useAppSelector((state) => state.leave.selectedLeave);
    const [updateStartDate, setUpdateStartDate] = useState<Date>(selectedLeave.startDate);
    const [updateEndDate, setUpdateEndDate] = useState<Date>(selectedLeave.endDate);
    
    const [files, setFiles] = useState<File[]>([]);
   

    const columns: GridColDef[] = [
        { field: "fullName", headerName: "Name", flex :1, headerAlign: "center" },
        { field: "email", headerName: "Email", flex :1, headerAlign: "center" },
        { field: "description", headerName: "Description", flex :2, headerAlign: "center" },
    
        { field: "startDate", headerName: "Start Date", flex :1, headerAlign: "center" },
        { field: "endDate", headerName: "End Date", flex :1, headerAlign: "center" },
        { field: "leaveType", headerName: "Leave Type", flex :1, headerAlign: "center" },
        { field: "isLeaveApproved", headerName: "Approval Status", headerAlign: "center", flex :1 },
        { field: "approveDate", headerName: "Approval Date", flex :1, headerAlign: "center" },
        { field: "status", headerName: "Status", flex :1, headerAlign: "center" },
        {
            field: "attachedFile", headerName: "Document", headerAlign: "center", flex :1,
            renderCell: (params) => (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                    {params.value && <DownloadButtonFromS3 fileKey={params.value} />}
                </div>
            )
        },
    ];

    useEffect(() => {
        dispatch(
            fetchGetLeavesOfManager({
                token: token,
                page: 0,
                pageSize: 100,
                searchText: searchText,
            })).then(()=> {
                dispatch(fetchGetDefinitions({
                    token : token,
                    definitionType: EDefinitionType.LEAVE_TYPE
                })).then(()=> {
                    dispatch(fetchGetAllUsersOfManager({
                        token: token,
                        page: 0,
                        pageSize: 100,
                        searchText: searchText,
                    }))
                })
            })
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
    
            if (selectedLeave.isLeaveApproved) {
                await Swal.fire({
                    title: "Error",
                    text: 'Leave already approved',
                    icon: "error",
                    confirmButtonText: "OK",
                    confirmButtonColor: '#1976D2',
                });
                return;
            }
    
            setLoading(true);
            try {
                const result = await Swal.fire({
                    title: "Are you sure?",
                    text: "Please provide a reason for approval:",
                    icon: "warning",
                    input: "textarea",
                    inputPlaceholder: "Enter your reason here...",
                    inputValidator: (value) => {
                        if (!value) {
                            return "You need to provide a reason!";
                        }
                    },
                    showCancelButton: true,
                    confirmButtonColor: '#1976D2',
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, approve it!"
                });
    
                if (result.isConfirmed && result.value) {
                    const data = await dispatch(fetchApproveLeave({
                        token: token,
                        id: selectedLeave.id,
                        responseMessage: result.value
                    }));
    
                    if (data.payload.message) {
                        await Swal.fire({
                            title: "Error",
                            text: data.payload.message,
                            icon: "error",
                            confirmButtonText: "OK",
                        });
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
            } finally {
                setLoading(false);
            }
        }
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
                    text: "Please provide a reason for rejection:",
                    icon: "warning",
                    input: "textarea",
                    inputPlaceholder: "Enter your reason here...",
                    inputValidator: (value) => {
                        if (!value) {
                            return "You need to provide a reason!";
                        }
                    },
                    showCancelButton: true,
                    confirmButtonColor: '#1976D2',
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, reject it!"
                });
    
                if (result.isConfirmed && result.value) {
                    const data = await dispatch(fetchDeleteLeave({
                        token: token,
                        id: selectedLeave.id,
                        responseMessage: result.value
                    }));
    
                    if (data.payload.message) {
                        await Swal.fire({
                            title: "Error",
                            text: data.payload.message,
                            icon: "error",
                            confirmButtonText: "OK",
                        });
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
            } finally {
                setIsActivating(false);
            }
        }
    };
    
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
                    text: "Please provide a reason for cancellation:",
                    icon: "warning",
                    input: "textarea",
                    inputPlaceholder: "Enter your reason here...",
                    inputValidator: (value) => {
                        if (!value) {
                            return "You need to provide a reason!";
                        }
                    },
                    showCancelButton: true,
                    confirmButtonColor: '#1976D2',
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, cancel it!"
                });
    
                if (result.isConfirmed && result.value) {
                    const data = await dispatch(fetchCancelLeave({
                        token: token,
                        id: selectedLeave.id,
                        responseMessage: result.value
                    }));
    
                    if (data.payload.message) {
                        await Swal.fire({
                            title: "Error",
                            text: data.payload.message,
                            icon: "error",
                            confirmButtonText: "OK",
                        });
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
            } finally {
                setLoading(false);
            }
        }
    };
    

    const handleUpdateAnnualLeaveDays = async () => {
        setOpenChangeAnnualLeaveDayModal(true);
    };

    const handleAssignLeave = async () => {
        setOpenAssignLeaveModal(true)
    }

    const handleEditLeave = () => {
        dispatch(fetchGetLeaveById({
            token,
            id: selectedRowIds[0]
        })).then(data => {
            if (data.payload.message) {
                Swal.fire({
                    title: "Error",
                    text: data.payload.message,
                    icon: "error",
                    confirmButtonText: "OK",
                });
                return;
            }
            console.log(data.payload)
            setDescription(data.payload.description)
            setUpdateStartDate(data.payload.startDate)
            setUpdateEndDate(data.payload.endDate)
            setLeaveType(data.payload.leaveType)
        })
        setOpenEditLeaveModal(true)
    }

    const handleCloseChangeAnnualLeaveDayModal = () => {
        setOpenChangeAnnualLeaveDayModal(false);
        setSelectedEmployee(null);
        setNewLeaveDays(0);
    };

    const handleCloseAssignLeaveModal = () => {
        setOpenAssignLeaveModal(false);
        setSelectedEmployee(null);
        setDescription('');
        setEndDate(null);
        setStartDate(null);
        setLeaveType('ANNUAL');
        setFiles([]);
    };

    const handleCloseEditLeaveModal = () => {
        setOpenEditLeaveModal(false);
    };

    const handleEmployeeChange = (event: any, selectedEmployee: any) => {
        if (selectedEmployee) {
            setSelectedEmployee(selectedEmployee);
            setNewLeaveDays(selectedEmployee.remainingAnnualLeave);
        } else {
            setSelectedEmployee(null);
        }
    };

    const handleSaveLeaveDays = async () => {
        if (!selectedEmployee || newLeaveDays <= 0) {
            handleCloseChangeAnnualLeaveDayModal();
            Swal.fire({
                title: "Error",
                text: "Please select an employee and enter valid leave days.",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        setLoading(true);

        try {
            const result = await dispatch(
                fetchUpdateAnnualLeaveDays({
                    token: token,
                    id: selectedEmployee.id,
                    leaveDays: newLeaveDays,
                })
            );

            if (result.payload.message) {
                Swal.fire({
                    title: "Error",
                    text: result.payload.message,
                    icon: "error",
                    confirmButtonText: "OK",
                });
            } else {
                Swal.fire({
                    title: "Success",
                    text: "Annual leave days updated successfully.",
                    icon: "success",
                    confirmButtonText: "OK",
                });

                dispatch(
                    fetchGetAllUsersOfManager({
                        token: token,
                        page: 0,
                        pageSize: 100,
                        searchText: searchText,
                    })
                )
                    .catch(() => {
                        dispatch(clearToken());
                    });

                handleCloseChangeAnnualLeaveDayModal();
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "An error occurred while updating leave days.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }

        setLoading(false);
    };

    const handleSaveLeave = async () => {
        if (!selectedEmployee) {
            handleCloseAssignLeaveModal();
            Swal.fire({
                title: "Error",
                text: "Please select an employee.",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        setLoading(true);

        if (!description || !startDate || !endDate || !leaveType) {
            handleCloseAssignLeaveModal();
            Swal.fire({
                title: "Error",
                text: "Please fill in all required fields.",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        try {
            const result = await dispatch(
                fetchAssignLeave({
                    token,
                    description,
                    startDate: startDate,
                    endDate: endDate,
                    leaveType,
                    files: files,
                    employeeId: selectedEmployee.id
                })
            );

            if (result.payload.message) {
                Swal.fire({
                    title: "Error",
                    text: result.payload.message,
                    icon: "error",
                    confirmButtonText: "OK",
                });
            } else {
                Swal.fire({
                    title: "Success",
                    text: "Leave assigned successfully.",
                    icon: "success",
                    confirmButtonText: "OK",
                });

                dispatch(
                    fetchGetAllUsersOfManager({
                        token: token,
                        page: 0,
                        pageSize: 100,
                        searchText: searchText,
                    })
                ).then(() => {
                    dispatch(fetchGetLeavesOfManager({
                        token: token,
                        page: 0,
                        pageSize: 100,
                        searchText: searchText,
                    }))
                })
                    .catch(() => {
                        dispatch(clearToken());
                    });


                handleCloseAssignLeaveModal();
            }
        } catch (error) {
            handleCloseAssignLeaveModal();
            Swal.fire({
                title: "Error",
                text: "An error occurred while assigning leave.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
        setLoading(false);
    }

    const handleFilesAdded = (newFiles: File[]) => {
        setFiles(prevFiles => [...prevFiles, ...newFiles]);
    };

    const handleFileRemoved = (fileToRemove: File) => {
        setFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
        // Ekstra işlemler burada yapılabilir
    };

    const handleUpdateLeave = async () => {
        setLoading(true);
        try {
            const result = await dispatch(
                fetchUpdateLeave({
                    token,
                    id: selectedLeave.id,
                    description: description,
                    startDate: updateStartDate,
                    endDate: updateEndDate,
                    leaveType: leaveType,
                })
            );

            if (result.payload.message) {
                handleCloseEditLeaveModal();
                Swal.fire({
                    title: "Error",
                    text: result.payload.message,
                    icon: "error",
                    confirmButtonText: "OK",
                });
            } else {
                handleCloseEditLeaveModal();
                Swal.fire({
                    title: "Success",
                    text: "Leave edited successfully.",
                    icon: "success",
                    confirmButtonText: "OK",
                });

                dispatch(
                    fetchGetAllUsersOfManager({
                        token: token,
                        page: 0,
                        pageSize: 100,
                        searchText: searchText,
                    })
                ).then(() => {
                    dispatch(fetchGetLeavesOfManager({
                        token: token,
                        page: 0,
                        pageSize: 100,
                        searchText: searchText,
                    }))
                })
                    .catch(() => {
                        dispatch(clearToken());
                    });


                handleCloseEditLeaveModal();
            }
        } catch (error) {
            handleCloseEditLeaveModal();
            Swal.fire({
                title: "Error",
                text: "An error occurred while editing leave.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
        setLoading(false);
    }

    return (
        <>
            <div style={{ height: "auto", width: "inherit" }}>
                <TextField
                    label="Description"
                    variant="outlined"
                    onChange={(event) => setSearchText(event.target.value)}
                    value={searchText}
                    style={{ marginBottom: "10px" }}
                />
                <DataGrid
                    rows={leaves}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 1, pageSize: 5 },
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
                <Grid container spacing={1} style={{ marginTop: 16 }} direction="row">
                    <Grid item>
                        <Button
                            onClick={handleApprove}
                            variant="contained"
                            color="primary"
                            disabled={loading || selectedRowIds.length === 0}
                        >
                            Approve
                        </Button>
                    </Grid>

                    <Grid item>
                        <Button
                            onClick={handleReject}
                            variant="contained"
                            color="secondary"
                            disabled={loading || selectedRowIds.length === 0}
                        >
                            Reject
                        </Button>
                    </Grid>

                    <Grid item>
                        <Button
                            onClick={handleCancel}
                            variant="contained"
                            color="error"
                            disabled={loading || selectedRowIds.length === 0}
                        >
                            Cancel
                        </Button>
                    </Grid>

                    <Grid item>
                        <Button
                            onClick={handleEditLeave}
                            variant="contained"
                            color="error"
                            disabled={loading || selectedRowIds.length === 0}
                        >
                            Edit
                        </Button>
                    </Grid>
                </Grid>

                <Grid container spacing={1} style={{ marginTop: 16 }} direction="row">
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleUpdateAnnualLeaveDays}
                            style={{ marginTop: "20px" }}
                        >
                            Update Annual Leave Days
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAssignLeave}
                            style={{ marginTop: "20px" }}
                        >
                            Assign Leave
                        </Button>
                    </Grid>
                </Grid>
                <Dialog open={openChangeAnnualLeaveDayModal} onClose={handleCloseChangeAnnualLeaveDayModal} fullWidth maxWidth='sm'>
                    <DialogTitle>Update Annual Leave Days</DialogTitle>
                    <DialogContent>
                        <Box mt={2}>
                            <Autocomplete
                                options={employees}
                                getOptionLabel={(option) => option.name}
                                onChange={handleEmployeeChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Employee"
                                        variant="outlined"
                                        fullWidth
                                    />
                                )}
                            />
                            {selectedEmployee && (
                                <TextField
                                    label="New Annual Leave Days"
                                    type="number"
                                    value={newLeaveDays}
                                    onChange={(e) => setNewLeaveDays(Number(e.target.value))}
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseChangeAnnualLeaveDayModal} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleSaveLeaveDays} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={openAssignLeaveModal} onClose={handleCloseAssignLeaveModal} fullWidth maxWidth='sm'>
                    <DialogTitle>Assign Leave</DialogTitle>
                    <DialogContent>
                        <Box mt={2}>
                            <Autocomplete
                                options={employees}
                                getOptionLabel={(option) => option.name}
                                onChange={handleEmployeeChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Employee"
                                        variant="outlined"
                                        fullWidth
                                    />
                                )}
                            />
                            {selectedEmployee && (
                                <>
                                    <Grid item mt={2}>
                                        <TextField
                                            label="Description"
                                            name="description"
                                            value={description}
                                            onChange={e => setDescription(e.target.value)}
                                            required
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} mt={2}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                shouldDisableDate={(date) => date.isBefore(dayjs().subtract(1, 'day'))}
                                                label="Leave Start Date"
                                                value={startDate ? dayjs(startDate) : null}
                                                onChange={(newValue) => setStartDate(newValue ? newValue.toDate() : null)}
                                                sx={{ width: '100%' }}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={12} mt={2}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                shouldDisableDate={startDate ? (date) => date.isBefore(startDate) : undefined}
                                                label="Leave End Date"
                                                value={endDate ? dayjs(endDate) : null}
                                                onChange={(newValue) => setEndDate(newValue ? newValue.toDate() : null)}
                                                sx={{ width: '100%' }}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item mt={2}>
                                        <TextField
                                            select
                                            label="Leave Type"
                                            value={leaveType}
                                            onChange={e => setLeaveType(e.target.value)}
                                            required
                                            fullWidth
                                            SelectProps={{ native: true }}
                                        >
                                            {Object.values(leaveTypes).map(type => (
                                                <option key={type.name} value={type.id}>{type.name}</option>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item mt={2}>
                                        <MyDropzone
                                            onFilesAdded={handleFilesAdded}
                                            onFileRemoved={handleFileRemoved}
                                        />
                                    </Grid>
                                </>
                            )}
                        </Box>
                        {loading && (
                            <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                                <CircularProgress />
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseAssignLeaveModal} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleSaveLeave} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={openEditLeaveModal} onClose={handleCloseEditLeaveModal} fullWidth maxWidth='sm'>
                    <DialogTitle>Edit Leave</DialogTitle>
                    <DialogContent>
                        <Box mt={2}>
                            {selectedRowIds.length === 1 && (
                                <>
                                    <Grid item mt={2}>
                                        <TextField
                                            label="Description"
                                            name="description"
                                            value={description}
                                            onChange={e => setDescription(e.target.value)}
                                            required
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} mt={2}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                shouldDisableDate={(date) => date.isBefore(dayjs().subtract(1, 'day'))}
                                                label="Leave Start Date"
                                                value={dayjs(updateStartDate)}
                                                onChange={(newValue) => setUpdateStartDate(newValue ? newValue.toDate() : selectedLeave.startDate)}
                                                sx={{ width: '100%' }}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={12} mt={2}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                shouldDisableDate={startDate ? (date) => date.isBefore(startDate) : undefined}
                                                label="Leave End Date"
                                                value={dayjs(updateEndDate)}
                                                onChange={(newValue) => setUpdateEndDate(newValue ? newValue.toDate() : selectedLeave.startDate)}
                                                sx={{ width: '100%' }}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item mt={2}>
                                        <TextField
                                            select
                                            label="Leave Type"
                                            value={leaveType}
                                            onChange={e => setLeaveType(e.target.value)}
                                            required
                                            fullWidth
                                            SelectProps={{ native: true }}
                                        >
                                            {Object.values(leaveTypes).map(type => (
                                                <option key={type.name} value={type.name}>{type.name}</option>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </>
                            )}
                        </Box>
                        {loading && (
                            <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                                <CircularProgress />
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseEditLeaveModal} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateLeave} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
};

export default SideBarManagerLeaves;
