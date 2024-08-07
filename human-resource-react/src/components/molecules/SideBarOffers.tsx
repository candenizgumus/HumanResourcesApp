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
    fetchApproveOffers, fetchDeclineOffers,
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
    width: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
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
 
    useEffect(() => {
        dispatch(
            fetchGetOffers({
                token: token,
                page: 0,
                pageSize: 50,
                searchText: searchText,
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
                            searchText: searchText,
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
                });

                if (result.isConfirmed) {


                    await dispatch(
                        fetchDeclineOffers({ token, offerId: id })
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
                            searchText: searchText,
                        })
                    );
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
                    timer: 1500
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Email has not been sent",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        });

        setCurrentModalIndex((prevIndex) => (prevIndex !== null && prevIndex + 1 < selectedRowIds.length ? prevIndex + 1 : null));
        setIsSendTrue(false)
    };

    const handleOpenEmailModals = () => {
        setCurrentModalIndex(0); // Start from the first selected offer
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
                        paginationModel: { page: 0, pageSize: 5 },
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
                        onClick={handleConfirmSelection}
                        variant="contained"
                        color="primary"
                        disabled={loading || selectedRowIds.length === 0}
                    >
                        {loading ? "Processing..." : "Approve Offers"}
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeclineOffers}
                        disabled={selectedRowIds.length === 0 || isSendFalse}
                    >
                        Decline Offer
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleOpenEmailModals}
                        disabled={selectedRowIds.length === 0 || selectedRowIds.length >1}
                    >
                        Send Email
                    </Button>
                </Grid>
            </Grid>
            {currentModalIndex !== null && (
                <Modal
                    open={true}
                    onClose={() => setCurrentModalIndex(null)}
                >
                    <Box sx={style}>
                        <Typography variant="h6" component="h2">
                            E-Mail Text for {offerList.find((offer) => offer.id === selectedRowIds[currentModalIndex])?.email}
                        </Typography>
                        <TextField
                            label="Please type your offer"
                            multiline
                            rows={14}
                            variant="outlined"
                            fullWidth
                            required
                            value = {emailText}
                            onChange={(e) => setEmailText(e.target.value)}
                            style={{ marginTop: "16px" }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            disabled = {isSendTrue || emailText === ''}
                            onClick={() => handleSendEmail(selectedRowIds[currentModalIndex])}
                            style={{ marginTop: "16px" }}
                        >
                            {isSendTrue ? "Processing..." : "Send"}
                        </Button>
                    </Box>
                </Modal>
            )}
        </div>
    );
}
