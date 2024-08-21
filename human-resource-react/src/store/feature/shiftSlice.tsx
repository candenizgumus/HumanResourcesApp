import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {IShift} from "../../components/atoms/MyCalender";
import RestApis from "../../config/RestApis";

interface shiftState{
    shiftList:IShift[]
    employeeId:number,
    companyId:number,
    name:string,
    surname:string
}

const initialShiftState:shiftState = {
    shiftList: [],
    employeeId:0,
    companyId:0,
    name:'',
    surname:''
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

            const response = await fetch(RestApis.shiftService+`/save`, {
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

export interface IfetchUpdateShift{
    token:string;
    shiftId:number,
    description:string,
    start:Date,
    endTime:Date,
    title:string

}

export const fetchUpdateShift = createAsyncThunk(
    'shift/fetchUpdateShift',
    async (payload: IfetchUpdateShift) => {

        const response = await fetch(RestApis.shiftService+`/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            },
            body: JSON.stringify({
                'shiftId': payload.shiftId,
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

        const response = await fetch(RestApis.shiftService+`/get-all?employeeId=` + payload.employeeId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            }
        });

        return await response.json();
    }

)

interface IfetchDeleteShift{
    token:string,
    shiftId:number,
}
export const fetchDeleteShift = createAsyncThunk(
    'shift/fetchFindShiftsOfEmployee',
    async (payload: IfetchDeleteShift) => {

        const response = await fetch(RestApis.shiftService+`/delete?id=` + payload.shiftId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            }
        });


    }

)

const shiftSlice = createSlice({
    name: 'shift',
    initialState: initialShiftState,
    reducers: {
        setEmployeeIdAndCompanyId:(state,action)=>{

            state.employeeId = action.payload.employeeId
            state.companyId = action.payload.companyId
            state.name = action.payload.name
            state.surname = action.payload.surname
        }
    },
    extraReducers: (build)=>{
      build.addCase(fetchFindShiftsOfEmployee.fulfilled,(state,action)=>{

        state.shiftList = action.payload;
      })

    }
});

export default shiftSlice.reducer;
export const {setEmployeeIdAndCompanyId} = shiftSlice.actions