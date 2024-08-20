import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridPaginationModel,
    GridRowSelectionModel, GridToolbar,
} from "@mui/x-data-grid";
import {
    Button,
    Grid,
    TextField,
    Modal,
    Box,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Backdrop,
} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { HumanResources, useAppSelector } from "../../../store";
import { useDispatch } from "react-redux";
import {
    fetchApproveOffers, fetchDeclineOffers,
    fetchGetOfferCount,
    fetchGetOffers, fetchSendOfferEmail,
} from "../../../store/feature/offerSlice";
import { IOfferList } from "../../../models/IOfferList";
import { clearToken } from "../../../store/feature/authSlice";
import Swal from "sweetalert2";
import * as Icons from '../../atoms/icons';
import {myErrorColour, myLightColour} from "../../../util/MyColours";

const columns: GridColDef[] = [
    { field: "name", headerName: "First name", flex: 1.6, headerAlign: "center" },
    { field: "surname", headerName: "Last name", flex: 1.6, headerAlign: "center" },
    { field: "email", headerName: "Email", flex: 2.0, headerAlign: "center" },
    { field: "phone", headerName: "Phone", type: "number", sortable: false, flex: 1.6, headerAlign: "center" },
    { field: "companyName", headerName: "Company Name", flex: 1.3, headerAlign: "center" },
    { field: "title", headerName: "Title", flex: 1.6, headerAlign: "center" },
    { field: "numberOfEmployee", headerName: "Employee Count", type: "number", flex: 1.2, headerAlign: "center" },
    { field: "sector", headerName: "Sector", type: "string", flex: 2.5, headerAlign: "center" },
    { field: "status", headerName: "Status", type: "string", flex: 1.5, headerAlign: "center" },
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

export default function SideBarOffers() {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [currentModalIndex, setCurrentModalIndex] = useState<number | null>(null);
    const [emailText, setEmailText] = useState<string>("");
    const offerList: IOfferList[] = useAppSelector((state) => state.offer.offers);
    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const [isSendTrue, setIsSendTrue] = useState(false);
    const [isSendFalse, setIsSendFalse] = useState(false);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 5,
    });
    const [open, setOpen] = useState(false);
    const [rowCount, setRowCount] = useState<number>(0);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await dispatch(fetchGetOffers({
                    token: token,
                    page: paginationModel.page,
                    pageSize: paginationModel.pageSize,
                    searchText: searchText,
                }));
                const count = await dispatch(fetchGetOfferCount({
                    token: token,
                    searchText: searchText,
                }))
                setRowCount(count.payload);
            } catch {
                dispatch(clearToken());
            }
        };

        fetchData();
    }, [dispatch, searchText, token, paginationModel, rowCount]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const handleConfirmSelection = async () => {
        setLoading(true);

        for (let id of selectedRowIds) {
            const selectedOffer = offerList.find((offer) => offer.id === id);
            if (!selectedOffer) continue;

            try {
                const result = await Swal.fire({
                    title: "Choose Subscription Type",
                    html: `
            <div>
              <p><strong>Name:</strong> ${selectedOffer.name}</p>
              <p><strong>Surname:</strong> ${selectedOffer.surname}</p>
              <p><strong>Email:</strong> ${selectedOffer.email}</p>
              <p><strong>Phone:</strong> ${selectedOffer.phone}</p>
              <p><strong>Company Name:</strong> ${selectedOffer.companyName}</p>
              <p><strong>Title:</strong> ${selectedOffer.title}</p>
              <p><strong>Employee Count:</strong> ${selectedOffer.numberOfEmployee}</p>
              <p><strong>Sector:</strong> ${selectedOffer.sector}</p>
            </div>
          `     ,
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
                        return value === "0" ? "MONTHLY" : "YEARLY";
                    },

                });

                if (result.isConfirmed) {
                    const ESubscriptionType = result.value as string;

                    await dispatch(
                        fetchApproveOffers({ token, offerId: id, ESubscriptionType })
                    );

                    await Swal.fire({
                        title: "Success",
                        text: "Offer has been approved",
                        icon: "success",
                        confirmButtonText: "OK",
                        confirmButtonColor: myLightColour,
                        cancelButtonColor: myErrorColour,
                    });

                    await dispatch(
                        fetchGetOffers({
                            token: token,
                            page: paginationModel.page,
                            pageSize: paginationModel.pageSize,
                            searchText: searchText,
                        })
                    );

                    const count = await dispatch(fetchGetOfferCount({
                        token: token,
                        searchText: searchText,
                    }))
                    setRowCount(count.payload);
                }
            } catch (error) {
                localStorage.removeItem("token");
                dispatch(clearToken());
            }
        }

        setLoading(false);
    };

    const handleDeclineOffers = async () => {
        setIsSendFalse(true);

        for (let id of selectedRowIds) {
            const selectedOffer = offerList.find((offer) => offer.id === id);
            if (!selectedOffer) continue;

            try {
                const result = await Swal.fire({
                    title: "Confirm Decline",
                    html: `
            <div>
              <p><strong>Name:</strong> ${selectedOffer.name}</p>
              <p><strong>Surname:</strong> ${selectedOffer.surname}</p>
              <p><strong>Email:</strong> ${selectedOffer.email}</p>
              <p><strong>Phone:</strong> ${selectedOffer.phone}</p>
              <p><strong>Company Name:</strong> ${selectedOffer.companyName}</p>
              <p><strong>Title:</strong> ${selectedOffer.title}</p>
              <p><strong>Employee Count:</strong> ${selectedOffer.numberOfEmployee}</p>
              <p><strong>Sector:</strong> ${selectedOffer.sector}</p>
            </div>
          `,
                    showCancelButton: true,
                    confirmButtonText: "Confirm",
                    input: "radio",
                    confirmButtonColor: myLightColour,
                    cancelButtonColor: myErrorColour,
                });

                if (result.isConfirmed) {


                    await dispatch(
                        fetchDeclineOffers({ token, offerId: id })
                    );

                    await Swal.fire({
                        title: "Success",
                        text: "Offer has been declined",
                        icon: "success",
                        confirmButtonText: "OK",
                        confirmButtonColor: myLightColour,
                        cancelButtonColor: myErrorColour,
                    });
                    await dispatch(
                        fetchGetOffers({
                            token: token,
                            page: paginationModel.page,
                            pageSize: paginationModel.pageSize,
                            searchText: searchText,
                        })
                    );
                    const count = await dispatch(fetchGetOfferCount({
                        token: token,
                        searchText: searchText,
                    }))
                    setRowCount(count.payload);
                }
            } catch (error) {
                localStorage.removeItem("token");
                dispatch(clearToken());
            }
        }

        setIsSendFalse(false);
    };

    const handleSendEmail = async (id: number) => {
        const selectedOffer = offerList.find((offer) => offer.id === id);
        if (!selectedOffer) return;
        setIsSendTrue(true)

        await dispatch(
            fetchSendOfferEmail({
                token: token,
                offerEmail: selectedOffer.email,
                emailText: emailText,
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
                    dispatch(fetchGetOffers({
                        token: token,
                        page: paginationModel.page,
                        pageSize: paginationModel.pageSize,
                        searchText: searchText,
                    }));
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
        handleClose();
        setCurrentModalIndex((prevIndex) => (prevIndex !== null && prevIndex + 1 < selectedRowIds.length ? prevIndex + 1 : null));
        setIsSendTrue(false)
    };


    const handlePaginationModelChange = (model: GridPaginationModel) => {
        setPaginationModel(model);
    };

    const handleOpen = () => {
        setCurrentModalIndex(0);
        setOpen(true);
    };
    const handleClose = () => {
        setEmailText('');
        setCurrentModalIndex(null)
        setOpen(false);
    };
    return (
        <div style={{ height: 'auto', width: "inherit" }}>
            <TextField
                label="Search By Email"
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
                rows={offerList}
                rowCount={rowCount}
                columns={columns}
                paginationMode="server"
                pagination
                paginationModel={paginationModel}
                onPaginationModelChange={handlePaginationModelChange}
                pageSizeOptions={[5, 10]}
                loading={loading}
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
                        fontsize: "8px",
                    },
                    height: '407px'
                }}
            />
            <Grid sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: '2%', marginBottom: '2%' }}>
                <Button
                    onClick={handleConfirmSelection}
                    variant="contained"
                    color="success"
                    disabled={loading || selectedRowIds.length === 0}
                    sx={{ marginRight: '1%', width: '200px' }}
                    startIcon={<Icons.ApproveIcon />}
                >
                    Approve
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeclineOffers}
                    disabled={selectedRowIds.length === 0 || isSendFalse}
                    sx={{ marginRight: '1%', width: '200px' }}
                    startIcon={<Icons.DeclineIcon />}
                >
                    Decline
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleOpen}
                    disabled={selectedRowIds.length === 0 || selectedRowIds.length > 1}
                    sx={{ marginRight: '1%', width: '200px' }}
                    startIcon={<Icons.EmailIcon />}
                >
                    Contact
                </Button>
            </Grid>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
                {currentModalIndex !== null && (
                    <>
                        <DialogTitle>Send Mail to {offerList.find((offer) => offer.id === selectedRowIds[currentModalIndex])?.email}</DialogTitle>
                        <DialogContent>
                            <Box mt={2}>
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
                            <Button variant="contained" disabled={!emailText || isSendTrue} onClick={() => handleSendEmail(selectedRowIds[currentModalIndex])} color="success" sx={{ marginRight: '17px', width: '100px' }}>
                                Send
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </div>
    );
}