import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {IPayment} from "../../models/IPayment";



interface IPaymentState{
    paymentList: IPayment[],
}

const initialPaymentState:IPaymentState = {
    paymentList: [],
}


export interface IfetchPaymentSave{
    token:string;
    description:string ;
    payment: number;
    paymentDate: Date;

}

export const fetchPaymentSave = createAsyncThunk(
    'payment/fetchPaymentSave',
    async (payload: IfetchPaymentSave) => {

            const response = await fetch(`http://localhost:9090/dev/v1/payment/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + payload.token
                },
                body: JSON.stringify({
                    'description': payload.description,
                    'payment': payload.payment,
                    'paymentDate': payload.paymentDate

                })
            });
             
            return await response.json();
    }

)
interface IfetchGetPayments{
    token:string,
    page:number,
    pageSize:number,
    searchText:string
}
export const fetchGetPayments = createAsyncThunk(
    'payment/fetchGetPayments',
    async (payload: IfetchGetPayments) => {

        const response = await fetch(`http://localhost:9090/dev/v1/payment/get-all`, {
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

        return await response.json();
    }

)




const paymentSlice = createSlice({
    name: 'payment',
    initialState: initialPaymentState,
    reducers: {},
    extraReducers: (build)=>{
        build.addCase(fetchGetPayments.fulfilled,(state,action)=>{
            state.paymentList = action.payload;
        })

    }
});

export default paymentSlice.reducer;
export const {} = paymentSlice.actions