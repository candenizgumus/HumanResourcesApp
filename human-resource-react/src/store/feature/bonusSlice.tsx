import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {IBonus} from "../../models/IBonus";

interface IBonusState{
    bonusList:IBonus[]
}

const initialBonusState:IBonusState = {
    bonusList: []
}


export interface IfetchSaveBonus{
    token:string;
    description:string ;
    bonusDate: Date;
    bonusAmount: number;
    employeeId: number;

}

export const fetchSaveBonus = createAsyncThunk(
    'bonus/fetchSaveBonus',
    async (payload: IfetchSaveBonus) => {

            const response = await fetch(`http://localhost:9090/dev/v1/bonus/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + payload.token
                },
                body: JSON.stringify({
                    'description': payload.description,
                    'bonusDate': payload.bonusDate,
                    'bonusAmount': payload.bonusAmount,
                    'employeeId': payload.employeeId

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
export const fetchGetBonusesOfManager = createAsyncThunk(
    'bonus/fetchGetBonusesOfManager',
    async (payload: IfetchGetPayments) => {

        const response = await fetch(`http://localhost:9090/dev/v1/bonus/get-all`, {
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

export const fetchGetBonusesOfEmployee = createAsyncThunk(
    'bonus/fetchGetBonusesOfEmployee',
    async (payload: IfetchGetPayments) => {

        const response = await fetch(`http://localhost:9090/dev/v1/bonus/get-all-bonuses-of-employee`, {
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
interface IfetchDeleteBonus{
    token:string,
    id:number
}
export const fetchDeleteBonus = createAsyncThunk(
    'bonus/fetchGetBonusesOfManager',
    async (payload: IfetchDeleteBonus) => {

        const response = await fetch(`http://localhost:9090/dev/v1/bonus/delete?id=` + payload.id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            }
        });

        return await response.json();
    }

)





const bonusSlice = createSlice({
    name: 'bonus',
    initialState: initialBonusState,
    reducers: {},
    extraReducers: (build)=>{
        build.addCase(fetchGetBonusesOfManager.fulfilled,(state,action)=>{
            state.bonusList = action.payload
        })
        build.addCase(fetchGetBonusesOfEmployee.fulfilled,(state,action)=>{
            state.bonusList = action.payload
        })

    }
});

export default bonusSlice.reducer;
export const {} = bonusSlice.actions