import React, {useEffect, useState} from "react";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel,
} from "@mui/x-data-grid";
import {
    Button,
    Grid,
    TextField

} from "@mui/material";
import {HumanResources, useAppSelector} from "../../../store";
import {useDispatch} from "react-redux";


import {
    clearToken
} from "../../../store/feature/authSlice";
import Swal from "sweetalert2";
import {
    fetchApproveExpenditure, fetchDeleteExpenditure, fetchCancelExpenditure,
    fetchGetExpendituresOfManager
} from "../../../store/feature/expenditureSlice";
import DownloadButtonFromS3 from "../../atoms/DownloadButtonFromS3";

const columns: GridColDef[] = [
    {field: "id", headerName: "ID", width: 70, headerAlign: "center"},
    {field: "employeeName", headerName: "Name", width: 120, headerAlign: "center"},
    {field: "employeeSurname", headerName: "Surname", width: 120, headerAlign: "center"},
    {field: "price", headerName: "Price $", width: 150, headerAlign: "center",
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

    {field: "description", headerName: "Description", width: 120, headerAlign: "center"},
    {field: "isExpenditureApproved", headerName: "Approval Status", headerAlign: "center", width: 250},
    {field: "approveDate", headerName: "Approval Date", headerAlign: "center", width: 250},
    {field: "status", headerName: "Status", headerAlign: "center", width: 250},
    {
        field: "attachedFile", headerName: "Document", headerAlign: "center", width: 100,
        renderCell: (params) => (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                {params.value && <DownloadButtonFromS3 fileKey={params.value}/> }
            </div>
        )
    },

];


const  SideBarManagerBonus = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');


    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const expenditures = useAppSelector((state) => state.expenditure.expenditureList);
    const [loading, setLoading] = useState(false);
    const [isActivating, setIsActivating] = useState(false);

    const [price, setPrice] = useState(0);
    const[description, setDescription] = useState('');


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

            if (selectedExpenditure.isExpenditureApproved){
                Swal.fire({
                    title: "Error",
                    text: 'Expenditure already approved',
                    icon: "error",
                    confirmButtonText: "OK",

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
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
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
                            title: "Error",
                            text: data.payload.message,
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                        return;
                    } else {
                        await Swal.fire({
                            title: "Approved!",
                            text: "Your expenditure has been approved.",
                            icon: "success"
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
                    title: "Error",
                    text: 'Expenditure already approved',
                    icon: "error",
                    confirmButtonText: "OK",
                });
                continue; // Diğer id'lere geçmek için continue kullanın
            }

            if (selectedExpenditure.status === "DECLINED") {
                await Swal.fire({
                    title: "Error",
                    text: 'Expenditure already declined',
                    icon: "error",
                    confirmButtonText: "OK",
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
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, reject it!"
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
                            title: "Rejected!",
                            text: "Your expenditure has been rejected.",
                            icon: "success"
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
        setLoading(false);
    };

    return (
        <div style={{height: 400, width: "inherit"}}>
            <TextField
                label="Description"
                variant="outlined"
                onChange={(event) => setSearchText(event.target.value)}
                value={searchText}
                style={{marginBottom: "10px"}}
            />
            <DataGrid
                rows={expenditures}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {page: 1, pageSize: 5},
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
                }}
            />

            <Grid container spacing={1} style={{marginTop: 16}} direction="row">
                <Grid item>
                    <Button
                        onClick={handleApprove}
                        variant="contained"
                        color="primary"
                        disabled={loading || selectedRowIds.length === 0}
                    >
                        {loading ? "Approving..." : "Approve"}
                    </Button>
                </Grid>

                <Grid item>
                    <Button
                        onClick={handleReject}
                        variant="contained"
                        color="error"
                        disabled={isActivating || selectedRowIds.length === 0}
                    >
                        {isActivating ? "Rejecting..." : "Reject"}
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

        </div>
    );
}


export default SideBarManagerBonus