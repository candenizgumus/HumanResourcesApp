import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Box, Typography, Paper, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';

const localizer = momentLocalizer(moment);

export interface IShift {
    id?: number;
    employeeId: number;
    companyId: number;
    title: string;
    start: Date;
    endTime: Date;
    description: string;
}

interface MyCalendarProps {
    events: IShift[];
    onSaveEvent?: (newEvent: IShift) => void;  // Yeni etkinliği kaydetme için
    onUpdateEvent?: (updatedEvent: IShift) => void; // Mevcut etkinliği güncelleme için
    onDeleteEvent?: (eventId: number) => void;
    companyId?: number;
    employeeId?: number;
    isUserManager: boolean;
}

const MyCalendar: React.FC<MyCalendarProps> = ({ events, onSaveEvent, onUpdateEvent, onDeleteEvent, companyId, employeeId, isUserManager }) => {
    const [selectedEvent, setSelectedEvent] = useState<IShift | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSelectEvent = (event: IShift) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    const handleSave = () => {
        if (selectedEvent) {
            if (selectedEvent.id) {
                if (onUpdateEvent) {
                    onUpdateEvent(selectedEvent);
                } // Eğer id varsa, güncelleme işlemi
            } else {
                if (onSaveEvent) {
                    onSaveEvent(selectedEvent);
                } // Eğer id yoksa, yeni etkinlik kaydetme
            }
        }
        handleClose();
    };

    const handleDelete = () => {
        if (selectedEvent && selectedEvent.id) {
            if (onDeleteEvent) {
                onDeleteEvent(selectedEvent.id);
            }
            handleClose();
        }
    };

    const handleChange = (field: keyof IShift, value: string | Date) => {
        if (selectedEvent) {
            setSelectedEvent({ ...selectedEvent, [field]: value });
        }
    };

    const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
        const newEvent: IShift = {
            employeeId: employeeId || 1,
            companyId: companyId || 1,
            title: 'Yeni Vardiya',
            start: slotInfo.start,  // Doğrudan Date objesini kullanın
            endTime: slotInfo.end,  // Doğrudan Date objesini kullanın
            description: '',
        };

        setSelectedEvent(newEvent);
        setIsModalOpen(true);
    };

    return (
        <>
            <Box sx={{ p: 2, maxWidth: '100%', overflow: 'auto' }}>
                <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        My Events
                    </Typography>
                    <Box sx={{ height: 600 }}>
                        <Calendar
                            localizer={localizer}
                            events={events.map(event => ({
                                ...event,
                                start: new Date(event.start),  // Date objesi
                                end: new Date(event.endTime),   // Date objesi
                            }))}
                            startAccessor={(event) => new Date(event.start.toString())}
                            endAccessor={(event) => new Date(event.end.toString())}
                            style={{ height: '100%' }}
                            views={['month', 'week', 'day']}
                            toolbar
                            showMultiDayTimes
                            selectable={isUserManager} // isUserManager true ise seçilebilir yap
                            {...(isUserManager ? { onSelectEvent: handleSelectEvent, onSelectSlot: handleSelectSlot } : {})} // isUserManager true ise onSelectEvent ve onSelectSlot prop'larını ekle
                        />
                    </Box>
                </Paper>
            </Box>

            <Dialog open={isModalOpen} onClose={handleClose}>
                <DialogTitle>Etkinliği Düzenle</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Başlık"
                        fullWidth
                        margin="dense"
                        value={selectedEvent?.title || ''}
                        onChange={(e) => handleChange('title', e.target.value)}
                    />
                    <TextField
                        label="Açıklama"
                        fullWidth
                        margin="dense"
                        value={selectedEvent?.description || ''}
                        onChange={(e) => handleChange('description', e.target.value)}
                    />
                    <TextField
                        label="Başlangıç Tarihi"
                        type="datetime-local"
                        fullWidth
                        margin="dense"
                        value={selectedEvent?.start ? moment(selectedEvent.start).format('YYYY-MM-DDTHH:mm') : ''}
                        onChange={(e) => handleChange('start', new Date(e.target.value))}
                    />
                    <TextField
                        label="Bitiş Tarihi"
                        type="datetime-local"
                        fullWidth
                        margin="dense"
                        value={selectedEvent?.endTime ? moment(selectedEvent.endTime).format('YYYY-MM-DDTHH:mm') : ''}
                        onChange={(e) => handleChange('endTime', new Date(e.target.value))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                    {selectedEvent?.id && (
                        <Button onClick={handleDelete} color="secondary">
                            Delete
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
};

export default MyCalendar;
