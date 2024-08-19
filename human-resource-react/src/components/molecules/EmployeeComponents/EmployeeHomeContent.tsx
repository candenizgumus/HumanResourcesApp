import React, { useEffect, useState } from 'react';
import MyCalendar, { IShift } from "../../atoms/MyCalender";
import { useDispatch } from "react-redux";
import { HumanResources, useAppSelector } from "../../../store";
import { fetchFindShiftsOfEmployee } from "../../../store/feature/shiftSlice";
import { Grid, Typography, Box } from "@mui/material";

export const EmployeeHomeContent: React.FC = () => {
    const [events, setEvents] = useState<IShift[]>([]);
    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);


    const getShiftsOfEmployee = () => {
        dispatch(fetchFindShiftsOfEmployee({ employeeId: 7, token: token })).then(data => {
            setEvents(data.payload);
        });
    };

    useEffect(() => {
        getShiftsOfEmployee();
    }, []);

    // Format the date


    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <MyCalendar events={events} isUserManager={false} />
            </Grid>
        </Grid>
    );
}
