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


import {
    clearToken
} from "../../../store/feature/authSlice";
import Swal from "sweetalert2";
import { fetchDeleteBonus, fetchGetBonusesOfManager } from "../../../store/feature/bonusSlice";
import { DeleteIcon } from "../../atoms/icons";
import { myErrorColour, myLightColour } from "../../../util/MyColours";

const columns: GridColDef[] = [

    { field: "name", headerName: "Name", flex: 1, headerAlign: "center" },
    { field: "surname", headerName: "Surname", flex: 1, headerAlign: "center" },
    { field: "email", headerName: "Email", flex: 2, headerAlign: "center" },
    {
        field: "bonusAmount", headerName: "Bonus $", flex: 1, headerAlign: "center",
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

    { field: "description", headerName: "Description", flex: 1, headerAlign: "center" },
    { field: "bonusDate", headerName: "Bonus Date", flex: 1, headerAlign: "center" },
    { field: "status", headerName: "Status", headerAlign: "center", flex: 1 },


];


const SideBarManagerBonus = () => {
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
                    confirmButtonColor: myLightColour,
                    cancelButtonColor: myErrorColour,
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
                            confirmButtonColor: myLightColour,
                            cancelButtonColor: myErrorColour,
                        });
                        return;
                    } else {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your bonus has been deleted.",
                            icon: "success",
                            confirmButtonColor: myLightColour,
                            cancelButtonColor: myErrorColour,
                        }).then(() => {
                            dispatch(
                                fetchGetBonusesOfManager({
                                    token: token,
                                    page: 0,
                                    pageSize: 100,
                                    searchText: searchText,
                                })
                            );

                        })

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
        <div style={{ height: "auto", width: "inherit" }}>
            <TextField
                label="Search By Email"
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
                rows={bonusList}
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
            />
            <Grid container spacing={2} sx={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'stretch', marginTop: '2%', marginBottom: '2%' }}>
                <Grid item xs={12} sm={12} md={4} lg={3}>
                <Button
                    onClick={handleDelete}
                    variant="contained"
                    color="error"
                    disabled={isActivating || selectedRowIds.length === 0}
                    startIcon={<DeleteIcon />}
                    sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    Delete
                </Button>
                </Grid>
            </Grid>
        </div>
    );
}


export default SideBarManagerBonus