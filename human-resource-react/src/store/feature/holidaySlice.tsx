// `src/store/feature/holidaySlice.ts`
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {IHoliday} from '../../models/IHoliday';
import {ICreateHoliday} from "../../models/ICreateHoliday";


const initialHolidayState = {
    holidayList: [] as IHoliday[],
    isLoading: false
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

export const fetchCreateHoliday = createAsyncThunk(
    'holiday/createHoliday',
    async (payload: ICreateHoliday, {rejectWithValue}) => {
        console.log(payload)
        try {
            const response = await fetch('http://localhost:9090/dev/v1/holiday/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        'holidayName': payload.holidayName,
                        'holidayType': payload.holidayType,
                        'holidayStartDate': payload.holidayStartDate,
                        'holidayEndDate': payload.holidayEndDate,
                    }
                ),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('API Response:', data); // Log the response
            return data;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const fetchDeleteHoliday = createAsyncThunk(
    'holiday/deleteHoliday',
    async (id: number, {rejectWithValue}) => {
        try {
            const response = await fetch(`http://localhost:9090/dev/v1/holiday/delete/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('API Response:', data); // Log the response
            return data;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
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
                state.holidayList = action.payload;
                state.isLoading = false;
                console.log('Holiday List:', state.holidayList); // Log the holiday list
            })
            .addCase(fetchHolidaysUser.rejected, (state, action) => {
                state.isLoading = false;
            })
            .addCase(fetchHolidaysAdmin.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchHolidaysAdmin.fulfilled, (state, action) => {
                state.holidayList = action.payload;
                state.isLoading = false;
                console.log('Holiday List By Admin:', state.holidayList); // Log the holiday list
            })
            .addCase(fetchHolidaysAdmin.rejected, (state, action) => {
                state.isLoading = false;
            })
    },
});


export default holidaySlice.reducer;
export const {} = holidaySlice.actions;