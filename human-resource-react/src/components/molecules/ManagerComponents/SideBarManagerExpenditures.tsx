import React, {useEffect, useState} from "react";
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
import {HumanResources, useAppSelector} from "../../../store";
import {useDispatch} from "react-redux";


import {
    changePageState,
    clearToken,
    fetchDeleteEmployeeByAdmin,
    fetchGetAllUsersOfManager, setSelectedEmployeeId
} from "../../../store/feature/authSlice";
import Swal from "sweetalert2";
import {
    fetchApproveExpenditure,
    fetchExpenditureSave,
    fetchGetExpendituresOfManager
} from "../../../store/feature/expenditureSlice";

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

];


export const  SideBarManagerExpenditures = () => {
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

    const handleOnClickEditEmployee = () => {
        dispatch(setSelectedEmployeeId(selectedRowIds[0]))
        dispatch(changePageState("Edit Employee"))


    }

    const handleApprove = async () => {
        setLoading(true);

        for (let id of selectedRowIds) {
            const selectedExpenditure = expenditures.find((selectedExpenditure) => selectedExpenditure.id === id);
            if (!selectedExpenditure) continue;


            try {


                //fetch
                const response = await dispatch(fetchApproveExpenditure({
                    token: token,
                    id: selectedExpenditure.id,

                })).then(data => {
                    if (data.payload.message) {
                        Swal.fire({
                            title: "Error",
                            text: data.payload.message,
                            icon: "error",
                            confirmButtonText: "OK",

                        });
                        return
                    }
                    Swal.fire({
                        title: "Success",
                        text: "Expenditure has been approved",
                        icon: "success",
                        confirmButtonText: "OK",
                    });

                    fetchGetExpendituresOfManager({
                        token: token,
                        page: 0,
                        pageSize: 100,
                        searchText: searchText,
                    })
                })

            } catch
                (error) {
                localStorage.removeItem("token");
                dispatch(clearToken());
            }

        }
        setLoading(false);
    };

    const handleSaveExpense = async () => {
        setIsActivating(true);



            try {


                //fetch
                const response = await dispatch(fetchExpenditureSave({
                    token: token,
                    description: description,
                    price: price

                })).then(data => {
                    if (data.payload.message) {
                        Swal.fire({
                            title: "Error",
                            text: data.payload.message,
                            icon: "error",
                            confirmButtonText: "OK",

                        });
                        return
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
                    })
                })

            } catch (error) {
                localStorage.removeItem("token");
                dispatch(clearToken());
            }


        setIsActivating(false);
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
                        color="error"
                        disabled={isActivating || selectedRowIds.length === 0}
                    >
                        {loading ? "Approving..." : "Approve"}
                    </Button>
                </Grid>

                <Grid item>
                    <Button
                        onClick={handleOnClickEditEmployee}
                        variant="contained"
                        color="error"
                        disabled={isActivating || selectedRowIds.length === 0}
                    >
                        {loading ? "Rejecting..." : "Reject"}
                    </Button>
                </Grid>

            </Grid>

        </div>
    );
}

export default SideBarManagerExpenditures