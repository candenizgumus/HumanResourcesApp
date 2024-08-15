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
import { HumanResources, useAppSelector } from "../../../store";
import { useDispatch } from "react-redux";
import {
    changePageState,
    clearToken,
     setSelectedEmployeeId
} from "../../../store/feature/authSlice";
import Swal from "sweetalert2";
import {
    fetchDeleteExpenditure,
    fetchGetExpendituresOfEmployee,
    fetchCancelExpenditure // Import the cancel action
} from "../../../store/feature/expenditureSlice";
import {fetchDeletePayment, fetchGetPayments, fetchPaymentSave} from "../../../store/feature/paymentSlice";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";

const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70, headerAlign: "center" },
    {
        field: "payment", headerName: "Payment $", width: 150, headerAlign: "center",
        renderCell: (params) => {
            const value = params.value;
            if (typeof value === 'number' && !isNaN(value)) {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(value);
            }
            return '$0.00';
        },
    },
    { field: "description", headerName: "Description", width: 600, headerAlign: "center" },
    { field: "paymentDate", headerName: "Payment Date", headerAlign: "center", width: 180 },
    { field: "status", headerName: "Status", headerAlign: "center", width: 150 },
];

export default function SideBarPayments() {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');
    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const paymentList = useAppSelector((state) => state.payment.paymentList);
    const [loading, setLoading] = useState(false);
    const [isActivating, setIsActivating] = useState(false);
    const [payment, setPayment] = useState(0);
    const [description, setDescription] = useState('');
    const [paymentDate, setPaymentDate] = useState<Date | null>(null);

    useEffect(() => {
        dispatch(
            fetchGetPayments({
                token: token,
                page: 0,
                pageSize: 100,
                searchText: searchText,
            })
        ).catch(() => {
            dispatch(clearToken());
        });
    }, [dispatch, searchText, token, loading, isActivating]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const handleOnClickEditEmployee = () => {
        dispatch(setSelectedEmployeeId(selectedRowIds[0]));
        dispatch(changePageState("Edit Employee"));
    };

    const handleDelete = async () => {
        for (let id of selectedRowIds) {
            const selectedPayment = paymentList.find(
                (selectedPayment) => selectedPayment.id === id
            );
            if (!selectedPayment) continue;

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
                    const data = await dispatch(fetchDeletePayment({
                        token: token,
                        id: selectedPayment.id,
                    }));

                    if (data.payload.message) {
                        await Swal.fire({
                            title: "Error",
                            text: data.payload.message,
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                        return;
                    } else {
                        await Swal.fire({
                            title: "Deleted!",
                            text: "Your Payment has been deleted.",
                            icon: "success"
                        });

                        await dispatch(fetchGetPayments({
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
            }
        }
        setLoading(false);
    };

    const handleSavePayment = async () => {
        try {

            if (description === "" || payment === 0 || paymentDate === null) {
                Swal.fire({
                    title: "Error",
                    text: "Please fill out all required fields",
                    icon: "error",
                    confirmButtonText: "OK",
                });
                return;
            }
            setIsActivating(true);

            const response = await dispatch(fetchPaymentSave({
                token: token,
                description: description,
                payment: payment,
                paymentDate:paymentDate
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
                Swal.fire({
                    title: "Success",
                    text: "Payment has been added",
                    icon: "success",
                    confirmButtonText: "OK",
                });

                fetchGetPayments({
                    token: token,
                    page: 0,
                    pageSize: 100,
                    searchText: searchText,
                });
            });
        } catch (error) {
            localStorage.removeItem("token");
            dispatch(clearToken());
        }

        setIsActivating(false);
    };

    return (
        <div style={{ height: 400, width: "inherit" }}>
            <TextField
                label="Description"
                variant="outlined"
                onChange={(event) => setSearchText(event.target.value)}
                value={searchText}
                style={{ marginBottom: "10px" }}
            />
            <DataGrid
                rows={paymentList}
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
                        onClick={handleDelete}
                        variant="contained"
                        color="error"
                        disabled={ selectedRowIds.length === 0 || loading}
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </Button>
                </Grid>
            </Grid>

            <Grid container spacing={2} style={{ marginTop: 16 }} direction="row">
                <Grid item xs={12}>
                    <Typography sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                        Add Payment
                    </Typography>
                </Grid>

                <Grid item xs={4}>
                    <TextField
                        label="Description"
                        name="description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        fullWidth
                        required
                        inputProps={{ maxLength: 50 }}
                    />
                </Grid>

                <Grid item xs={4}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="outlined-adornment-amount">Payment Amount</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-amount"
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            label="Payment"
                            value={payment}
                            onChange={e => {
                                const value = e.target.value;
                                setPayment(value ? parseInt(value) : 0);
                            }}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Payment Date"
                            value={paymentDate ? dayjs(paymentDate) : null}

                            onChange={(newValue) => setPaymentDate(newValue ? newValue.toDate() : null)}

                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={4}>
                    <Button
                        onClick={handleSavePayment}
                        variant="contained"
                        color="primary"
                        disabled={payment === 0 || description.length === 0 || paymentDate === null || isActivating}
                    >
                        {isActivating  ? "Saving..." : "Save Payment"}
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
}
