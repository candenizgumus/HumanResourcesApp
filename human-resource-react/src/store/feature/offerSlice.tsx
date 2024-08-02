import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import { IGetOffer } from '../../models/IGetOffer';
import {IOfferList} from "../../models/IOfferList";
import {useDispatch} from "react-redux";
import {clearToken} from "./authSlice";

const initialOfferState = {
    offers: [] as IOfferList[],
    status: 'idle',
    error: null as string | null
};

export const fetchCreateOffer = createAsyncThunk(
    'offer/fetchCreateOffer',
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
                    'numberOfEmployees': payload.numberOfEmployees,
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

interface fetchGetOffersPayload {
    token: string;
    page: number;
    pageSize: number;
}
export const fetchGetOffers = createAsyncThunk(
    'offer/fetchGetOffers',
    async (payload: fetchGetOffersPayload) => {


        const response = await fetch('http://localhost:9090/dev/v1/offer/get-all', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token // Adding Bearer token
            }, body: JSON.stringify({

                'page': payload.page,
                'pageSize': payload.pageSize,

            })
        }).then(data => data.json());

        return response;

    }

);
interface fetchApproveOffers {
    token: string;
    offerId: number;

}
export const fetchApproveOffers = createAsyncThunk(
    'offer/fetchApproveOffers',
    async (payload: fetchApproveOffers) => {


        const response = await fetch('http://localhost:9090/dev/v1/offer/approve-offer-and-register-auth-and-user?offerId='+payload.offerId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token // Adding Bearer token
            }
        }).then(data => data.json());

        return response;

    }

);


const offerSlice = createSlice({
    name: 'offer',
    initialState: initialOfferState,
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
            })
            .addCase(fetchGetOffers.fulfilled, (state, action: PayloadAction<IOfferList[]>) => {
                state.offers = action.payload;
                state.status = 'ACTIVE';
            })
            .addCase(fetchGetOffers.rejected, (state, action) => {
                const dispatch = useDispatch();
                dispatch(clearToken())
            })
            .addCase(fetchApproveOffers.fulfilled, (state, action: PayloadAction<IOfferList[]>) => {

            })
            .addCase(fetchApproveOffers.rejected, (state, action) => {
                const dispatch = useDispatch();
                dispatch(clearToken())
            })

    }
});

export default offerSlice.reducer;