import React, {useEffect, useState} from "react";
import {
    DataGrid,
    GridColDef,
    GridPaginationModel,
    GridRowSelectionModel, GridToolbar,
} from "@mui/x-data-grid";
import {
    Avatar,
    Box, Button, FormControl, Grid, InputLabel, MenuItem, Modal, Select,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField, Typography

} from "@mui/material";
import {HumanResources, useAppSelector} from "../../../store";
import {useDispatch} from "react-redux";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import {
    clearToken, fetchAddSubscriptionTime,
    fetchGetAllUsers,
    fetchGetStatus,
    fetchGetUserCount,
    fetchUpdateUserByAdmin
} from "../../../store/feature/authSlice";
import Swal from "sweetalert2";
import {IUser} from "../../../models/IUser";
import CircularProgress from '@mui/material/CircularProgress';
import {ICompany} from "../../../models/ICompany";
import {fetchGetCompanies} from "../../../store/feature/companySlice";
import {TimeIcon} from "@mui/x-date-pickers";
import {myErrorColour, myLightColour} from "../../../util/MyColours";
import {fetchApproveOffers, fetchGetOfferCount, fetchGetOffers} from "../../../store/feature/offerSlice";


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
    const [companyList, setCompanyList] = useState<ICompany[]>([]);
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
            Swal.fire({
                icon: 'error',
                text: 'Please select exactly one company to edit.',
                showConfirmButton: false,
                timer: 1500
            });
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
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'User updated successfully.',
                    showConfirmButton: false,
                    timer: 1500
                });
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

    const handleAddSubscriptionTime = async () => {

        const result = await Swal.fire({
            title: "Choose Subscription Type",
            showCancelButton: true,
            confirmButtonText: "Confirm",
            input: "radio",
            confirmButtonColor: myLightColour,
            cancelButtonColor: myErrorColour,
            inputOptions: {
                "0": "Monthly",
                "1": "Yearly",
            },
            preConfirm: (value) => {
                if (!value) {
                    Swal.showValidationMessage("You need to select something!");
                    return
                }
                return value === "0" ? "Monthly" : "Yearly";
            },

        });

        if (result.isConfirmed) {

            await dispatch(
                fetchAddSubscriptionTime({token,managerId: selectedRowIds[0], subscriptionType: result.value})
            );


            await Swal.fire({
                title: "Success",
                text: "Subscription time added successfully",
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: myLightColour,
                cancelButtonColor: myErrorColour,
            });

            await dispatch(fetchGetAllUsers({
                token: token,
                page: paginationModel.page,
                pageSize: paginationModel.pageSize,
                searchText: searchText,
            }));

        }
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await dispatch(fetchGetAllUsers({
                    token: token,
                    page: paginationModel.page,
                    pageSize: paginationModel.pageSize,
                    searchText: searchText,
                }));
                await dispatch(fetchGetCompanies({
                    token: token,
                    page: 0,
                    pageSize: 100000,
                    searchText: ''
                })).then(data => setCompanyList(data.payload))

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


    const columns: GridColDef[] = [
        {
            field: "companyId", headerName: "Company Name", flex: 1, headerAlign: "center",

            renderCell: (params) => (
                <>
                    {companyList.find((company) => company.id === params.value)?.name}
                </>

            ),
        },
        {field: "name", headerName: "First name", flex: 1, headerAlign: "center"},
        {field: "surname", headerName: "Last name", flex: 1, headerAlign: "center"},
        {field: "email", headerName: "Email", headerAlign: "center", flex: 2},
        {field: "phone", headerName: "Phone", sortable: false, headerAlign: "center", flex: 1},
        {field: "sector", headerName: "Sector", type: "string", flex: 2, headerAlign: "center"},
        {field: "userType", headerName: "User Type", flex: 1, headerAlign: "center"},
        {field: "subscriptionType", headerName: "Sub. Type", flex: 1, headerAlign: "center"},
        {
            field: "subscriptionStartDate",
            headerName: "Sub. Start Date",
            type: "string",
            flex: 1,
            headerAlign: "center"
        },
        {field: "subscriptionEndDate", headerName: "Sub. End Date", type: "string", flex: 1, headerAlign: "center"},
        {field: "status", headerName: "Status", type: "string", flex: 1, headerAlign: "center"},
        {
            field: "photo",
            headerName: "Photo",
            flex: 1,
            headerAlign: "center",
            sortable: false,
            renderCell: (params) => (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%'
                }}>
                    <Avatar alt={params.row.name} src={params.value}/>
                </div>
            ),
        },

    ];
    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const handlePaginationModelChange = (model: GridPaginationModel) => {
        setPaginationModel(model);
    };

    return (
        <div style={{height: 'auto', width: "inherit"}}>
            <TextField
                label="Search By Email"
                variant="outlined"
                onChange={(event) => setSearchText(event.target.value)}
                value={searchText}
                style={{marginBottom: "1%", marginTop: "1%"}}
                inputProps={{maxLength: 50}}
                fullWidth
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
                    onClick={handleEditClick}
                    variant="contained"
                    color="secondary"
                    startIcon={<DriveFileRenameOutlineIcon/>}
                    disabled={loading || selectedRowIds.length !== 1}
                    sx={{marginRight: '1%', width: '200px'}}
                >
                    Edit
                </Button>
                <Button
                    onClick={handleAddSubscriptionTime}
                    variant="contained"
                    color="secondary"
                    startIcon={<TimeIcon/>}
                    disabled={loading || selectedRowIds.length !== 1 || userList.find((user) => user.id === selectedRowIds[0])?.userType !== 'MANAGER'}
                    sx={{marginRight: '1%'}}
                >
                    Add Subscription Time
                </Button>
            </Grid>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    <Box mt={2}>
                        {selectedUser && (
                            <>
                                <Grid item mt={2}>
                                    <TextField sx={{marginTop: "25px"}}
                                               label="Name"
                                               name="name"
                                               variant="outlined"
                                               value={selectedUser.name}
                                               onChange={e => setSelectedUser({
                                                   ...selectedUser,
                                                   name: e.target.value
                                               })}
                                               fullWidth
                                               style={{marginBottom: "10px"}}
                                    />
                                    <TextField
                                        label="Surname"
                                        name="surname"
                                        variant="outlined"
                                        value={selectedUser.surname}
                                        onChange={e => setSelectedUser({...selectedUser, surname: e.target.value})}
                                        fullWidth
                                        style={{marginBottom: "10px"}}
                                    />
                                    <TextField
                                        label="Phone"
                                        name="phone"
                                        variant="outlined"
                                        value={selectedUser.phone}
                                        onChange={e => setSelectedUser({...selectedUser, phone: e.target.value})}
                                        fullWidth
                                        style={{marginBottom: "10px"}}
                                    />
                                    <FormControl sx={{marginBottom: "25px"}} fullWidth>
                                        <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={selectedUser.status}
                                            label="Status"
                                            onChange={e => setSelectedUser({
                                                ...selectedUser,
                                                status: e.target.value
                                            })}
                                        >
                                            {
                                                statusList.map((status) => (
                                                    <MenuItem key={status} value={status}>{status}</MenuItem>
                                                ))
                                            }

                                        </Select>
                                    </FormControl>
                                </Grid>
                            </>
                        )}
                    </Box>
                    {loading && (
                        <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                            <CircularProgress/>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleClose} color="error"
                            sx={{marginRight: '17px', width: '100px'}}>
                        Cancel
                    </Button>
                    <Button variant="contained" disabled={loading} onClick={handleUpdateUserByAdmin} color="success"
                            sx={{marginRight: '17px', width: '100px'}}>
                        Update
                    </Button>
                </DialogActions>
            </Dialog>


        </div>
    );
}
