import { useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel,
    GridToolbar,
} from "@mui/x-data-grid";
import {
    Button,
    Grid,
    TextField,
    Modal,
    Box,
    Typography,
    Backdrop,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Avatar,
} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import Loader from "../../atoms/loader/Loader";
import {EmailIcon} from '../../atoms/icons';
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { HumanResources, useAppSelector } from "../../../store";
import { changePageState, clearToken } from "../../../store/feature/authSlice";
import { fetchGetUpcomingMembershipExpiries } from "../../../store/feature/companySlice";
import { fetchSendEmail } from "../../../store/feature/emailSlice";
import { myErrorColour, myLightColour } from "../../../util/MyColours";

const columns: GridColDef[] = [
    { field: "name", headerName: "Company Name", flex: 1, headerAlign: "center" },
    {
        field: "logo",
        headerName: "Logo",
        flex: 1,
        headerAlign: "center",
        sortable: false,
        renderCell: (params) => (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                }}
            >
                <Avatar
                    alt={params.row.name}
                    src={params.value}
                    style={{
                        width: 40,
                        height: 40,
                    }}
                    imgProps={{
                        style: {
                            objectFit: 'contain', // Ensures the image fits within the Avatar
                        },
                    }}
                />
            </div>
        ),
    },
    { field: "numberOfEmployee", headerName: "Employee Count", headerAlign: "center", flex: 1 },
    { field: "contactEmail", headerName: "Contact", flex: 1, headerAlign: "center" },
    { field: "subscriptionType", headerName: "Subscription Type", headerAlign: "center", flex: 1 },
    { field: "subscriptionStartDate", headerName: "Subscription Start Date", headerAlign: "center", flex: 1 },
    { field: "subscriptionEndDate", headerName: "Subscription End Date", headerAlign: "center", flex: 1 },
    { field: "status", headerName: "Status", headerAlign: "center", flex: 1 },
];

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
    fontSize: 20,
    p: 4,
};

export default function NotificationsPage() {
    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const upcomingExpiries = useAppSelector((state) => state.company.upcomingExpiries);
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [emailText, setEmailText] = useState<string>("");
    const [isSendTrue, setIsSendTrue] = useState(false);
    const [isSendFalse, setIsSendFalse] = useState(false);

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(fetchGetUpcomingMembershipExpiries(token));
            } catch {
                dispatch(clearToken());
            }
        };
        fetchData();
    }, [dispatch, token]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const handleSendEmail = async () => {
        const selectedCompany = upcomingExpiries.find((company) => company.id === selectedRowIds[0]);
        if (!selectedCompany) return;
        setIsSendTrue(true)

        await dispatch(
            fetchSendEmail({
                token: token,
                to: "hcaslan7@gmail.com", // TODO company.contactEmail
                message: emailText,
                subject: "Upcoming Membership Expiry"
            })
        ).then(data => {
            if (data.payload === true) {
                Swal.fire({
                    title: "Success",
                    text: "Email has been sent",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    dispatch(fetchGetUpcomingMembershipExpiries(token));
                })
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Email has not been sent",
                    icon: "error",
                    confirmButtonText: "OK",
                    confirmButtonColor: myLightColour,
                    cancelButtonColor: myErrorColour,
                });
            }
        });
        setIsSendTrue(false);
        handleClose();
    };


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div style={{ height: 'auto', width: "inherit" }}>
            <DataGrid
                paginationMode="server"
                rows={upcomingExpiries}
                columns={columns}
                checkboxSelection
                onRowSelectionModelChange={handleRowSelection}
                slots={{
                    toolbar: GridToolbar,
                }}
                getRowClassName={(params) =>
                    params.row.isRead === false ? 'MuiDataGrid-row--highlighted' : ''
                }
                sx={{
                    "& .MuiDataGrid-columnHeaderTitle": {
                        textAlign: "center",
                        fontWeight: "bold",
                    },
                    "& .MuiDataGrid-cell": {
                        textAlign: "center",
                    },
                    "& .MuiDataGrid-row--highlighted": {
                        backgroundColor: "#C8E6C9", // Pale green Highlight for unread notifications
                    },
                    // Hide footer elements
                    "& .MuiDataGrid-footerContainer .MuiTablePagination-displayedRows": {
                        display: "none",
                    },
                    "& .MuiTablePagination-input": {
                        display: "none",
                    },
                    "& .MuiTablePagination-actions": {
                        display: "none",
                    },
                    "& .MuiToolbar-regular": {
                        display: "none"
                    },
                    marginTop: '2%',
                    height: '407px'
                }}
            />
            <Grid sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: '2%', marginBottom: '2%' }}>
                <Button
                    onClick={handleOpen}
                    variant="contained"
                    color="secondary"
                    disabled={selectedRowIds.length === 0 || selectedRowIds.length > 1}
                    startIcon={<EmailIcon />}
                    sx={{ marginRight: '1%', width: '200px' }}
                >
                    Contact
                </Button>
            </Grid>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
                <DialogTitle>Send Mail to {upcomingExpiries.find((company) => company.id === selectedRowIds[0])?.contactEmail}</DialogTitle>
                <DialogContent>
                    <Box mt={2}>
                        {setSelectedRowIds.length !== 0 && (
                            <>
                                <Grid item mt={2}>
                                    <TextField
                                        label="Please type your offer"
                                        multiline
                                        rows={14}
                                        variant="outlined"
                                        fullWidth
                                        required
                                        value={emailText}
                                        onChange={(e) => setEmailText(e.target.value)}
                                        style={{ marginTop: "16px" }}
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
                    <Button variant="contained" disabled={isSendTrue} onClick={handleClose} color="error" sx={{ marginRight: '17px', width: '100px' }}>
                        Cancel
                    </Button>
                    <Button variant="contained" disabled={!emailText || isSendTrue} onClick={handleSendEmail} color="success" sx={{ marginRight: '17px', width: '100px' }}>
                        Send
                    </Button>
                </DialogActions>
            </Dialog>



            <Backdrop open={loading}>
                <Loader />
            </Backdrop>
        </div>
    );
}
