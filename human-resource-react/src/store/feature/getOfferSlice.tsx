import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IGetOffer } from '../../models/IGetOffer';

const initialGetOfferState = {
    offers: [],
    status: 'idle',
    //token: '',
    error: null as string | null
};

export const fetchCreateOffer = createAsyncThunk(
    'getOffer/fetchCreateOffer',
    async (payload: IGetOffer) => {
        console.log('Payload:', payload);
        try {
            //const token = 'your-bearer-token'; // Replace this with your actual token

            const response = await fetch('http://localhost:9090/dev/v1/offer/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer `+ payload.token // Adding Bearer token
                },
                body: JSON.stringify({
                    'name': payload.name,
                    'surname': payload.surname,
                    'email': payload.email,
                    'phone': payload.phone,
                    'title': payload.title,
                    'numberOfEmployee': payload.numberOfEmployee,
                    'companyName': payload.companyName
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseText = await response.text();
            try {
                return JSON.parse(responseText);
            } catch (err) {
                console.error('Failed to parse JSON:', responseText);
                throw new Error('Invalid JSON response');
            }
        } catch (err) {
            console.log('Error:', err);
            throw err;
        }
    }
);

const getOfferSlice = createSlice({
    name: 'getOffer',
    initialState: initialGetOfferState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCreateOffer.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCreateOffer.fulfilled, (state, action) => {
                //state.token = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchCreateOffer.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? null;
            });
    }
});

export default getOfferSlice.reducer;