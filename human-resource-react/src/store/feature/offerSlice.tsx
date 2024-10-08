import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IGetOffer } from '../../models/IGetOffer';
import { IOfferList } from "../../models/IOfferList";
import { clearToken } from "./authSlice";
import RestApis from "../../config/RestApis";

// Initial state for the offer slice
const initialOfferState = {
    offers: [] as IOfferList[],
    status: 'idle',
    error: null as string | null,
    offerRowCount: 0
};

// Type guard to check if error is an instance of Error
function isError(error: unknown): error is Error {
    return error instanceof Error;
}

// Thunk for creating an offer
export const fetchCreateOffer = createAsyncThunk(
    'offer/fetchCreateOffer',
    async (payload: IGetOffer, { rejectWithValue }) => {

            const response = await fetch(RestApis.offerService+'/save', {
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
    searchText: string;
}

// Thunk for getting offers
export const fetchGetOffers = createAsyncThunk(
    'offer/fetchGetOffers',
    async (payload: fetchGetOffersPayload, { dispatch }) => {
            const response = await fetch(RestApis.offerService+'/get-all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + payload.token
                },
                body: JSON.stringify({
                    'page': payload.page,
                    'pageSize': payload.pageSize,
                    'searchText': payload.searchText
                })
            });

            if (!response.ok) {
                console.log(response)
                dispatch(clearToken());
            }

            return await response.json();

    }
);

interface fetchGetOfferCountPayload {
    token: string;
    searchText: string;
}

export const fetchGetOfferCount = createAsyncThunk(
    'offer/fetchGetOfferCount',
    async (payload: fetchGetOfferCountPayload, { dispatch }) => {
            const response = await fetch(RestApis.offerService+'/get-count', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + payload.token
                },
                body: JSON.stringify({
                    'searchText': payload.searchText
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

        const response = await fetch(RestApis.emailService+'/save', {
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

            const response = await fetch(RestApis.offerService+`/approve-offer-and-register-auth-and-user`, {
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
interface IfetchDeclineOffers {
    token: string;
    offerId: number;
}
export const fetchDeclineOffers = createAsyncThunk(
    'offer/fetchApproveOffers',
    async (payload: IfetchDeclineOffers, { dispatch }) => {

        const response = await fetch(RestApis.offerService+`/decline-offer?offerId=${payload.offerId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            }
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
            .addCase(fetchGetOfferCount.fulfilled,(state,action)=>{
                state.offerRowCount = action.payload
                console.log(action.payload);
            })
    }
});

export default offerSlice.reducer;
