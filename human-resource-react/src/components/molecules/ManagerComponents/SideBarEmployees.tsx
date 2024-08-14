import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel,
} from "@mui/x-data-grid";
import {
    Avatar, Box,
    Button, FormControl,
    Grid, InputLabel, MenuItem, Modal, Select,

    TextField, Typography

} from "@mui/material";
import { HumanResources, useAppSelector } from "../../../store";
import { useDispatch } from "react-redux";


import {
    changePageState,
    clearToken, fetchActivateUserByManager,
    fetchDeleteEmployeeByAdmin,
    fetchGetAllUsersOfManager, setSelectedEmployeeId
} from "../../../store/feature/authSlice";
import Swal from "sweetalert2";
import {IUser} from "../../../models/IUser";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {fetchSaveBonus} from "../../../store/feature/bonusSlice";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70, headerAlign: "center" },
    { field: "name", headerName: "First name", width: 150, headerAlign: "center" },
    { field: "surname", headerName: "Last name", width: 120, headerAlign: "center" },
    { field: "email", headerName: "Email", headerAlign: "center", width: 250 },
    { field: "phone", headerName: "Phone", sortable: false, headerAlign: "center", width: 140 },
    { field: "position", headerName: "Position", type: "string", width: 220, headerAlign: "center" },
    { field: "userType", headerName: "User Type", width: 150, headerAlign: "center" },
    { field: "employeeType", headerName: "Employee Type", width: 150, headerAlign: "center" },
    { field: "status", headerName: "Status", width: 120, headerAlign: "center" },
    {
        field: "photo",
        headerName: "Photo",
        width: 100,
        headerAlign: "center",
        sortable: false,
        renderCell: (params) => (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                <Avatar alt={params.row.name} src={params.value} />
            </div>
        ),
    },


];


