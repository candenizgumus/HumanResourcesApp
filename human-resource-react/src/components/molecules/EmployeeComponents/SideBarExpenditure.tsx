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

    clearToken,
    fetchGetAllUsersOfManager
} from "../../../store/feature/authSlice";
import Swal from "sweetalert2";
import {
    fetchDeleteExpenditure,
    fetchExpenditureSave,
    fetchGetExpendituresOfEmployee,
    fetchCancelExpenditure, // Import the cancel action

} from "../../../store/feature/expenditureSlice";
import MyDropzone from "../../atoms/DropZone";
import DownloadButtonFromS3 from "../../atoms/DownloadButtonFromS3";
import { DeleteIcon, CancelIcon, AddIcon } from "../../atoms/icons";
import { myErrorColour, myLightColour } from "../../../util/MyColours";

const columns: GridColDef[] = [

    {
        field: "price", headerName: "Price $", flex: 1, headerAlign: "center",
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
    { field: "description", headerName: "Description", flex: 3, headerAlign: "center" },
    { field: "isExpenditureApproved", headerName: "Approval Status", headerAlign: "center", flex: 1 },
    { field: "approveDate", headerName: "Approval Date", headerAlign: "center", flex: 1 },
    { field: "status", headerName: "Status", headerAlign: "center", flex: 1 },
    {
        field: "attachedFile", headerName: "Document", headerAlign: "center", flex: 1,
        renderCell: (params) => (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                {params.value && <DownloadButtonFromS3 fileKey={params.value} />}
            </div>
        ),
    }
];


export default function SideBarExpenditure() {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');
    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const expenditureList = useAppSelector((state) => state.expenditure.expenditureList);
    const [loading, setLoading] = useState(false);
    const [isActivating, setIsActivating] = useState(false);
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState<File[]>([]);

    useEffect(() => {
        dispatch(
            fetchGetExpendituresOfEmployee({
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

    const handleDelete = async () => {
        for (let id of selectedRowIds) {
            const selectedExpenditure = expenditureList.find(
                (selectedExpenditure) => selectedExpenditure.id === id
            );
            if (!selectedExpenditure) continue;

            if (selectedExpenditure.isExpenditureApproved) {
                await Swal.fire({
                    title: "Error!",
                    text: 'Expenditure already approved',
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
                    const data = await dispatch(fetchDeleteExpenditure({
                        token: token,
                        id: selectedExpenditure.id,
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
                            text: "Your expenditure has been deleted.",
                            icon: "success",
                            confirmButtonColor: myLightColour,
                            cancelButtonColor: myErrorColour,
                        });

                        await dispatch(fetchGetExpendituresOfEmployee({
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

    const handleCancel = async () => {
        for (let id of selectedRowIds) {
            const selectedExpenditure = expenditureList.find(
                (selectedExpenditure) => selectedExpenditure.id === id
            );
            if (!selectedExpenditure) continue;

            if (!selectedExpenditure.isExpenditureApproved) {
                await Swal.fire({
                    title: "Error!",
                    text: 'Expenditure not yet approved, cannot cancel.',
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
                    confirmButtonText: "Yes, cancel it!"
                });

                if (result.isConfirmed) {
                    const data = await dispatch(fetchCancelExpenditure({
                        token: token,
                        id: selectedExpenditure.id,
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
                            title: "Cancelled!",
                            text: "Your expenditure has been cancelled.",
                            icon: "success",
                            confirmButtonColor: myLightColour,
                            cancelButtonColor: myErrorColour,
                        });

                        await dispatch(fetchGetExpendituresOfEmployee({
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

    const handleSaveExpense = async () => {
        setIsActivating(true);

        try {

            const formData = new FormData();
            formData.append('description', description);
            formData.append('price', price.toString());

            files.forEach(file => {
                formData.append('files', file);
            });

            await dispatch(fetchExpenditureSave({
                token: token,
                description: description,
                price: price,
                files: files
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
                    text: "Expense has been added",
                    icon: "success",
                    confirmButtonText: "OK",
                    confirmButtonColor: myLightColour,
                    cancelButtonColor: myErrorColour,
                });

                fetchGetAllUsersOfManager({
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
                rows={expenditureList}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 1, pageSize: 5 },
                    },
                }}
                getRowClassName={(params) =>
                    params.row.isExpenditureApproved
                        ? "approved-row"
                        : "unapproved-row"
                }
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
                    disabled={isActivating || selectedRowIds.length === 0}
                    startIcon={<DeleteIcon />}
                    sx={{ marginRight: '1%', width: '200px' }}
                >
                    Delete
                </Button>

                <Button
                    onClick={handleCancel}
                    variant="contained"
                    color="warning"
                    disabled={isActivating || selectedRowIds.length === 0}
                    startIcon={<CancelIcon />}
                    sx={{ marginRight: '1%', width: '200px' }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSaveExpense}
                    variant="contained"
                    color="success"
                    disabled={price === 0 || description.length === 0 || isActivating}
                    startIcon={<AddIcon />}
                    sx={{ marginRight: '1%', width: '200px' }}
                >
                    Add
                </Button>
            </Grid>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Add Expenditure
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
                            inputProps={{ maxLength: 50 }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth >
                            <InputLabel htmlFor="outlined-adornment-amount">Expense</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                label="Expense"
                                value={price}
                                onChange={e => {
                                    const value = e.target.value;
                                    setPrice(value ? parseInt(value) : 0);
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} style={{ width: 399, height: 72 }}>
                        <MyDropzone
                            onFilesAdded={handleFilesAdded}
                            onFileRemoved={handleFileRemoved}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}
