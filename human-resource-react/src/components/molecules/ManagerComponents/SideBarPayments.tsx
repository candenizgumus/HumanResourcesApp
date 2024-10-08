import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel, GridToolbar,
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
import { fetchDeletePayment, fetchGetPayments, fetchPaymentSave } from "../../../store/feature/paymentSlice";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DeleteIcon, AddIcon } from "../../atoms/icons";
import { myErrorColour, myLightColour } from "../../../util/MyColours";
const columns: GridColDef[] = [
    {
        field: "payment", headerName: "Payment $", flex: 1, headerAlign: "center",
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
    { field: "description", headerName: "Description", flex: 4, headerAlign: "center" },
    { field: "paymentDate", headerName: "Payment Date", headerAlign: "center", flex: 2 },
    { field: "status", headerName: "Status", headerAlign: "center", flex: 1.5 },
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
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

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
                    confirmButtonColor: myLightColour,
                    cancelButtonColor: myErrorColour,
                    confirmButtonText: "Yes, delete it!"
                });

                if (result.isConfirmed) {
                    const data = await dispatch(fetchDeletePayment({
                        token: token,
                        id: selectedPayment.id,
                    }));

                    if (data.payload.message) {
                        await Swal.fire({
                            title: "Error!",
                            text: data.payload.message,
                            icon: "error",
                            confirmButtonText: "OK",
                            confirmButtonColor: myLightColour,
                            cancelButtonColor: myErrorColour,
                        });
                        return;
                    } else {
                        await Swal.fire({
                            title: "Deleted!",
                            text: "Your Payment has been deleted.",
                            icon: "success",
                            confirmButtonColor: myLightColour,
                            cancelButtonColor: myErrorColour,
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
        setSelectedRowIds([]);
        setLoading(false);
    };

    const handleSavePayment = async () => {
        try {

            if (description === "" || payment === 0 || paymentDate === null) {
                Swal.fire({
                    title: "Error!",
                    text: "Please fill out all required fields",
                    icon: "error",
                    confirmButtonText: "OK",
                    confirmButtonColor: myLightColour,
                    cancelButtonColor: myErrorColour,
                });
                return;
            }
            setIsActivating(true);

            const response = await dispatch(fetchPaymentSave({
                token: token,
                description: description,
                payment: payment,
                paymentDate: paymentDate
            })).then(data => {
                if (data.payload.message) {
                    Swal.fire({
                        title: "Error!",
                        text: data.payload.message,
                        icon: "error",
                        confirmButtonText: "OK",
                        confirmButtonColor: myLightColour,
                        cancelButtonColor: myErrorColour,
                    });
                    return;
                }
                Swal.fire({
                    title: "Success!",
                    text: "Payment has been added",
                    icon: "success",
                    confirmButtonText: "OK",
                    confirmButtonColor: myLightColour,
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
        <div style={{ height: "auto", width: "inherit" }}>
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
                slots={{
                    toolbar: GridToolbar,
                }}
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
                    height: '407px'
                }}
                rowSelectionModel={selectedRowIds}
            />

            <Grid container spacing={2} sx={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'stretch', marginTop: '2%', marginBottom: '2%' }}>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleDelete}
                        variant="contained"
                        color="error"
                        disabled={selectedRowIds.length === 0 || loading}
                        startIcon={<DeleteIcon />}
                        sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        Delete
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleSavePayment}
                        variant="contained"
                        color="success"
                        disabled={payment === 0 || description.length === 0 || paymentDate === null || isActivating}
                        startIcon={<AddIcon />}
                        sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        Add
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'stretch', marginTop: '2%', marginBottom: '2%' }}>
                <Grid item xs={12}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Add Payment
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6}>
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

                <Grid item xs={12} sm={6} md={6} lg={6}>
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
                <Grid item xs={12} sm={6} md={6} lg={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Payment Date"
                            value={paymentDate ? dayjs(paymentDate) : null}
                            onChange={(newValue) => setPaymentDate(newValue ? newValue.toDate() : null)}
                            sx={{ width: '100%' }}
                        />
                    </LocalizationProvider>
                </Grid>
            </Grid>
        </div>
    );
}
