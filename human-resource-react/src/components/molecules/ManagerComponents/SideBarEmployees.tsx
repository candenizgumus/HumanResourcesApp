import React, { useEffect, useState } from "react";
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
import { HumanResources, useAppSelector } from "../../../store";
import { useDispatch } from "react-redux";


import {
    changePageState,
    clearToken,
    fetchDeleteEmployeeByAdmin,
    fetchGetAllUsers,
    fetchGetAllUsersOfManager, setSelectedEmployeeId
} from "../../../store/feature/authSlice";
import Swal from "sweetalert2";
import {fetchApproveOffers, fetchGetOfferCount, fetchGetOffers} from "../../../store/feature/offerSlice";

const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70, headerAlign: "center" },
    { field: "name", headerName: "First name", width: 120, headerAlign: "center" },
    { field: "surname", headerName: "Last name", width: 120, headerAlign: "center" },
    { field: "email", headerName: "Email", headerAlign: "center", width: 250 },
    { field: "phone", headerName: "Phone", sortable: false, headerAlign: "center", width: 140 },
    { field: "position", headerName: "Position", type: "string", width: 220, headerAlign: "center" },
    { field: "userType", headerName: "User Type", width: 150, headerAlign: "center" },
    { field: "employeeType", headerName: "Employee Type", width: 150, headerAlign: "center" },
    { field: "status", headerName: "Status", width: 120, headerAlign: "center" },

];


export default function SideBarEmployees() {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');


    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const userList = useAppSelector((state) => state.auth.userList);
    const [loading, setLoading] = useState(false);



    useEffect(() => {
        dispatch(
            fetchGetAllUsersOfManager({
                token: token,
                page: 0,
                pageSize: 100,
                searchText: searchText,
            })
        )
            .catch(() => {
            dispatch(clearToken());
        });
    }, [dispatch, searchText, token,loading]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const handleOnClickEditEmployee= () => {
        dispatch(setSelectedEmployeeId(selectedRowIds[0]))
        dispatch(changePageState("Edit Employee"))


    }

    const handleDeleteEmployee = async () => {
        setLoading(true);

        for (let id of selectedRowIds) {
            const selectedEmployee = userList.find((selectedEmployee) => selectedEmployee.id === id);
            if (!selectedEmployee) continue;

            try {
                const result = await Swal.fire({
                    title: "Please Confirm Deletion of:  \n" + selectedEmployee.name + " " + selectedEmployee.surname,
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Confirm",
                    input: "radio",

                });

                if (result.isConfirmed) {


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
                            text: "Offer has been approved",
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

                }
            } catch (error) {
                localStorage.removeItem("token");
                dispatch(clearToken());
            }
        }

        setLoading(false);
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
                rows={userList}
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
                        onClick={handleDeleteEmployee}
                        variant="contained"
                        color="error"
                        disabled={ loading }
                    >
                        {loading ? "Deleting..." : "Delete Employee"}
                    </Button>
                </Grid>

                <Grid item>
                    <Button
                        onClick={handleOnClickEditEmployee}
                        variant="contained"
                        color="warning"
                        disabled={  selectedRowIds.length>1 || selectedRowIds.length === 0}
                    >
                        Edit Employee
                    </Button>
                </Grid>
            </Grid>



        </div>
    );
}
