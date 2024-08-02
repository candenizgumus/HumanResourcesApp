// `src/store/feature/holidaySlice.ts`
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface IHolidayResponse {
    id: number;
    holidayName: string;
    holidayType: string;
    holidayDate: number;
    holidayStartDate: number;
    holidayEndDate: number;
}

interface HolidayState {
    holidayList: IHolidayResponse[];
    isLoading: boolean;
}

const initialState: HolidayState = {
    holidayList: [],
    isLoading: false
};

export const fetchHolidays = createAsyncThunk(
    'holiday/fetchHolidays',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('http://localhost:9090/dev/v1/holiday/get-all');
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
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchHolidays.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchHolidays.fulfilled, (state, action) => {
                state.holidayList = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchHolidays.rejected, (state, action) => {
                state.isLoading = false;
            });
    },
});

export default holidaySlice.reducer;
export const {} = holidaySlice.actions;