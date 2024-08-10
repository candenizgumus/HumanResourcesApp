import {Avatar, Grid, Typography} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import React, {useEffect} from "react";
import {HumanResources, useAppSelector} from "../../../store";
import {useDispatch} from "react-redux";
import {fetchFindEmployeesWithUpcomingBirthdays} from "../../../store/feature/authSlice";

export const ManagerHomeContent = () => {
    const upcomingBirthdayUsers = useAppSelector(state => state.auth.upcomingBirthdayUsers);
    const token = useAppSelector(state => state.auth.token);
    const dispatch = useDispatch<HumanResources>();


    const getUpcomingBirthdayUsers = async () => {
        dispatch(fetchFindEmployeesWithUpcomingBirthdays(token))
    }

    useEffect(() => {
        getUpcomingBirthdayUsers()
    }, []);

    const columns: GridColDef[] = [
        { field: "name", headerName: "First name", width: 170, headerAlign: "center" },
        { field: "surname", headerName: "Last name", width: 150, headerAlign: "center" },
        { field: "email", headerName: "Email", headerAlign: "center", width: 250 },
        { field: "phone", headerName: "Phone", sortable: false, headerAlign: "center", width: 140 },
        { field: "birthDate", headerName: "Birth Date", type: "string", width: 220, headerAlign: "center" },


    ];
    return (
        <>
            <Grid container spacing={2}>
                <Grid sx={{ height:'300px' }} item xs={6}>

                    <Typography  sx={{ textAlign: 'center' , fontWeight: 'bold'}} variant="h6" gutterBottom>
                        Upcoming Employee Birthdays
                    </Typography>

                    <DataGrid

                        rows={upcomingBirthdayUsers}
                        columns={columns}
                        disableRowSelectionOnClick={true} // Satır seçimini kapatır
                        hideFooter // Alt barda yer alan seçenekleri gizler
                        isRowSelectable={() => false}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}
                        pageSizeOptions={[5, 10]}

                        showCellVerticalBorder={true}
                        showColumnVerticalBorder={true}
                        sx={{
                            backgroundColor: "#e0f2e9", // Açık tonlarda arka plan rengi
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "#d0e6d9", // Header için açık yeşil tonlarda bir arka plan rengi
                            },
                            "& .MuiDataGrid-columnHeader": {
                                backgroundColor: "#d0e6d9", // Header arka plan rengi
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
                </Grid>
            </Grid>
        </>
    );
};