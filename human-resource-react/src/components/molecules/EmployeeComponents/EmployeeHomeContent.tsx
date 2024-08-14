import React from 'react';
import MyCalendar from "../../atoms/MyCalender";
import {Grid} from "@mui/material";

export const EmployeeHomeContent: React.FC = () => {
    const events = [
        {
            title: 'Sabah Vardiyası',
            start: new Date(2024, 7, 14, 8, 0), // 14 Ağustos 2024, 08:00
            end: new Date(2024, 7, 14, 16, 0),  // 14 Ağustos 2024, 16:00
            desc: 'Bu vardiya 8 saat sürer.',
        },
        {
            title: 'Öğle Molası',
            start: new Date(2024, 7, 14, 12, 0), // 14 Ağustos 2024, 12:00
            end: new Date(2024, 7, 14, 13, 0),  // 14 Ağustos 2024, 13:00
            desc: 'Bu mola 1 saat sürer.',
        },
    ];

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <MyCalendar events={events} />;
                </Grid>
            </Grid>

        </>
        )


};
