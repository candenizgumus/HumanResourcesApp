import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Box, Typography, Paper } from '@mui/material';

const localizer = momentLocalizer(moment);

interface MyEvent {
    title: string;
    start: Date;
    end: Date;
    desc?: string; // description isteğe bağlıdır
}

interface MyCalendarProps {
    events: MyEvent[]; // events prop'u MyEvent dizisi olarak tanımlandı
}

const MyCalendar: React.FC<MyCalendarProps> = ({ events }) => {
    return (
        <Box sx={{ p: 2, maxWidth: '100%', overflow: 'auto' }}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Etkinlik Takvimi
                </Typography>
                <Box sx={{ height: 600 }}>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '100%' }}
                        views={['month', 'week', 'day']}
                        toolbar
                        showMultiDayTimes

                    />
                </Box>
            </Paper>
        </Box>
    );
};

export default MyCalendar;
