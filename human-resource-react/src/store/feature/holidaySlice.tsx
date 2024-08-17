// `src/store/feature/holidaySlice.ts`
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {IHoliday} from '../../models/IHoliday';
import {ICreateHoliday} from "../../models/ICreateHoliday";


const initialHolidayState = {
    holidayListAdmin: [] as IHoliday[],
    holidayListEmployee: [] as IHoliday[],
    holidayListUser: [] as IHoliday[],
    isLoading: false,
    monthlyHolidayList: [] as IHoliday[]
};

export const fetchHolidaysUser = createAsyncThunk(
    'holiday/fetchHolidaysUser',
    async (payload: string) => {
            const response = await fetch(`http://localhost:9090/dev/v1/holiday/get-holiday-by-user`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + payload
                },
            });
        return await response.json();
    }
);

export const fetchHolidaysEmployee = createAsyncThunk(
    'holiday/fetchHolidaysEmployee',
    async (token: string) => {
            const response = await fetch(`http://localhost:9090/dev/v1/holiday/get-holidays-of-company`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + token
                },
            });
        return await response.json();
    }
);

export const fetchHolidaysAdmin = createAsyncThunk(
    'holiday/fetchHolidaysAdmin',
    async (payload: string) => {
        const response = await fetch(`http://localhost:9090/dev/v1/holiday/get-holiday-by-admin`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload
            },
        });
        return await response.json();
    }
);

export const fetchCreateHolidayAdmin = createAsyncThunk(
    'holiday/createHolidayAdmin',
    async (payload: ICreateHoliday) => {

        const response = await fetch('http://localhost:9090/dev/v1/holiday/save-holiday-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + payload.token
                },
                body: JSON.stringify(
                    {
                        'holidayName': payload.holidayName,
                        'holidayType': payload.holidayType,
                        'startDate': payload.startDate,
                        'endDate': payload.endDate,
                    }
                ),
            });

        return await response.json();
    }
);

export const fetchCreateHolidayManager = createAsyncThunk(
    'holiday/createHolidayManager',
    async (payload: ICreateHoliday) => {

        const response = await fetch('http://localhost:9090/dev/v1/holiday/save-holiday-manager', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + payload.token
                },
                body: JSON.stringify(
                    {
                        'holidayName': payload.holidayName,
                        'holidayType': payload.holidayType,
                        'startDate': payload.startDate,
                        'endDate': payload.endDate,
                    }
                ),
            });

        return await response.json();
    }
);

export interface IProcessHoliday{
    token: string,
    id: number
}

export const fetchDeleteHoliday = createAsyncThunk(
    'holiday/deleteHoliday',
    async (payload: IProcessHoliday, {rejectWithValue}) => {
            const response = await fetch(`http://localhost:9090/dev/v1/holiday/delete/${payload.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + payload.token
                },
            });
        return await response.json();
    }
);

export const fetchChangeHolidayStatus = createAsyncThunk(
    'holiday/changeHolidayStatus',
    async (payload: IProcessHoliday, {rejectWithValue}) => {
            const response = await fetch(`http://localhost:9090/dev/v1/holiday/change-status/${payload.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + payload.token
                },
            });
            return await response.json();
    }
);

export const fetchGetMonthlyHolidays = createAsyncThunk(
    'holiday/changeHolidayStatus',
    async (token: string, {rejectWithValue}) => {
        const response = await fetch(`http://localhost:9090/dev/v1/holiday/get-current-months-holidays`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + token
            },
        });
        return await response.json();
    }
);



const holidaySlice = createSlice({
    name: 'holiday',
    initialState: initialHolidayState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchHolidaysUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchHolidaysUser.fulfilled, (state, action) => {
                state.holidayListUser = action.payload;
                state.isLoading = false;
                console.log('Holiday List:', state.holidayListUser);
            })
            .addCase(fetchHolidaysUser.rejected, (state, action) => {
                state.isLoading = false;
            })
            .addCase(fetchHolidaysAdmin.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchHolidaysAdmin.fulfilled, (state, action) => {
                state.holidayListAdmin = action.payload;
                state.isLoading = false;
                console.log('Holiday List By Admin:', state.holidayListAdmin);
            })
            .addCase(fetchHolidaysAdmin.rejected, (state, action) => {
                state.isLoading = false;
            })
            .addCase(fetchHolidaysEmployee.fulfilled, (state, action) => {
                state.holidayListEmployee = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchGetMonthlyHolidays.fulfilled, (state, action) => {
                state.monthlyHolidayList = action.payload;

            })
    },
});


export default holidaySlice.reducer;
export const {} = holidaySlice.actions;