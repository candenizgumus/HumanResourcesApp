import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
    Box,
    Typography,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
} from '@mui/material';
import { CalendarMonth } from "@mui/icons-material";
import { myLightColour } from "../../util/MyColours";
import { HumanResources, useAppSelector } from '../../store';
import { fetchGetDefinitions } from '../../store/feature/definitionSlice';
import { EDefinitionType } from '../../models/IDefinitionType';
import { useDispatch } from 'react-redux';


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
    name?: string
    surname?: string
}

const MyCalendar: React.FC<MyCalendarProps> = ({ events, onSaveEvent, onUpdateEvent, onDeleteEvent, companyId, employeeId, isUserManager, name, surname }) => {
    const [selectedEvent, setSelectedEvent] = useState<IShift | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const leaveTypes = useAppSelector((state) => state.definition.definitionList);
    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
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

    useEffect(() => {
        dispatch(fetchGetDefinitions({
            token: token,
            definitionType: EDefinitionType.LEAVE_TYPE
        }))
    }, [dispatch, token]);

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
            <Box sx={{ height: 600 }}>
    <Calendar
        localizer={localizer}
        events={events.map(event => ({
            ...event,
            start: new Date(event.start),  // Date object
            end: new Date(event.endTime),  // Date object
            isImportant: leaveTypes.some(leaveType => leaveType.name === event.title), 
        }))}
        startAccessor={(event) => new Date(event.start.toString())}
        endAccessor={(event) => new Date(event.end.toString())}
        style={{ height: '100%' }}
        views={['month', 'week', 'day']}
        toolbar
        showMultiDayTimes
        eventPropGetter={(event) => {
            const backgroundColor = event.isImportant ? 'red' : 'green';  // Important events are red, others are green
            return { style: { backgroundColor } };
        }}
        selectable={isUserManager}
        onSelectEvent={(event) => {
            if (!event.isImportant && isUserManager) {
                handleSelectEvent(event);
            }
        }}
        onSelectSlot={(slotInfo) => {
            const importantEvent = events.some(event => 
                leaveTypes.some(leaveType => leaveType.name === event.title)
            );
            // Allow manager to add events by clicking on calendar slots
            if (isUserManager) {
                handleSelectSlot(slotInfo);
            }
        }}
    />
</Box>


            <Dialog open={isModalOpen} onClose={handleClose} fullWidth maxWidth="sm">
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
                    <Button onClick={handleClose} variant='contained' color="warning" sx={{ marginRight: '17px', width: '100px' }}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} variant='contained' color="success" sx={{ marginRight: '17px', width: '100px' }}>
                        Save
                    </Button>
                    {selectedEvent?.id && (
                        <Button onClick={handleDelete} variant='contained' color="error" sx={{ marginRight: '17px', width: '100px' }}>
                            Delete
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    )
}

export default MyCalendar;
