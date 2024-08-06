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

            const response = await fetch('http://localhost:9090/dev/v1/offer/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

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
            }).then(data => data.json());

           return response;


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
    async (payload: fetchGetOffersPayload, { dispatch }) => {

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
                console.log(response)
                dispatch(clearToken());
            }

            return await response.json();

    }
);

interface fetchSendOfferEmailPayload {
    token: string;
    offerEmail: string;
    emailText: string;
}
export const fetchSendOfferEmail = createAsyncThunk(
    'email/fetchSendOfferEmail',
    async (payload: fetchSendOfferEmailPayload, { dispatch }) => {

        const response = await fetch('http://localhost:9090/dev/v1/email/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            },
            body: JSON.stringify({
                'offerEmail': payload.offerEmail,
                'emailText': payload.emailText
            })
        });

        if (!response.ok) {
            console.log(response)
            dispatch(clearToken());
        }

        return await response.json();

    }
);

interface fetchApproveOffersPayload {
    token: string;
    offerId: number;
    ESubscriptionType: string;
}

// Thunk for approving offers
export const fetchApproveOffers = createAsyncThunk(
    'offer/fetchApproveOffers',
    async (payload: fetchApproveOffersPayload, { dispatch }) => {

            const response = await fetch(`http://localhost:9090/dev/v1/offer/approve-offer-and-register-auth-and-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + payload.token
                },body: JSON.stringify({
                    'offerId': payload.offerId,
                    'ESubscriptionType': payload.ESubscriptionType
                })
            });

            if (!response.ok) {
                dispatch(clearToken());
            }

            return await response.json();


    }
);

// Offer slice
const offerSlice = createSlice({
    name: 'offer',
    initialState: initialOfferState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGetOffers.fulfilled, (state, action: PayloadAction<IOfferList[]>) => {
                state.offers = action.payload;

            })
    }
});

export default offerSlice.reducer;
