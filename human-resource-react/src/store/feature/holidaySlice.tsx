// `src/store/feature/holidaySlice.ts`
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {IHoliday} from '../../models/IHoliday';
import {ICreateHoliday} from "../../models/ICreateHoliday";


const initialHolidayState = {
    holidayList: [] as IHoliday[],
    isLoading: false
};

export const fetchHolidays = createAsyncThunk(
    'holiday/fetchHolidays',
    async (_, {rejectWithValue}) => {
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
            .addCase(fetchHolidays.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchHolidays.fulfilled, (state, action) => {
                state.holidayList = action.payload;
                state.isLoading = false;
                console.log('Holiday List:', state.holidayList); // Log the holiday list
            })
            .addCase(fetchHolidays.rejected, (state, action) => {
                state.isLoading = false;
            })

    },
});


export default holidaySlice.reducer;
export const {} = holidaySlice.actions;