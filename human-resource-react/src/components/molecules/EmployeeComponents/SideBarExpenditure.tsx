import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel,
} from "@mui/x-data-grid";
import {
    Avatar,
    Button, FormControl,
    Grid, IconButton, InputAdornment, InputLabel, OutlinedInput,
    TextField, Typography
} from "@mui/material";
import { HumanResources, useAppSelector } from "../../../store";
import { useDispatch } from "react-redux";
import {
    changePageState,
    clearToken,
    fetchGetAllUsersOfManager, setSelectedEmployeeId
} from "../../../store/feature/authSlice";
import Swal from "sweetalert2";
import {
    fetchDeleteExpenditure,
    fetchExpenditureSave,
    fetchGetExpendituresOfEmployee,
    fetchCancelExpenditure, // Import the cancel action
    fetchDownloadExpenditureFile
} from "../../../store/feature/expenditureSlice";
import MyDropzone from "../../atoms/DropZone";
import { FileDownload, FileDownloadDoneRounded, FileDownloadOffRounded } from "@mui/icons-material";
import FilePreviewModal from "../../atoms/FilePreviewModal";
import DownloadButtonFromS3 from "../../atoms/DownloadButtonFromS3";

const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70, headerAlign: "center" },
    {
        field: "price", headerName: "Price $", width: 150, headerAlign: "center",
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
    { field: "description", headerName: "Description", width: 120, headerAlign: "center" },
    { field: "isExpenditureApproved", headerName: "Approval Status", headerAlign: "center", width: 250 },
    { field: "approveDate", headerName: "Approval Date", headerAlign: "center", width: 250 },
    { field: "status", headerName: "Status", headerAlign: "center", width: 250 },
    {
        field: "attachedFile", headerName: "Document", headerAlign: "center", width: 100,
        renderCell: (params) => (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                {params.value && <DownloadButtonFromS3 fileKey={params.value}/> }
            </div>
        ),
        // renderCell: (params) => {
        //     // const fileKey = params.value;
        //     // const dispatch = useDispatch();
        //     // const email = useAppSelector((state) => state.auth.user.email);
        //     // const token = useAppSelector((state) => state.auth.token);

        //     // const [modalOpen, setModalOpen] = useState(false);
        //     // const [fileUrl, setFileUrl] = useState<string | null>(null);

        //     // const handleOpenModal = async () => {
        //     //     console.log('clickedd')
        //     //     if (fileKey) {
        //     //         console.log(fileKey)
        //     //         try {
        //     //             const url = await dispatch(fetchDownloadExpenditureFile({
        //     //                 email: email,
        //     //                 fileName: fileKey,
        //     //                 token: token
        //     //             }) as any);
        //     //             console.log(url);
        //     //             setFileUrl(url);
        //     //             setModalOpen(true);
        //     //         } catch (error) {
        //     //             console.error('Failed to get file from S3', error);
        //     //         }
        //     //     }
        //     // };

        //     // return (
        //     //     <>
        //     //         <DownloadButtonFromS3 fileKey={params.value} />
        //     //         {/* <IconButton
        //     //             color="primary"
        //     //             onClick={handleOpenModal}
        //     //         >
        //     //             <FileDownload />
        //     //         </IconButton>
        //     //         <FilePreviewModal
        //     //             open={modalOpen}
        //     //             onClose={() => setModalOpen(false)}
        //     //             fileUrl={fileUrl || ''}
        //     //             fileName={fileKey || ''}
        //     //         /> */}
        //     //     </>
        //     // );
        // }
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

    // Not sure if this is needed
    const handleOnClickEditEmployee = () => {
        dispatch(setSelectedEmployeeId(selectedRowIds[0]));
        dispatch(changePageState("Edit Employee"));
    };

    const handleDelete = async () => {
        for (let id of selectedRowIds) {
            const selectedExpenditure = expenditureList.find(
                (selectedExpenditure) => selectedExpenditure.id === id
            );
            if (!selectedExpenditure) continue;

            if (selectedExpenditure.isExpenditureApproved) {
                await Swal.fire({
                    title: "Error",
                    text: 'Expenditure already approved',
                    icon: "error",
                    confirmButtonText: "OK",
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
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!"
                });

                if (result.isConfirmed) {
                    const data = await dispatch(fetchDeleteExpenditure({
                        token: token,
                        id: selectedExpenditure.id,
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
                            text: "Your expenditure has been deleted.",
                            icon: "success"
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
                    title: "Error",
                    text: 'Expenditure not yet approved, cannot cancel.',
                    icon: "error",
                    confirmButtonText: "OK",
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
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, cancel it!"
                });

                if (result.isConfirmed) {
                    const data = await dispatch(fetchCancelExpenditure({
                        token: token,
                        id: selectedExpenditure.id,
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
                            title: "Cancelled!",
                            text: "Your expenditure has been cancelled.",
                            icon: "success"
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
                        title: "Error",
                        text: data.payload.message,
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                    return;
                }
                Swal.fire({
                    title: "Success",
                    text: "Expense has been added",
                    icon: "success",
                    confirmButtonText: "OK",
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
                }}
            />

            <Grid container spacing={1} style={{ marginTop: 16 }} direction="row">
                <Grid item>
                    <Button
                        onClick={handleDelete}
                        variant="contained"
                        color="error"
                        disabled={isActivating || selectedRowIds.length === 0}
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        onClick={handleCancel}
                        variant="contained"
                        color="warning"
                        disabled={isActivating || selectedRowIds.length === 0}
                    >
                        {loading ? "Cancelling..." : "Cancel"}
                    </Button>
                </Grid>
            </Grid>

            <Grid container spacing={2} style={{ marginTop: 16 }} direction="row" alignItems="center">
                <Grid item xs={12}>
                    <Typography sx={{ fontWeight: "bold"}}>
                        Add Expenditure
                    </Typography>
                </Grid>

                <Grid item>
                    <TextField
                        label="Description"
                        name="description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        fullWidth
                        required
                        inputProps={{ maxLength: 50 }}
                        style={{ width: 399 }}
                    />
                </Grid>

                <Grid item>
                    <FormControl fullWidth style={{ width: 399 }}>
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
                <Grid item style={{ width: 399, height:72  }}>
                    <MyDropzone onFilesAdded={setFiles} />
                </Grid>
                <Grid item>
                    <Button
                        onClick={handleSaveExpense}
                        variant="contained"
                        color="primary"
                        disabled={price === 0 || description.length === 0}
                    >
                        {loading ? "Adding..." : "Add"}
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
}
