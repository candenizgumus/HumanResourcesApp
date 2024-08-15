import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {IShift} from "../../components/atoms/MyCalender";

interface shiftState{
    shiftList:IShift[]
}

const initialShiftState:shiftState = {
    shiftList: []
}


export interface IfetchSaveShift{
    token:string;
    companyId:number,
    employeeId:number,
    description:string,
    start:Date,
    endTime:Date,
    title:string

}

export const fetchSaveShift = createAsyncThunk(
    'shift/fetchSaveShift',
    async (payload: IfetchSaveShift) => {

            const response = await fetch(`http://localhost:9090/dev/v1/shift/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + payload.token
                },
                body: JSON.stringify({
                    'companyId': payload.companyId,
                    'employeeId': payload.employeeId,
                    'description': payload.description,
                    'start': payload.start,
                    'endTime': payload.endTime,
                    'title': payload.title,

                })
            });
             
            return await response.json();
    }

)
interface IfetchFindShiftsOfEmployee{
    token:string,
    employeeId:number,
}
export const fetchFindShiftsOfEmployee = createAsyncThunk(
    'shift/fetchFindShiftsOfEmployee',
    async (payload: IfetchFindShiftsOfEmployee) => {

        const response = await fetch(`http://localhost:9090/dev/v1/shift/get-all?employeeId=` + payload.employeeId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            }
        });

        return await response.json();
    }

)

const shiftSlice = createSlice({
    name: 'bonus',
    initialState: initialShiftState,
    reducers: {},
    extraReducers: (build)=>{
      build.addCase(fetchFindShiftsOfEmployee.fulfilled,(state,action)=>{

        state.shiftList = action.payload;
      })

    }
});

export default shiftSlice.reducer;
export const {} = shiftSlice.actions