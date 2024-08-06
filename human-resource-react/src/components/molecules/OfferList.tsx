import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel,
} from "@mui/x-data-grid";
import {
    Button,
    Grid,
    TextField,
    Modal,
    Box,
    Typography,
} from "@mui/material";
import { HumanResources, useAppSelector } from "../../store";
import { useDispatch } from "react-redux";
import {
    fetchApproveOffers,
    fetchGetOffers, fetchSendOfferEmail,
} from "../../store/feature/offerSlice";
import { IOfferList } from "../../models/IOfferList";
import { clearToken } from "../../store/feature/authSlice";
import Swal from "sweetalert2";

const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70, headerAlign: "center" },
    { field: "name", headerName: "First name", width: 160, headerAlign: "center" },
    { field: "surname", headerName: "Last name", width: 160, headerAlign: "center" },
    { field: "email", headerName: "Email", headerAlign: "center", width: 300 },
    { field: "phone", headerName: "Phone", description: "This column has a value getter and is not sortable.", sortable: false, headerAlign: "center", width: 160 },
    { field: "companyName", headerName: "Company Name", width: 130, headerAlign: "center" },
    { field: "title", headerName: "Title", width: 130, headerAlign: "center" },
    { field: "numberOfEmployee", headerName: "Employee Count", type: "number", width: 120, headerAlign: "center" },
    { field: "sector", headerName: "Sector", type: "string", width: 250, headerAlign: "center" },
];

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1200,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};

export default function OfferList() {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [open, setOpen] = useState(false);
    const [emailText, setEmailText] = useState("");
    const offerList: IOfferList[] = useAppSelector((state) => state.offer.offers);
    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        dispatch(
            fetchGetOffers({
                token: token,
                page: 0,
                pageSize: 50,
                email: searchText,
            })
        ).catch(() => {
            dispatch(clearToken());
        });
    }, [dispatch, searchText, token]);

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
                    title: "Abonelik Türünü Seç",
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
                    confirmButtonText: "Onayla",
                    input: "radio",
                    inputOptions: {
                        "0": "Monthly",
                        "1": "Yearly",
                    },
                    preConfirm: (value) => {
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
                    });

                    await dispatch(
                        fetchGetOffers({
                            token,
                            page: 0,
                            pageSize: 50,
                            email: searchText,
                        })
                    );
                }
            } catch (error) {
                localStorage.removeItem("token");
                dispatch(clearToken());
            }
        }

        setLoading(false);
    };

    const handleSendEmail = async () => {
        for (let id of selectedRowIds) {
            const selectedOffer = offerList.find((offer) => offer.id === id);
            if (!selectedOffer) continue;

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
                        text: "Email has been sent to: " + selectedOffer.email ,
                        icon: "success",
                        confirmButtonText: "OK",
                    });
                } else {
                    Swal.fire({
                        title: "Error",
                        text: "Email has not been sent",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                }
            })
        }
        handleClose();
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
                rows={offerList}
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
            <Grid container spacing={2} style={{ marginTop: 16 }}>
                <Grid item xs={12}>
                    <Button
                        onClick={handleConfirmSelection}
                        variant="contained"
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Approve Offers"}
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="secondary" onClick={handleOpen}>
                        Send Email
                    </Button>
                </Grid>
            </Grid>
            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2">
                        Send Email to
                    </Typography>
                    <TextField
                        label="Please type your offer"
                        multiline
                        rows={14}
                        variant="outlined"
                        fullWidth
                        value={emailText}
                        onChange={(e) => setEmailText(e.target.value)}
                        style={{ marginTop: "16px" }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSendEmail}
                        style={{ marginTop: "16px" }}
                    >
                        Send
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}
