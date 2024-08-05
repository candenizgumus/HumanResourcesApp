import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IGetOffer } from '../../models/IGetOffer';
import { IOfferList } from "../../models/IOfferList";
import { clearToken } from "./authSlice";

// Initial state for the offer slice
const initialOfferState = {
    offers: [] as IOfferList[],
    status: 'idle',
    error: null as string | null
};

// Type guard to check if error is an instance of Error
function isError(error: unknown): error is Error {
    return error instanceof Error;
}

// Thunk for creating an offer
export const fetchCreateOffer = createAsyncThunk(
    'offer/fetchCreateOffer',
    async (payload: IGetOffer, { rejectWithValue }) => {
        try {
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
                    'numberOfEmployees': payload.numberOfEmployees,
                    'companyName': payload.companyName,
                    'sector': payload.sector
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
            if (isError(err)) {
                return rejectWithValue(err.message);
            } else {
                return rejectWithValue('An unknown error occurred');
            }
        }
    }
);

interface fetchGetOffersPayload {
    token: string;
    page: number;
    pageSize: number;
    email: string;
}

// Thunk for getting offers
export const fetchGetOffers = createAsyncThunk(
    'offer/fetchGetOffers',
    async (payload: fetchGetOffersPayload, { dispatch, rejectWithValue }) => {
        try {
            const response = await fetch('http://localhost:9090/dev/v1/offer/get-all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + payload.token
                },
                body: JSON.stringify({
                    'page': payload.page,
                    'pageSize': payload.pageSize,
                    'email': payload.email
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (err) {
            console.log('Error:', err);
            dispatch(clearToken());
            if (isError(err)) {
                return rejectWithValue(err.message);
            } else {
                return rejectWithValue('An unknown error occurred');
            }
        }
    }
);

interface fetchApproveOffersPayload {
    token: string;
    offerId: number;
}

// Thunk for approving offers
export const fetchApproveOffers = createAsyncThunk(
    'offer/fetchApproveOffers',
    async (payload: fetchApproveOffersPayload, { dispatch, rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:9090/dev/v1/offer/approve-offer-and-register-auth-and-user?offerId=${payload.offerId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + payload.token
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (err) {
            console.log('Error:', err);
            dispatch(clearToken());
            if (isError(err)) {
                return rejectWithValue(err.message);
            } else {
                return rejectWithValue('An unknown error occurred');
            }
        }
    }
);

// Offer slice
const offerSlice = createSlice({
    name: 'offer',
    initialState: initialOfferState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCreateOffer.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCreateOffer.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(fetchCreateOffer.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchGetOffers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchGetOffers.fulfilled, (state, action: PayloadAction<IOfferList[]>) => {
                state.offers = action.payload;
                state.status = 'ACTIVE';
            })
            .addCase(fetchGetOffers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchApproveOffers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchApproveOffers.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(fetchApproveOffers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    }
});

export default offerSlice.reducer;
