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
import {fetchExpenditureSave, fetchGetExpendituresOfEmployee} from "../../../store/feature/expenditureSlice";

const columns: GridColDef[] = [
    {field: "id", headerName: "ID", width: 70, headerAlign: "center"},
    {field: "price", headerName: "Price $", width: 150, headerAlign: "center"},
    {field: "description", headerName: "Description", width: 120, headerAlign: "center"},
    {field: "isExpenditureApproved", headerName: "Approval Status", headerAlign: "center", width: 250},
    {field: "approveDate", headerName: "Approval Date", headerAlign: "center", width: 250},
];


export default function SideBarExpenditure() {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');


    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const userList = useAppSelector((state) => state.expenditure.expenditureList);
    const [loading, setLoading] = useState(false);
    const [isActivating, setIsActivating] = useState(false);

    const [price, setPrice] = useState(0);
    const[description, setDescription] = useState('');


    useEffect(() => {
        dispatch(
            fetchGetExpendituresOfEmployee({
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

    const handleDeleteEmployee = async () => {
        setLoading(true);

        for (let id of selectedRowIds) {
            const selectedEmployee = userList.find((selectedEmployee) => selectedEmployee.id === id);
            if (!selectedEmployee) continue;


            try {


                //fetch
                const response = await dispatch(fetchDeleteEmployeeByAdmin({
                    token: token,
                    id: selectedEmployee.id,

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
                        text: "Deletion completed",
                        icon: "success",
                        confirmButtonText: "OK",
                    });

                    fetchGetExpendituresOfEmployee({
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
                rows={userList}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {page: 1, pageSize: 5},
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

            <Grid container spacing={1} style={{marginTop: 16}} direction="row">
                <Grid item>
                    <Button
                        onClick={handleOnClickEditEmployee}
                        variant="contained"
                        color="error"
                        disabled={isActivating || selectedRowIds.length === 0}
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </Button>
                </Grid>

            </Grid>

            <Grid container spacing={2} style={{ marginTop: 16 }} direction="row">
                <Grid item xs={12}>
                    <Typography sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                        Add Expenditure
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
                        <InputLabel htmlFor="outlined-adornment-amount">Expense</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-amount"
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            label="Expense"
                            value={price} // Set the value of the input
                            onChange={e => {
                                const value = e.target.value;
                                setPrice(value ? parseInt(value) : 0); // Eğer value geçersizse 0 olarak ayarla
                            }}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <Button
                        onClick={handleSaveExpense}
                        variant="contained"
                        color="primary"
                        disabled={price === 0  || description.length === 0 }

                    >
                        {loading ? "Deleting..." : "Add"}
                    </Button>
                </Grid>
            </Grid>



        </div>
    );
}
