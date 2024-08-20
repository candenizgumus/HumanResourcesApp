import React, { useEffect, useState } from 'react';
import MyCalendar, { IShift } from "../../atoms/MyCalender";
import { useDispatch } from "react-redux";
import { HumanResources, useAppSelector } from "../../../store";
import { fetchFindShiftsOfEmployee } from "../../../store/feature/shiftSlice";
import {Grid, Typography, Box, TextField, Paper} from "@mui/material";
import MyCard from "../../atoms/MyCard";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {fetchGetAssignedItemsOfEmployee} from "../../../store/feature/companyItemSlice";
import {IAssignedItemList} from "../../../models/IAssignedItemList";
import {AddDocumentIcon} from "../../atoms/icons";
import {useTheme} from "@mui/material/styles";
import ThemeElement from "../../atoms/ThemeElement";
import {fetchGetCurrentLeavesOfEmployeeForHomePage, ILeave} from "../../../store/feature/leaveSlice";
import HikingIcon from "@mui/icons-material/Hiking";
import {AccountBalance, AccountBox, PointOfSale} from "@mui/icons-material";
import {IExpenditure} from "../../../models/IExpenditure";
import {fetchGetAllExpendituresOfEmployeeByCurrentMonth} from "../../../store/feature/expenditureSlice";

export const EmployeeHomeContent: React.FC = () => {
    const [events, setEvents] = useState<IShift[]>([]);
    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const [assignedItemList, setAssignedItemList] = useState<IAssignedItemList[]>([]);
    const [leaves, setLeave] = useState<ILeave[]>([]);
    const [expenditures, setExpenditures] = useState<IExpenditure[]>([]);
    const user = useAppSelector((state) => state.auth.user);


    const getShiftsOfEmployee = () => {
        dispatch(fetchFindShiftsOfEmployee({ employeeId: user.id, token: token })).then(data => {
            setEvents(data.payload);
        });

        dispatch(fetchGetAssignedItemsOfEmployee(token)).then(data => {
            setAssignedItemList(data.payload);
        })

        dispatch(fetchGetCurrentLeavesOfEmployeeForHomePage(token)).then(data => {
            setLeave(data.payload);
        })

        dispatch(fetchGetAllExpendituresOfEmployeeByCurrentMonth(token)).then(data => {
            setExpenditures(data.payload);
        })
    };

    useEffect(() => {
        getShiftsOfEmployee();
    }, []);


    const columns: GridColDef[] = [


        {field: "name", headerName: "Item Name", flex: 1, headerAlign: "center" ,groupable: false , sortable: false },
        {field: "assignDate", headerName: "Assignment Date", flex: 1, headerAlign: "center" ,groupable: false , sortable: false}


    ];

    const columnsLeaves: GridColDef[] = [


        {field: "description", headerName: "Description", flex: 1.5, headerAlign: "center" ,groupable: false , sortable: false },
        {field: "startDate", headerName: "Start Date", flex: 1, headerAlign: "center" ,groupable: false , sortable: false},
        {field: "endDate", headerName: "End Date", flex: 1, headerAlign: "center" ,groupable: false , sortable: false}


    ];

    const columnsExpenditures: GridColDef[] = [

        { field: "description", headerName: "Description", flex: 2, headerAlign: "center" },
        {
            field: "price", headerName: "Price $", flex: 1, headerAlign: "center",
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
        { field: "approveDate", headerName: "Date", headerAlign: "center", flex: 1 },



    ];

    return (
        <ThemeElement children={
            <Grid container spacing={2} >
                <Grid item xs={6}>
                    <MyCalendar events={events} isUserManager={false} />
                </Grid>
                <Grid item xs={3} >
                    <Grid container  spacing={2} >

                        <Grid item xs={12}>

                            <Box sx={{ p: 2, maxWidth: '100%' }}>
                                <Paper elevation={3} sx={{p: 2, borderRadius: 2 }}>
                                    <div style={{height: "auto", width: "inherit"}}>
                                        <Typography variant="h6" align="center" sx={{ mb: 2 , fontWeight: "bold", color: 'myLightColour.main'}}>
                                            <AddDocumentIcon/> My Items
                                        </Typography>
                                        <DataGrid
                                            disableColumnMenu={true}
                                            rows={assignedItemList}
                                            columns={columns}
                                            initialState={{
                                                pagination: {
                                                    paginationModel: {page: 1, pageSize: 5},
                                                },
                                            }}
                                            pageSizeOptions={[5, 10]}
                                            rowSelection={false}
                                            hideFooter={true}


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
                                                height: "214px",
                                            }}
                                        />


                                    </div>

                                </Paper>
                            </Box>

                        </Grid>

                        <Grid item xs={12}>

                            <Box sx={{ p: 2, maxWidth: '100%' }}>
                                <Paper elevation={3} sx={{p: 2, borderRadius: 2}}>
                                    <div style={{height: "auto", width: "inherit"}}>
                                        <Typography variant="h6" align="center" sx={{ mb: 2 , fontWeight: "bold", color: 'myLightColour.main'}}>
                                            <HikingIcon/> My Leaves
                                        </Typography>
                                        <DataGrid

                                            disableColumnMenu={true}
                                            rows={leaves}
                                            columns={columnsLeaves}
                                            initialState={{
                                                pagination: {
                                                    paginationModel: {page: 1, pageSize: 5},
                                                },
                                            }}
                                            pageSizeOptions={[5, 10]}
                                            rowSelection={false}
                                            hideFooter={true}


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
                                                    fontSize: "12px",
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
                <Grid item xs={3} >
                    <Grid container  spacing={2} >
                        <Grid item xs={12}>
                            <MyCard/>
                        </Grid>
                        <Grid item xs={12}>

                            <Box sx={{ p: 2, maxWidth: '100%' }}>
                                <Paper elevation={3} sx={{p: 2, borderRadius: 2}}>
                                    <div style={{height: "auto", width: "inherit"}}>
                                        <Typography variant="h6" align="center" sx={{ mb: 2 , fontWeight: "bold", color: 'myLightColour.main'}}>
                                            <PointOfSale/> My Expenditures
                                        </Typography>
                                        <DataGrid

                                            disableColumnMenu={true}
                                            rows={expenditures}
                                            columns={columnsExpenditures}
                                            initialState={{
                                                pagination: {
                                                    paginationModel: {page: 1, pageSize: 5},
                                                },
                                            }}
                                            pageSizeOptions={[5, 10]}
                                            rowSelection={false}
                                            hideFooter={true}


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
                                                    fontSize: "12px",
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
        }/>



    );
}
