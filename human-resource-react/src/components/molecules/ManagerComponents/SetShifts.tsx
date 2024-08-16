import React, { useEffect, useState } from 'react';
import MyCalendar, { IShift } from "../../atoms/MyCalender";
import { useDispatch } from "react-redux";
import { HumanResources, useAppSelector } from "../../../store";
import { fetchFindShiftsOfEmployee, fetchSaveShift, fetchUpdateShift, fetchDeleteShift } from "../../../store/feature/shiftSlice";
import sweetalert2 from "sweetalert2";
import Swal from "sweetalert2";

export const SetShifts: React.FC = () => {
    const [events, setEvents] = useState<IShift[]>([]);
    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const employeeId = useAppSelector((state) => state.shift.employeeId);
    const companyId = useAppSelector((state) => state.shift.companyId);

    const getShiftsOfEmployee = () => {
        dispatch(fetchFindShiftsOfEmployee({ employeeId: 7, token: token })).then(data => {
            setEvents(data.payload);
        });
    };

    useEffect(() => {
        getShiftsOfEmployee();
    }, []);

    const handleSaveEvent = (newEvent: IShift) => {
        if (newEvent.description === '' || newEvent.title === '' || newEvent.start === null || newEvent.endTime === null) {
            Swal.fire({
                title: "Error",
                text: "Please fill all the fields",
                icon: "error",
                confirmButtonText: "OK",
                confirmButtonColor: '#1976D2',
            });
            return;
        }
        dispatch(fetchSaveShift({
            token: token,
            companyId: newEvent.companyId,
            employeeId: newEvent.employeeId,
            description: newEvent.description,
            start: newEvent.start,
            endTime: newEvent.endTime,
            title: newEvent.title,
        })).then((response) => {
            setEvents(prevEvents => [...prevEvents, { ...newEvent, id: response.payload.id }]);
        }).catch((error) => {
            console.error('Failed to save the event:', error);
        });
    };

    const handleUpdateEvent = (updatedEvent: IShift) => {
        if (updatedEvent.id) {
            dispatch(fetchUpdateShift({
                token: token,
                shiftId: updatedEvent.id,
                description: updatedEvent.description,
                start: updatedEvent.start,
                endTime: updatedEvent.endTime,
                title: updatedEvent.title,
            })).then(() => {
                setEvents(prevEvents => {
                    const existingEventIndex = prevEvents.findIndex(e => e.id === updatedEvent.id);
                    if (existingEventIndex !== -1) {
                        const newEvents = [...prevEvents];
                        newEvents[existingEventIndex] = updatedEvent;
                        return newEvents;
                    }
                    return prevEvents;
                });
            }).catch((error) => {
                console.error('Failed to update the event:', error);
            });
        }
    };

    const handleDeleteEvent = (eventId: number) => {
        dispatch(fetchDeleteShift({
            token: token,
            shiftId: eventId,
        })).then(() => {
            setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
        }).catch((error) => {
            console.error('Failed to delete the event:', error);
        });
    };

    return <MyCalendar events={events} isUserManager={true} onDeleteEvent={handleDeleteEvent} onSaveEvent={handleSaveEvent} onUpdateEvent={handleUpdateEvent} companyId={companyId} employeeId={employeeId} />;
};
