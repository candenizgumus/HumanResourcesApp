import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel,
} from "@mui/x-data-grid";
import {
    Button,
    Grid,
    TextField, Typography
} from "@mui/material";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from '@mui/x-date-pickers';
import {
    fetchDeleteLeave,
    fetchSaveLeave,
    fetchGetLeavesOfEmployee,
    fetchCancelLeave,
} from "../../../store/feature/leaveSlice";
import { fetchGetDefinitions } from "../../../store/feature/definitionSlice";
import { HumanResources, useAppSelector } from "../../../store"; //
import { clearToken, fetchFindUserByToken } from "../../../store/feature/authSlice";
import MyDropzone from "../../atoms/DropZone";
import DownloadButtonFromS3 from "../../atoms/DownloadButtonFromS3";
import { EDefinitionType } from "../../../models/IDefinitionType";
import { AddIcon, CancelIcon, DeleteIcon } from "../../atoms/icons";
import { myErrorColour, myLightColour } from "../../../util/MyColours";

export default function SideBarEmployeeLeaves() {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');
    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const user = useAppSelector((state) => state.auth.user);
    const leaveList = useAppSelector((state) => state.leave.leaveList);
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState('');
    const [leaveType, setLeaveType] = useState('ANNUAL'); // Default to ANNUAL
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const leaveTypes = useAppSelector((state) => state.definition.definitionList);
    const leaveColumns: GridColDef[] = [
        { field: "description", headerName: "Description", flex: 2, headerAlign: "center" },

        { field: "startDate", headerName: "Start Date", flex: 2, headerAlign: "center" },
        { field: "endDate", headerName: "End Date", flex: 2, headerAlign: "center" },
        { field: "leaveType", headerName: "Leave Type", flex: 2, headerAlign: "center" },
        { field: "isLeaveApproved", headerName: "Approval Status", flex: 1.5, headerAlign: "center" },
        { field: "approveDate", headerName: "Approval Date", flex: 2, headerAlign: "center" },
        { field: "status", headerName: "Status", flex: 1, headerAlign: "center" },
        {
            field: "attachedFile", headerName: "Document", flex: 1, headerAlign: "center",
            renderCell: (params) => (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                    {params.value && <DownloadButtonFromS3 fileKey={params.value} />}
                </div>
            )
        },
        { field: "managerName", headerName: "Manager Name", flex: 2, headerAlign: "center" },
        { field: "responseMessage", headerName: "Response Message", flex: 2, headerAlign: "center" },

    ];

    useEffect(() => {
        dispatch(
            fetchGetLeavesOfEmployee({
                token: token,
                page: 0,
                pageSize: 100,
                searchText: searchText,
            })
        ).then(() => {
            dispatch(fetchFindUserByToken(token)).then(() => {
                dispatch(fetchGetDefinitions({
                    token: token,
                    definitionType: EDefinitionType.LEAVE_TYPE
                }))
            })
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
                    confirmButtonColor: myLightColour,
                    cancelButtonColor: myErrorColour,
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
                    confirmButtonColor: myLightColour,
                    cancelButtonColor: myErrorColour,
                    confirmButtonText: "Yes, delete it!"
                });

                if (result.isConfirmed) {
                    await dispatch(fetchDeleteLeave({ token, id: selectedLeave.id, responseMessage: '' }));
                    await Swal.fire({
                        title: "Deleted!",
                        text: "Your leave has been deleted.",
                        icon: "success",
                        confirmButtonColor: myLightColour,
                        cancelButtonColor: myErrorColour,
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
                    title: "Error!",
                    text: 'Leave not yet approved, cannot cancel.',
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1500
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
                    confirmButtonColor: myLightColour,
                    cancelButtonColor: myErrorColour,
                    confirmButtonText: "Yes, cancel it!"
                });

                if (result.isConfirmed) {
                    await dispatch(fetchCancelLeave({ token, id: selectedLeave.id, responseMessage: '' }));
                    await Swal.fire({
                        title: "Cancelled!",
                        text: "Your leave has been cancelled.",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500
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
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        setLoading(true);
        try {
            const result = await dispatch(fetchSaveLeave({
                token,
                description,
                startDate: startDate,
                endDate: endDate,
                leaveType,
                files: files,
            })).unwrap();

            if (!result.code) {
                Swal.fire({
                    title: "Success!",
                    text: "Leave has been added",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    title: "Error!",
                    text: "Something went wrong.",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1500
                });
            }

            dispatch(fetchGetLeavesOfEmployee({ token, page: 0, pageSize: 100, searchText }));
        } catch (error) {
            dispatch(clearToken())
        } finally {
            setLoading(false);
        }
    };
    const handleFilesAdded = (newFiles: File[]) => {
        setFiles(prevFiles => [...prevFiles, ...newFiles]);
    };

    const handleFileRemoved = (fileToRemove: File) => {
        setFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
        // Ekstra işlemler burada yapılabilir
    };


    return (
        <div style={{ height: 'auto', width: "inherit" }}>
            <TextField
                label="Search By Description"
                variant="outlined"
                onChange={(event) => setSearchText(event.target.value)}
                value={searchText}
                style={{ marginBottom: "1%", marginTop: "1%" }}
                fullWidth
                inputProps={{ maxLength: 50 }}
            />
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
                    height: '407px'
                }}
            />

            <Grid sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: '2%', marginBottom: '2%' }}>
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
                <Button
                    onClick={handleCancel}
                    variant="contained"
                    color="warning"
                    disabled={loading || selectedRowIds.length === 0}
                    startIcon={<CancelIcon />}
                    sx={{ marginRight: '1%', width: '200px' }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleSaveLeave}
                    disabled={loading || !description || !startDate || !endDate}
                    startIcon={<AddIcon />}
                    sx={{ marginRight: '1%', width: '200px' }}
                >
                    Add
                </Button>
            </Grid>

            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Add Leave
                    </Typography>
                </Grid>
                <Grid item xs={12}>
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
                <Grid container item xs={12} spacing={2} alignItems="center">
                    <Grid item xs={6}>
                        <TextField
                            label="Description"
                            name="description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={6}>
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
                    <Grid item xs={6}>
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
                    <Grid item xs={6}>
                        <TextField
                            select
                            label="Leave Type"
                            value={leaveType}
                            onChange={e => setLeaveType(e.target.value)}
                            required
                            SelectProps={{ native: true }}
                            fullWidth
                        >
                            {Object.values(leaveTypes).map(type => (
                                <option key={type.name} value={type.name}>{type.name}</option>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <MyDropzone
                            onFilesAdded={handleFilesAdded}
                            onFileRemoved={handleFileRemoved}
                        />
                    </Grid>
                </Grid>
            </Grid>

        </div >
    );
}
