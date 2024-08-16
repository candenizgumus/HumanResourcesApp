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
import {fetchDeleteBonus, fetchGetBonusesOfManager} from "../../../store/feature/bonusSlice";

const columns: GridColDef[] = [

    {field: "name", headerName: "Name", flex: 1, headerAlign: "center"},
    {field: "surname", headerName: "Surname", flex: 1, headerAlign: "center"},
    {field: "email", headerName: "Email", flex: 2, headerAlign: "center"},
    {field: "bonusAmount", headerName: "Bonus $", flex: 1, headerAlign: "center",
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

    {field: "description", headerName: "Description", flex: 1, headerAlign: "center"},
    {field: "bonusDate", headerName: "Bonus Date", flex: 1, headerAlign: "center"},
    {field: "status", headerName: "Status", headerAlign: "center", flex: 1},


];


const  SideBarManagerBonus = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');


    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const bonusList = useAppSelector((state) => state.bonus.bonusList);
    const [loading, setLoading] = useState(false);
    const [isActivating, setIsActivating] = useState(false);



    useEffect(() => {
        dispatch(
            fetchGetBonusesOfManager({
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






    const handleDelete = async () => {
        for (let id of selectedRowIds) {
            const selectedBonus = bonusList.find(
                (selectedBonus) => selectedBonus.id === id
            );
            if (!selectedBonus) continue;


            setLoading(true);
            try {
                const result = await Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                        confirmButtonColor: '#1976D2',
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!"
                });

                if (result.isConfirmed) {
                    const data = await dispatch(fetchDeleteBonus({
                        token: token,
                        id: selectedBonus.id,
                    }));

                    if (data.payload.message) {
                        await Swal.fire({
                            title: "Error",
                            text: data.payload.message,
                            icon: "error",
                            confirmButtonText: "OK",
                            confirmButtonColor: '#1976D2',
                        });
                        return;
                    } else {
                        await Swal.fire({
                            title: "Deleted!",
                            text: "Your bonus has been cancelled.",
                            icon: "success",
                            confirmButtonColor: '#1976D2',
                        });

                        await dispatch(fetchGetBonusesOfManager({
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
        <div style={{height: "auto", width: "inherit"}}>
            <TextField
                label="Description"
                variant="outlined"
                onChange={(event) => setSearchText(event.target.value)}
                value={searchText}
                style={{marginBottom: "10px"}}
            />
            <DataGrid
                rows={bonusList}
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
                        onClick={handleDelete}
                        variant="contained"
                        color="error"
                        disabled={isActivating || selectedRowIds.length === 0}
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </Button>
                </Grid>

            </Grid>

        </div>
    );
}


export default SideBarManagerBonus