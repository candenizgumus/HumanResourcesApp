import { Box, Grid, Paper, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { HumanResources, useAppSelector } from "../../../store";
import { useDispatch } from "react-redux";
import {
    fetchFindEmployeesWithUpcomingBirthdays,
    fetchGetAllUsersOfManager,
    fetchGetMonthlyPaymentOfEmployees
} from "../../../store/feature/authSlice";
import { IMonthlyPaymentOfManager } from "../../../models/IMonthlyPaymentOfManager";
import { fetchMonthlyPayments } from "../../../store/feature/paymentSlice";
import { IPayment } from "../../../models/IPayment";
import { fetchGetMonthlyHolidays } from "../../../store/feature/holidaySlice";
import { IHoliday } from "../../../models/IHoliday";
import { IHolidayFormatted } from "../../../models/IHolidayFormatted";
import HikingIcon from "@mui/icons-material/Hiking";
import { Cake, Paid, Payments, PieChart, Weekend } from "@mui/icons-material";
import { myBackgroundColour, myLightColour, mySecondaryColor } from "../../../util/MyColours";
import MyCard from "../../atoms/MyCard";
import EmployeePositionPieChart from "./EmployeePositionPieChart";

export const ManagerHomeContent = () => {
    const upcomingBirthdayUsers = useAppSelector(state => state.auth.upcomingBirthdayUsers);
    const token = useAppSelector(state => state.auth.token);
    const dispatch = useDispatch<HumanResources>();
    const monthlyPayments = useAppSelector(state => state.payment.currentMonthsPayments);
    const [totalSalary, setTotalSalary] = useState(0);
    const [totalMonthlyPayment, setTotalMonthlyPayment] = useState(0);
    const [monthlyEmployeeSalaries, setMonthlyEmployeeSalaries] = useState<IMonthlyPaymentOfManager[]>([]);
    const [monthlyHolidays, setMonthlyHolidays] = useState<IHolidayFormatted[]>([]);
    const [monthlyHolidaysUnformatted, setmonthlyHolidaysUnformatted] = useState<IHoliday[]>([]);
    const userList = useAppSelector((state) => state.auth.userList);
    const formatDate = (date: Date | string | undefined): string => {
        if (!date) return '';

        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const d = new Date(date);
        const day = d.getDate();
        const month = months[d.getMonth()]; // Get month name

        return `${day} ${month}`;


    };
    const getManagerPageDatas = async () => {
        await dispatch(fetchFindEmployeesWithUpcomingBirthdays(token)).unwrap();
        await dispatch(fetchGetAllUsersOfManager({
            token: token,
            page: 0,
            pageSize: 100,
            searchText: ''
        })).unwrap();
        const monthlyPayments = await dispatch(fetchMonthlyPayments(token)).unwrap();

        const monthlyHolidaysUnFormatted = await dispatch(fetchGetMonthlyHolidays(token)).unwrap();

        setmonthlyHolidaysUnformatted(monthlyHolidaysUnFormatted);

        if (Array.isArray(monthlyPayments)) {
            // Calculate the total salary here
            const sum = monthlyPayments.reduce((acc: number, employee: IPayment) => acc + (employee.payment || 0), 0);

            // Set the states

            setTotalMonthlyPayment(sum);
        } else {
            console.error("Result is not an array:", monthlyPayments);
        }

        const result = await dispatch(fetchGetMonthlyPaymentOfEmployees(token)).unwrap();

        if (Array.isArray(result)) {
            // Calculate the total salary here
            const sum = result.reduce((acc: number, employee: IMonthlyPaymentOfManager) => acc + (employee.total || 0), 0);

            // Set the states
            setMonthlyEmployeeSalaries(result);
            setTotalSalary(sum);
        } else {
            console.error("Result is not an array:", result);
        }
    };


    useEffect(() => {
        const formatHolidays = () => {
            const formattedHolidays = monthlyHolidaysUnformatted.map((holiday) => ({
                id: holiday.id,
                holidayName: holiday.holidayName,
                holidayType: holiday.holidayType,
                holidayStartDate: formatDate(holiday.startDate),
                holidayEndDate: formatDate(holiday.endDate),
            }));
            setMonthlyHolidays(formattedHolidays);
        };

        if (monthlyHolidaysUnformatted.length > 0) {
            formatHolidays();
        }
    }, [monthlyHolidaysUnformatted]);
    useEffect(() => {
        getManagerPageDatas();
        dispatch(fetchGetAllUsersOfManager({ token: token, page: 0, pageSize: 100, searchText: '' }));
    }, []);


    const columns: GridColDef[] = [
        { field: "name", headerName: "First name", flex: 2, headerAlign: "center" },
        { field: "surname", headerName: "Last name", flex: 1.5, headerAlign: "center" },
        { field: "birthDate", headerName: "Birth Date", type: "string", flex: 2.2, headerAlign: "center" },
    ];


    const columnSalary: GridColDef[] = [
        { field: "name", headerName: "First name", flex: 1.7, headerAlign: "center" },
        { field: "surname", headerName: "Last name", flex: 1.5, headerAlign: "center" },
        { field: "salary", headerName: "Salary $", type: "number", flex: 1.5, headerAlign: "center" },
        { field: "extraPayments", headerName: "Extra Payments $", type: "number", flex: 1.4, headerAlign: "center" },
        { field: "bonus", headerName: "Bonus $", type: "number", flex: 1.0, headerAlign: "center" },
        { field: "total", headerName: "Total $", type: "number", flex: 1.2, headerAlign: "center" },
    ];

    const columHolidays: GridColDef[] = [
        { field: 'holidayName', headerName: 'Holiday', flex: 2, headerAlign: "center" },
        { field: 'holidayType', headerName: 'Type', flex: 1.5, headerAlign: "center" },
        {
            field: 'holidayStartDate',
            headerName: 'Start Date',
            flex: 1.5,
            headerAlign: "center"
        },
        {
            field: 'holidayEndDate',
            headerName: 'End Date',
            flex: 1.5,
            headerAlign: "center"
        },
    ];


    const columnMonthlyPayments: GridColDef[] = [
        {
            field: "payment", headerName: "Payment $", flex: 1, headerAlign: "center",
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
        { field: "description", headerName: "Description", flex: 2, headerAlign: "center" },
        { field: "paymentDate", headerName: "Payment Date", flex: 1, headerAlign: "center" },
    ];

    return (
        <>
            <Grid container spacing={0}>
                <Grid item xs={6}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Box sx={{ p: 2, pt: 0, maxWidth: '100%' }}>
                                        <MyCard />
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ p: 2, pt: 0, maxWidth: '100%' }}>
                                    <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                                        <div style={{ height: "auto", width: "inherit" }}>
                                            <Typography variant="h6" align="center" sx={{ mb: 2, fontWeight: "bold", color: 'myLightColour.main' }}>
                                                <Payments />  Monthly Payments ($ {totalMonthlyPayment.toFixed(2)} )
                                            </Typography>
                                            <DataGrid
                                                rows={monthlyPayments}
                                                columns={columnMonthlyPayments}
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
                                                    backgroundColor: myBackgroundColour, // Açık tonlarda arka plan rengi
                                                    "& .MuiDataGrid-columnHeaders": {
                                                        backgroundColor: myLightColour, // Header için açık yeşil tonlarda bir arka plan rengi
                                                    },
                                                    "& .MuiDataGrid-columnHeader": {
                                                        backgroundColor: myLightColour, // Header arka plan rengi
                                                    },
                                                    "& .MuiDataGrid-columnHeaderTitle": {
                                                        textAlign: "center",
                                                        fontWeight: "bold",
                                                        fontSize: "11px",

                                                    },
                                                    "& .MuiDataGrid-cell": {
                                                        textAlign: "center",
                                                        fontSize: "11px",
                                                    },
                                                    height: "214px",
                                                }}
                                            />
                                        </div>
                                    </Paper>
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid item xs={6}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Box sx={{ p: 2, pt: 0, pl: 0, maxWidth: '100%' }}>
                                        <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                                            <div style={{ height: "auto", width: "inherit" }}>
                                                <Typography variant="h6" align="center" sx={{ mb: 2, fontWeight: "bold", color: 'myLightColour.main' }}>
                                                    <Cake />  Monthly Employee Birthdays
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
                                                        backgroundColor: myBackgroundColour, // Açık tonlarda arka plan rengi
                                                        "& .MuiDataGrid-columnHeaders": {
                                                            backgroundColor: myLightColour, // Header için açık yeşil tonlarda bir arka plan rengi
                                                        },
                                                        "& .MuiDataGrid-columnHeader": {
                                                            backgroundColor: myLightColour, // Header arka plan rengi
                                                        },
                                                        "& .MuiDataGrid-columnHeaderTitle": {
                                                            textAlign: "center",
                                                            fontWeight: "bold",

                                                        },
                                                        "& .MuiDataGrid-cell": {
                                                            textAlign: "center",
                                                        },
                                                        height: "214px",
                                                    }}
                                                />
                                            </div>
                                        </Paper>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box sx={{ p: 2, pt: 0, pl: 0, maxWidth: '100%' }}>
                                        <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                                            <div style={{ height: "auto", width: "inherit" }}>
                                                <Typography variant="h6" align="center" sx={{ mb: 2, fontWeight: "bold", color: 'myLightColour.main' }}>
                                                    <PieChart />   Employee Distribution by Position
                                                </Typography>
                                                <EmployeePositionPieChart employeeList={userList} />
                                            </div>
                                        </Paper>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>



                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <Grid item xs={12}>
                        <Box sx={{ p: 2, pt: 0, maxWidth: '100%' }}>
                            <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                                <div style={{ height: "auto", width: "inherit" }}>
                                    <Typography variant="h6" align="center" sx={{ mb: 2, fontWeight: "bold", color: 'myLightColour.main' }}>
                                        <Paid /> Monthly Total Salary ($ {totalSalary.toFixed(2)} )
                                    </Typography>

                                    <DataGrid

                                        rows={monthlyEmployeeSalaries}
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
                                            backgroundColor: myBackgroundColour, // Açık tonlarda arka plan rengi
                                            "& .MuiDataGrid-columnHeaders": {
                                                backgroundColor: myLightColour, // Header için açık yeşil tonlarda bir arka plan rengi
                                            },
                                            "& .MuiDataGrid-columnHeader": {
                                                backgroundColor: myLightColour, // Header arka plan rengi
                                            },
                                            "& .MuiDataGrid-columnHeaderTitle": {
                                                textAlign: "center",
                                                fontWeight: "bold",

                                            },
                                            "& .MuiDataGrid-cell": {
                                                textAlign: "center",
                                            },
                                            height: "428px",
                                        }}
                                    />
                                </div>
                            </Paper>
                        </Box>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box sx={{ p: 2, pt: 0, maxWidth: '100%' }}>
                                <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                                    <div style={{ height: "auto", width: "inherit" }}>
                                        <Typography variant="h6" align="center" sx={{ mb: 2, fontWeight: "bold", color: 'myLightColour.main' }}>
                                            <Weekend /> Monthly Holidays
                                        </Typography>

                                        <DataGrid

                                            rows={monthlyHolidays}
                                            columns={columHolidays}
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
                                                backgroundColor: myBackgroundColour, // Açık tonlarda arka plan rengi
                                                "& .MuiDataGrid-columnHeaders": {
                                                    backgroundColor: myLightColour, // Header için açık yeşil tonlarda bir arka plan rengi
                                                },
                                                "& .MuiDataGrid-columnHeader": {
                                                    backgroundColor: myLightColour, // Header arka plan rengi
                                                },
                                                "& .MuiDataGrid-columnHeaderTitle": {
                                                    textAlign: "center",
                                                    fontWeight: "bold",

                                                },
                                                "& .MuiDataGrid-cell": {
                                                    textAlign: "center",
                                                },
                                                height: "214px",
                                            }}
                                        />
                                    </div>
                                </Paper>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};