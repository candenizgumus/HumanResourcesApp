import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {IExpenditure} from "../../models/IExpenditure";


interface IExpenditureState{
    expenditureList: IExpenditure[],
}

const initialExpenditureState:IExpenditureState = {
    expenditureList: [],
}


export interface IfetchExpenditureSave{
    token:string;
    description:string ;
    price: number

}

export const fetchExpenditureSave = createAsyncThunk(
    'expenditure/fetchExpenditureSave',
    async (payload: IfetchExpenditureSave) => {

            const response = await fetch(`http://localhost:9090/dev/v1/expenditure/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + payload.token
                },
                body: JSON.stringify({
                    'description': payload.description,
                    'price': payload.price
                })
            });
             
            return await response.json();
    }

)
interface IfetchGetAllExpenditures{
    token:string,
    page:number,
    pageSize:number,
    searchText:string
}
export const fetchGetExpendituresOfEmployee = createAsyncThunk(
    'expenditure/fetchGetExpendituresOfEmployee',
    async (payload: IfetchGetAllExpenditures) => {

        const response = await fetch(`http://localhost:9090/dev/v1/expenditure/search-by-employee-id`, {
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

const expenditureSlice = createSlice({
    name: 'expenditure',
    initialState: initialExpenditureState,
    reducers: {},
    extraReducers: (build)=>{
        build.addCase(fetchGetExpendituresOfEmployee.fulfilled,(state,action)=>{
            state.expenditureList = action.payload;
        })
    }
});

export default expenditureSlice.reducer;
export const {} = expenditureSlice.actions