import React, {useEffect, useState} from 'react';
import MyCalendar, {IShift} from "../../atoms/MyCalender";
import {useDispatch} from "react-redux";
import {HumanResources, useAppSelector} from "../../../store";
import {fetchFindShiftsOfEmployee, fetchSaveShift} from "../../../store/feature/shiftSlice";


export const EmployeeHomeContent: React.FC = () => {
    const [events, setEvents] = useState<IShift[]>([]);
    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);

    const getShiftsOfEmployee = () => {
        dispatch(fetchFindShiftsOfEmployee({employeeId: 7, token: token})).then(data => {
            setEvents(data.payload);
        });
    };

    useEffect(() => {
        getShiftsOfEmployee();
    }, []);

    const handleUpdateEvent = (updatedEvent: IShift) => {
        // Dispatch the save action to save the updated event
        dispatch(fetchSaveShift({
            token: token,
            companyId: 1,
            employeeId: 7,
            description: updatedEvent.description,
            start: updatedEvent.start,
            endTime: updatedEvent.endTime,
            title: updatedEvent.title,
        })).then(() => {
            // Update the local state only if the save operation is successful
            setEvents(prevEvents => {
                const existingEventIndex = prevEvents.findIndex(e => e.id === updatedEvent.id);
                if (existingEventIndex !== -1) {
                    // Update the existing event
                    const newEvents = [...prevEvents];
                    newEvents[existingEventIndex] = updatedEvent;
                    return newEvents;
                } else {
                    // Add the new event
                    return [...prevEvents, updatedEvent];
                }
            });
        }).catch((error) => {
            console.error('Failed to save the event:', error);
            // Handle error appropriately (e.g., show an error message)
        });
    };

    return <MyCalendar events={events} onUpdateEvent={handleUpdateEvent} />;
};
