import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel, GridToolbar,
} from "@mui/x-data-grid";
import {
    Button,
    Grid,
    TextField

} from "@mui/material";
import { HumanResources, useAppSelector } from "../../../store";
import { useDispatch } from "react-redux";
import { ApproveIcon, DeclineIcon, CancelIcon } from "../../atoms/icons";

import {
    clearToken
} from "../../../store/feature/authSlice";
import Swal from "sweetalert2";
import {
    fetchApproveExpenditure, fetchDeleteExpenditure, fetchCancelExpenditure,
    fetchGetExpendituresOfManager
} from "../../../store/feature/expenditureSlice";
import DownloadButtonFromS3 from "../../atoms/DownloadButtonFromS3";
import { myErrorColour, myLightColour } from "../../../util/MyColours";

const columns: GridColDef[] = [
    { field: "employeeName", headerName: "Name", flex: 1.5, headerAlign: "center" },
    { field: "employeeSurname", headerName: "Surname", flex: 1.5, headerAlign: "center" },
    {
        field: "price", headerName: "Price $", flex: 1, headerAlign: "center",
        renderCell: (params) => {
            // Check if the value is valid
            const value = params.value;
            if (typeof value === 'number' && !isNaN(value)) {
                // Format the number as currency
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(value);
            }
            return '$0.00'; // Return default value if not a valid number
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
        )
    },

];


const SideBarManagerExpenditures = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');


    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const expenditures = useAppSelector((state) => state.expenditure.expenditureList);
    const [loading, setLoading] = useState(false);
    const [isActivating, setIsActivating] = useState(false);

    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);


    useEffect(() => {
        dispatch(
            fetchGetExpendituresOfManager({
                token: token,
                page: 0,
                pageSize: 100,
                searchText: searchText,
            })
        )
            .catch(() => {
                dispatch(clearToken());
            });
    }, [dispatch, searchText, token, loading, isActivating]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };


    const handleApprove = async () => {


        for (let id of selectedRowIds) {
            const selectedExpenditure = expenditures.find((selectedExpenditure) => selectedExpenditure.id === id);
            if (!selectedExpenditure) continue;

            if (selectedExpenditure.isExpenditureApproved) {
                Swal.fire({
                    title: "Error!",
                    text: 'Expenditure already approved',
                    icon: "error",
                    confirmButtonText: "OK",
                    confirmButtonColor: myLightColour,
                    cancelButtonColor: myErrorColour,

                });
                return
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
                    confirmButtonText: "Yes, approve it!"
                });

                if (result.isConfirmed) {
                    //fetch
                    const data = await dispatch(fetchApproveExpenditure({
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
                            title: "Approved!",
                            text: "Your expenditure has been approved.",
                            icon: "success",
                            confirmButtonColor: myLightColour,
                            cancelButtonColor: myErrorColour,
                        });

                        // Silme işlemi sonrasında listeyi hemen güncelleyin
                        await dispatch(fetchGetExpendituresOfManager({
                            token: token,
                            page: 0,
                            pageSize: 100,
                            searchText: searchText,
                        }));
                    }
                }
            } catch
            (error) {
                localStorage.removeItem("token");
                dispatch(clearToken());
            }

        }
        setSelectedRowIds([]);
        setLoading(false);
    };

    const handleReject = async () => {
        for (let id of selectedRowIds) {
            const selectedExpenditure = expenditures.find(
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
                continue; // Diğer id'lere geçmek için continue kullanın
            }

            if (selectedExpenditure.status === "DECLINED") {
                await Swal.fire({
                    title: "Error!",
                    text: 'Expenditure already declined',
                    icon: "error",
                    confirmButtonText: "OK",
                    confirmButtonColor: myLightColour,
                    cancelButtonColor: myErrorColour,
                });
                continue; // Diğer id'lere geçmek için continue kullanın
            }
            setIsActivating(true);
            try {
                const result = await Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: myLightColour,
                    cancelButtonColor: myErrorColour,
                    confirmButtonText: "Yes, reject it!"
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
                            title: "Rejected!",
                            text: "Your expenditure has been rejected.",
                            icon: "success",
                            confirmButtonColor: myLightColour,
                            cancelButtonColor: myErrorColour,
                        });

                        // Silme işlemi sonrasında listeyi hemen güncelleyin
                        await dispatch(fetchGetExpendituresOfManager({
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
        setIsActivating(false);
    };

    const handleCancel = async () => {
        for (let id of selectedRowIds) {
            const selectedExpenditure = expenditures.find(
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

                        await dispatch(fetchGetExpendituresOfManager({
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
                rows={expenditures}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 1, pageSize: 5 },
                    },
                }}
                getRowClassName={(params) =>
                    params.row.isExpenditureApproved
                        ? "approved-row" // Eğer onaylandıysa, yeşil arka plan
                        : "unapproved-row" // Onaylanmadıysa, kırmızı arka plan
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
                        backgroundColor: "#e0f2e9", // Onaylananlar için yeşil arka plan
                    },
                    "& .unapproved-row": {
                        backgroundColor: "#ffe0e0", // Onaylanmayanlar için kırmızı arka plan
                    },
                    height: '407px'
                }}
                rowSelectionModel={selectedRowIds}
            />

            <Grid container spacing={2} sx={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'stretch', marginTop: '2%', marginBottom: '2%' }}>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleApprove}
                        variant="contained"
                        color="success"
                        disabled={loading || selectedRowIds.length === 0}
                        startIcon={<ApproveIcon />}
                        sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        Approve
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleReject}
                        variant="contained"
                        color="error"
                        disabled={isActivating || selectedRowIds.length === 0}
                        startIcon={<DeclineIcon />}
                        sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        Reject
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleCancel}
                        variant="contained"
                        color="warning"
                        disabled={isActivating || selectedRowIds.length === 0}
                        startIcon={<CancelIcon />}
                        sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        Cancel
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
}

// @ts-ignore
export default SideBarManagerExpenditures