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

export const EmployeeHomeContent: React.FC = () => {
    const [events, setEvents] = useState<IShift[]>([]);
    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const [assignedItemList, setAssignedItemList] = useState<IAssignedItemList[]>([]);


    const getShiftsOfEmployee = () => {
        dispatch(fetchFindShiftsOfEmployee({ employeeId: 7, token: token })).then(data => {
            setEvents(data.payload);
        });

        dispatch(fetchGetAssignedItemsOfEmployee(token)).then(data => {
            setAssignedItemList(data.payload);
        })
    };

    useEffect(() => {
        getShiftsOfEmployee();
    }, []);
    const theme = useTheme();

    const columns: GridColDef[] = [


        {field: "name", headerName: "Name", flex: 1, headerAlign: "center" ,groupable: false , sortable: false },
        {field: "assignDate", headerName: "Assignment Date", flex: 1, headerAlign: "center" ,groupable: false , sortable: false}


    ];

    return (
        <ThemeElement children={
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <MyCalendar events={events} isUserManager={false} />
                </Grid>
                <Grid item xs={3}>

                    <Box sx={{ p: 2, maxWidth: '100%' }}>
                        <Paper elevation={3} sx={{p: 2, borderRadius: 2}}>
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
                                        height: "407px",
                                    }}
                                />


                            </div>

                        </Paper>
                    </Box>

                </Grid>
                <Grid item xs={3}>
                    <MyCard/>
                </Grid>
            </Grid>
        }/>



    );
}
