import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Box, Typography, Paper, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';

const localizer = momentLocalizer(moment);

export interface IShift {
    id: number;
    employeeId: number;
    companyId: number;
    title: string;
    start: Date;
    endTime: Date;
    description: string;
}

interface MyCalendarProps {
    events: IShift[];
    onUpdateEvent: (updatedEvent: IShift) => void;
}

const MyCalendar: React.FC<MyCalendarProps> = ({ events, onUpdateEvent }) => {
    const [selectedEvent, setSelectedEvent] = useState<IShift | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSelectEvent = (event: IShift) => {
        setSelectedEvent(event); // Seçilen etkinlik bilgilerini state'e atar
        setIsModalOpen(true); // Modalı açar
    };

    const handleClose = () => {
        setIsModalOpen(false); // Modalı kapatır
        setSelectedEvent(null); // Seçilen etkinliği temizler
    };

    const handleSave = () => {
        if (selectedEvent) {
            if (selectedEvent.id) {
                // Güncellenmiş etkinliği güncelle
                onUpdateEvent(selectedEvent);
            } else {
                // Yeni etkinliği ekle (burada `onUpdateEvent` ile yeni bir etkinlik ekleme fonksiyonu kullanılabilir)
                const newEvent = { ...selectedEvent, id: events.length + 1 };
                onUpdateEvent(newEvent);
            }
        }
        handleClose(); // Modalı kapat
    };



    const handleChange = (field: keyof IShift, value: string | Date) => {
        if (selectedEvent) {
            setSelectedEvent({ ...selectedEvent, [field]: value }); // Değişiklikleri state'e kaydeder
        }
    };
    const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
        const newEvent: IShift = {
            id: events.length + 1, // Yeni bir ID veriyoruz
            employeeId: 1, // Varsayılan bir employeeId atayabilirsiniz
            companyId: 1, // Varsayılan bir companyId atayabilirsiniz
            title: 'Yeni Vardiya', // Varsayılan başlık
            start: slotInfo.start, // Seçilen başlangıç zamanı
            endTime: slotInfo.end, // Seçilen bitiş zamanı
            description: '', // Varsayılan açıklama
        };

        setSelectedEvent(newEvent); // Yeni etkinliği seçili olarak ayarla
        setIsModalOpen(true); // Modalı aç
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
                            events={events}
                            startAccessor="start"
                            endAccessor="endTime"
                            style={{ height: '100%' }}
                            views={['month', 'week', 'day']}
                            toolbar
                            showMultiDayTimes
                            onSelectEvent={handleSelectEvent} // Etkinlik tıklama için event handler
                            onSelectSlot={handleSelectSlot} // Boş güne tıklama için event handler
                            selectable // Boş güne tıklama özelliğini aktif et
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
                        onChange={(e) => handleChange('title', e.target.value)} // Başlık değişikliğini yakalar
                    />
                    <TextField
                        label="Açıklama"
                        fullWidth
                        margin="dense"
                        value={selectedEvent?.description || ''}
                        onChange={(e) => handleChange('description', e.target.value)} // Açıklama değişikliğini yakalar
                    />
                    <TextField
                        label="Başlangıç Tarihi"
                        type="datetime-local"
                        fullWidth
                        margin="dense"
                        value={selectedEvent?.start ? moment(selectedEvent.start).format('YYYY-MM-DDTHH:mm') : ''}
                        onChange={(e) => handleChange('start', new Date(e.target.value))} // Başlangıç tarihi değişikliğini yakalar
                    />
                    <TextField
                        label="Bitiş Tarihi"
                        type="datetime-local"
                        fullWidth
                        margin="dense"
                        value={selectedEvent?.endTime ? moment(selectedEvent.endTime).format('YYYY-MM-DDTHH:mm') : ''}
                        onChange={(e) => handleChange('endTime', new Date(e.target.value))} // Bitiş tarihi değişikliğini yakalar
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        İptal
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Kaydet
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default MyCalendar;