export default function SideBarEmployees() {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');


    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const userList = useAppSelector((state) => state.auth.userList);
    const [loading, setLoading] = useState(false);
    const [isActivating, setIsActivating] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);


    const [description, setDescription] = useState('');
    const [bonusAmount, setBonusAmount] = useState(0);
    const [bonusDate, setBonusDate] = useState<Date | null>(null);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const openAddBonus = () => {
        if (selectedRowIds.length === 1) {
            const userToEdit = userList.find(
                (user) => user.id === selectedRowIds[0]
            );
            setSelectedUser(userToEdit || null);
            handleOpen();
        } else {
            Swal.fire("Please select exactly one company to edit.");
        }
    };

    const handleAddBonus = () => {
        if (bonusDate === null || bonusAmount === 0 || description === '') {
            handleClose();
            Swal.fire({
                title: "Error",
                text: "Please fill all the fields",
                icon: "error",
                confirmButtonText: "OK",
                confirmButtonColor: "#D32F2F",
            });
            setIsActivating(false);
            return;

        }
        dispatch(fetchSaveBonus({ token: token, description: description, bonusDate: bonusDate, bonusAmount: bonusAmount,employeeId:selectedRowIds[0] })).then(data => {
            if (data.payload.message) {
                Swal.fire({
                    title: "Error",
                    text: data.payload.message,
                    icon: "error",
                    confirmButtonText: "OK",

                });
                return
            }
            handleClose();
            Swal.fire({
                title: "Success",
                text: "Bonus added successfully",
                icon: "success",
                confirmButtonText: "OK",
            });

        })
    }

    useEffect(() => {
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
    }, [dispatch, searchText, token,loading,isActivating]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const handleOnClickAddDocument= () => {
        dispatch(setSelectedEmployeeId(selectedRowIds[0]))
        dispatch(changePageState("Add Document"))
    }

    const handleOnClickEditEmployee= () => {
        dispatch(setSelectedEmployeeId(selectedRowIds[0]))
        dispatch(changePageState("Edit Employee"))
    }

    const handleDeleteEmployee = async () => {
        setLoading(true);

        for (let id of selectedRowIds) {
            const selectedEmployee = userList.find((selectedEmployee) => selectedEmployee.id === id);
            if (!selectedEmployee) continue;

            if (selectedEmployee.status === "DELETED") {
                Swal.fire({
                    title: "Error",
                    text: "Employee already deleted",
                    icon: "error",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#D32F2F",
                });
                setLoading(false);
                return;
            }


            try {
                const result = await Swal.fire({
                    title: "Please Confirm Deletion of:  \n" + selectedEmployee.name + " " + selectedEmployee.surname,
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Confirm",
                    input: "radio",

                });

                if (result.isConfirmed) {


                    //fetch
                    const response = await dispatch(fetchDeleteEmployeeByAdmin({
                        token: token,
                        id: selectedEmployee.id,

                    })).then(data => {
                        if (data.payload.message) {
                            Swal.fire({
                                title: "Error",
                                text: data.payload.message,
                                icon: "error",
                                confirmButtonText: "OK",

                            });
                            return
                        }
                        Swal.fire({
                            title: "Success",
                            text: "Deletion completed",
                            icon: "success",
                            confirmButtonText: "OK",
                        });

                        fetchGetAllUsersOfManager({
                            token: token,
                            page: 0,
                            pageSize: 100,
                            searchText: searchText,
                        })
                    })

                }
            } catch (error) {
                localStorage.removeItem("token");
                dispatch(clearToken());
            }
        }

        setLoading(false);
    };

    const handleActivateEmployee = async () => {
        setIsActivating(true);

        for (let id of selectedRowIds) {
            const selectedEmployee = userList.find((selectedEmployee) => selectedEmployee.id === id);
            if (!selectedEmployee) continue;

            if (selectedEmployee.status === "ACTIVE") {
                Swal.fire({
                    title: "Error",
                    text: "Employee already active",
                    icon: "error",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#D32F2F",
                });
                setIsActivating(false);
                return;
            }


            try {
                const result = await Swal.fire({
                    title: "Please Confirm Activation of:  \n" + selectedEmployee.name + " " + selectedEmployee.surname,
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Confirm",
                    input: "radio",

                });

                if (result.isConfirmed) {


                    //fetch
                    const response = await dispatch(fetchActivateUserByManager({
                        token: token,
                        id: selectedEmployee.id,

                    })).then(data => {
                        if (data.payload.message) {
                            Swal.fire({
                                title: "Error",
                                text: data.payload.message,
                                icon: "error",
                                confirmButtonText: "OK",

                            });
                            return
                        }
                        Swal.fire({
                            title: "Success",
                            text: "Activation has been competed",
                            icon: "success",
                            confirmButtonText: "OK",
                        });

                        fetchGetAllUsersOfManager({
                            token: token,
                            page: 0,
                            pageSize: 100,
                            searchText: searchText,
                        })
                    })

                }
            } catch (error) {
                localStorage.removeItem("token");
                dispatch(clearToken());
            }
        }

        setIsActivating(false);
    };

    return (
        <div style={{ height: 400, width: "inherit" }}>
            <TextField
                label="Email"
                variant="outlined"
                onChange={(event) => setSearchText(event.target.value)}
                value={searchText}
                style={{ marginBottom: "10px" }}
            />
            <DataGrid
                rows={userList}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 1, pageSize: 5 },
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
                }}
            />

            <Grid container spacing={1} style={{ marginTop: 16 }} direction="row">
                <Grid item>
                    <Button
                        onClick={handleActivateEmployee}
                        variant="contained"
                        color="success"
                        disabled={ isActivating || selectedRowIds.length === 0}
                    >
                        {loading ? "Activate..." : "Activate Employee"}
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        onClick={handleDeleteEmployee}
                        variant="contained"
                        color="error"
                        disabled={ loading || selectedRowIds.length === 0}
                    >
                        {loading ? "Deleting..." : "Delete Employee"}
                    </Button>
                </Grid>

                <Grid item>
                    <Button
                        onClick={handleOnClickEditEmployee}
                        variant="contained"
                        color="warning"
                        disabled={  selectedRowIds.length>1 || selectedRowIds.length === 0}
                    >
                        Edit Employee
                    </Button>
                </Grid>

                <Grid item>
                    <Button
                        onClick={handleOnClickAddDocument}
                        variant="contained"
                        color="primary"
                        disabled={  selectedRowIds.length>1 || selectedRowIds.length === 0}
                    >
                        Add Document
                    </Button>
                </Grid>

                <Grid item>
                    <Button
                        onClick={openAddBonus}
                        variant="contained"
                        color="primary"
                        disabled={  selectedRowIds.length>1 || selectedRowIds.length === 0}
                    >
                        Add Bonus
                    </Button>
                </Grid>
            </Grid>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-title" variant="h6" component="h2">
                        Add Bonus to {selectedUser && selectedUser.name + " " + selectedUser.surname}
                    </Typography>
                    {selectedUser && (
                        <form >
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField sx={{ marginTop: "25px" }}
                                               label="Description"
                                               name="description"
                                               variant="outlined"

                                               onChange={event => setDescription(event.target.value)}
                                               fullWidth
                                               style={{ marginBottom: "10px" }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                               label="Bonus Amount $"
                                               name="bonusAmount"
                                               variant="outlined"
                                               type={"number"}
                                               onChange={event => setBonusAmount(parseInt(event.target.value))}
                                               fullWidth
                                               style={{ marginBottom: "10px" }}
                                    />
                                </Grid>
                                <Grid sx={{ marginBottom: "25px"  }} item xs={12}>
                                    <LocalizationProvider   dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Bonus Date"
                                            value={bonusDate ? dayjs(bonusDate) : null}
                                            disablePast={true}
                                            onChange={(newValue) => setBonusDate(newValue ? newValue.toDate() : null)}

                                        />
                                    </LocalizationProvider>
                                </Grid>
                            </Grid>
                            <Button
                                onClick={handleAddBonus}
                                variant="contained"
                                color="primary"
                                disabled={loading}
                                fullWidth
                            >
                                {loading ? "Adding..." : "Add Bonus"}
                            </Button>
                        </form>
                    )}
                </Box>
            </Modal>

        </div>
    );
}
const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};
