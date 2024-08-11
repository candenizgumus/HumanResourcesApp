import {Avatar, Box, Grid, Typography} from "@mui/material";
import {DataGrid, GridColDef, GridValueGetter} from "@mui/x-data-grid";
import React, {useEffect, useState} from "react";
import {HumanResources, useAppSelector} from "../../../store";
import {useDispatch} from "react-redux";
import {fetchFindEmployeesWithUpcomingBirthdays, fetchGetAllUsersOfManager} from "../../../store/feature/authSlice";

export const ManagerHomeContent = () => {
    const upcomingBirthdayUsers = useAppSelector(state => state.auth.upcomingBirthdayUsers);
    const token = useAppSelector(state => state.auth.token);
    const dispatch = useDispatch<HumanResources>();
    const employeList = useAppSelector(state => state.auth.userList);
    const [totalSalary, setTotalSalary] = useState(0);


    const getManagerPageDatas = async () => {
        await dispatch(fetchFindEmployeesWithUpcomingBirthdays(token)).unwrap();
        await dispatch(fetchGetAllUsersOfManager({
            token: token,
            page: 0,
            pageSize: 100,
            searchText: ''
        })).unwrap();
    };

    useEffect(() => {
        getManagerPageDatas();
    }, [dispatch, token]);

    useEffect(() => {
        if (employeList.length > 0) {
            const sum = employeList.reduce((acc, employee) => acc + (employee.salary || 0), 0);
            setTotalSalary(sum);
        }
    }, [employeList]);

    const columns: GridColDef[] = [
        { field: "name", headerName: "First name", width: 170, headerAlign: "center" },
        { field: "surname", headerName: "Last name", width: 150, headerAlign: "center" },
        { field: "email", headerName: "Email", headerAlign: "center", width: 250 },
        { field: "phone", headerName: "Phone", sortable: false, headerAlign: "center", width: 140 },
        { field: "birthDate", headerName: "Birth Date", type: "string", width: 220, headerAlign: "center" },


    ];

    const columnSalary: GridColDef[] = [
        { field: "name", headerName: "First name", width: 170, headerAlign: "center" },
        { field: "surname", headerName: "Last name", width: 150, headerAlign: "center" },
        { field: "email", headerName: "Email", headerAlign: "center", width: 150 },
        { field: "salary", headerName: "Salary $", type: "number", width: 150, headerAlign: "center" },
        { field: "extraPayments", headerName: "Extra Payments $", type: "number", width: 155, headerAlign: "center",
            valueGetter: (value, row) => {
                return `${row.firstName || ''} ${row.lastName || ''}`;
            },

        },
        { field: "total", headerName: "Total $", type: "number", width: 155, headerAlign: "center" },


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
                <Grid sx={{ height:'300px' }} item xs={6}>

                    <Typography  sx={{ textAlign: 'center' , fontWeight: 'bold'}} variant="h6" gutterBottom>
                        Monthly Total Salary (${totalSalary.toFixed(2)})
                    </Typography>

                    <DataGrid

                        rows={employeList}
                        columns={columnSalary}
                        disableRowSelectionOnClick={true} // Satır seçimini kapatır
                        hideFooter // Alt barda yer alan seçenekleri gizler
                        isRowSelectable={() => false}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}
                        pageSizeOptions={[5, 10]}


                        sx={{
                            backgroundColor: "#EAFFFF", // Açık tonlarda arka plan rengi
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "#B1D4F9", // Header için açık yeşil tonlarda bir arka plan rengi
                            },
                            "& .MuiDataGrid-columnHeader": {
                                backgroundColor: "#B1D4F9", // Header arka plan rengi
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