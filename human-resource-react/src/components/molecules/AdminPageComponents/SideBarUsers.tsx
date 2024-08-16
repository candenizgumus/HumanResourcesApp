import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridPaginationModel,
    GridRowSelectionModel, GridToolbar,
} from "@mui/x-data-grid";
import {
    Avatar,
    Box, Button, FormControl, Grid, InputLabel, MenuItem, Modal, Select,

    TextField, Typography

} from "@mui/material";
import { HumanResources, useAppSelector } from "../../../store";
import { useDispatch } from "react-redux";

import {
    clearToken,
    fetchGetAllUsers,
    fetchGetStatus,
    fetchGetUserCount,
    fetchUpdateUserByAdmin
} from "../../../store/feature/authSlice";
import Swal from "sweetalert2";
import { IUser } from "../../../models/IUser";


const columns: GridColDef[] = [
    { field: "companyId", headerName: "Company Id", flex :1 , headerAlign: "center" },
    { field: "name", headerName: "First name", flex :1, headerAlign: "center" },
    { field: "surname", headerName: "Last name", flex :1, headerAlign: "center" },
    { field: "email", headerName: "Email", headerAlign: "center", flex :2},
    { field: "phone", headerName: "Phone", sortable: false, headerAlign: "center", flex :1 },
    { field: "sector", headerName: "Sector", type: "string", flex :2, headerAlign: "center" },
    { field: "userType", headerName: "User Type", flex :1, headerAlign: "center" },
    { field: "subscriptionType", headerName: "Sub. Type", flex :1, headerAlign: "center" },
    { field: "subscriptionStartDate", headerName: "Sub. Start Date", type: "string", flex :1, headerAlign: "center" },
    { field: "subscriptionEndDate", headerName: "Sub. End Date", type: "string", flex :1, headerAlign: "center" },
    { field: "status", headerName: "Status", type: "string", flex :1, headerAlign: "center" },
    {
        field: "photo",
        headerName: "Photo",
        flex :1,
        headerAlign: "center",
        sortable: false,
        renderCell: (params) => (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                <Avatar alt={params.row.name} src={params.value} />
            </div>
        ),
    },

];

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

export default function SideBarUsers() {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');


    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const userList = useAppSelector((state) => state.auth.userList);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 5,
    });
    const [rowCount, setRowCount] = useState<number>(0);
    const [open, setOpen] = useState(false);
    const users: IUser[] = useAppSelector((state) => state.auth.userList);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(false);

    const [statusList, setStatusList] = useState<string[]>([]);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleEditClick = () => {
        if (selectedRowIds.length === 1) {
            const userToEdit = users.find(
                (user) => user.id === selectedRowIds[0]
            );
            setSelectedUser(userToEdit || null);
            handleOpen();
        } else {
            Swal.fire("Please select exactly one company to edit.");
        }
    };

    const handleUpdateUserByAdmin = async () => {
        if (selectedUser) {
            setLoading(true);
            try {
                await dispatch(fetchUpdateUserByAdmin({
                    token: token,
                    userId: selectedUser.id,
                    name: selectedUser.name,
                    surname: selectedUser.surname,
                    status: selectedUser.status,
                    phone: selectedUser.phone

                }));
                Swal.fire("Success", "User updated successfully", "success");
                // Fetch updated companies
                await dispatch(fetchGetAllUsers({
                    token: token,
                    page: paginationModel.page,
                    pageSize: paginationModel.pageSize,
                    searchText: searchText,
                }));
            } catch (error) {
                console.error("Error updating user:", error);
            } finally {
                setLoading(false);
                handleClose();
            }
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await dispatch(fetchGetAllUsers({
                    token: token,
                    page: paginationModel.page,
                    pageSize: paginationModel.pageSize,
                    searchText: searchText,
                }));

                const count = await dispatch(fetchGetUserCount({
                    token: token,
                    searchText: searchText,
                }))
                await dispatch(fetchGetStatus()).then(data => setStatusList(data.payload))


                setRowCount(count.payload)
            } catch {
                dispatch(clearToken());
            }
        };

        fetchData();
    }, [dispatch, searchText, token, paginationModel]);


    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const handlePaginationModelChange = (model: GridPaginationModel) => {
        setPaginationModel(model);
    };

    return (
        <div style={{ height: "auto", width: "inherit" }}>
            <TextField
                label="Email"
                variant="outlined"
                onChange={(event) => setSearchText(event.target.value)}
                value={searchText}
                style={{ marginBottom: "10px" }}
                inputProps={{ maxLength: 50 }}
            />
            <DataGrid
                slots={{
                    toolbar: GridToolbar,
                }}
                rows={userList}
                loading={loading}
                rowCount={rowCount}
                columns={columns}
                paginationMode="server"
                pagination
                paginationModel={paginationModel}
                onPaginationModelChange={handlePaginationModelChange}

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
                        fontSize: "12px",
                    },
                    "& .MuiDataGrid-cell": {
                        textAlign: "center",
                        fontSize: "11px",
                    },
                }}
            />
            <Grid container spacing={1} style={{ marginTop: 16 }} direction="row">
                <Grid item>
                    <Button
                        onClick={handleEditClick}
                        variant="contained"
                        color="primary"
                        disabled={loading || selectedRowIds.length !== 1}
                    >
                        {loading ? "Processing..." : "Edit"}
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
                        Edit User
                    </Typography>
                    {selectedUser && (
                        <form >
                            <TextField sx={{ marginTop: "25px" }}
                                label="Name"
                                name="name"
                                variant="outlined"
                                value={selectedUser.name}
                                onChange={e => setSelectedUser({ ...selectedUser, name: e.target.value })}
                                fullWidth
                                style={{ marginBottom: "10px" }}
                            />
                            <TextField
                                label="Surname"
                                name="surname"
                                variant="outlined"
                                value={selectedUser.surname}
                                onChange={e => setSelectedUser({ ...selectedUser, surname: e.target.value })}
                                fullWidth
                                style={{ marginBottom: "10px" }}
                            />
                            <TextField
                                label="Phone"
                                name="phone"
                                variant="outlined"
                                value={selectedUser.phone}
                                onChange={e => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                                fullWidth
                                style={{ marginBottom: "10px" }}
                            />
                            <FormControl sx={{ marginBottom: "25px" }} fullWidth>
                                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedUser.status}
                                    label="Status"
                                    onChange={e => setSelectedUser({ ...selectedUser, status: e.target.value })}
                                >
                                    {
                                        statusList.map((status) => (
                                            <MenuItem key={status} value={status}>{status}</MenuItem>
                                        ))
                                    }

                                </Select>
                            </FormControl>
                            <Button
                                onClick={handleUpdateUserByAdmin}
                                variant="contained"
                                color="primary"
                                disabled={loading}
                                fullWidth
                            >
                                {loading ? "Updating..." : "Update"}
                            </Button>
                        </form>
                    )}
                </Box>
            </Modal>


        </div>
    );
}
