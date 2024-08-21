import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {IPayment} from "../../models/IPayment";
import RestApis from "../../config/RestApis";



interface IPaymentState{
    paymentList: IPayment[],
    currentMonthsPayments: IPayment[]
}

const initialPaymentState:IPaymentState = {
    paymentList: [],
    currentMonthsPayments: []
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

            const response = await fetch(RestApis.paymentService+`/save`, {
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

        const response = await fetch(RestApis.paymentService+`/get-all`, {
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
interface IfetchDeletePayment{
    token:string,
    id:number,

}
export const fetchDeletePayment = createAsyncThunk(
    'payment/IfetchDeletePayment',
    async (payload: IfetchDeletePayment) => {

        const response = await fetch(RestApis.paymentService+`/delete?id=`+ payload.id , {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            }
        });

        return await response.json();
    }

)

export const fetchMonthlyPayments = createAsyncThunk(
    'payment/IfetchDeletePayment',
    async (token: string) => {

        const response = await fetch(RestApis.paymentService+`/get-monthly-payments` , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + token
            }
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
        build.addCase(fetchMonthlyPayments.fulfilled,(state,action)=>{
            state.currentMonthsPayments = action.payload;
        })

    }
});

export default paymentSlice.reducer;
export const {} = paymentSlice.actions