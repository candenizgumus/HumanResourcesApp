import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ILeaveType } from "./leaveSlice";

interface IInitialLeave {
    leaveTypeList: ILeaveType[]
}

const initialLeaveState: IInitialLeave = {
    leaveTypeList: []
}

export const fetchGetDLeaveTypes = createAsyncThunk(
    'leave/fetchGetDLeaveTypes',
    async (payload: string) => {

        const response = await fetch('http://localhost:9090/dev/v1/definition/get-leave-types', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload
            }
        });

        return await response.json();
    }

)
export interface IFetchSaveDefinition {
    token: string,
    definitionType: string,
    name: string,
}

export const fetchSaveDefinition = createAsyncThunk(
    'leave/fetchSaveDefinition',
    async (payload: IFetchSaveDefinition) => {

        const response = await fetch('http://localhost:9090/dev/v1/definition/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            },
            body: JSON.stringify({
                'definitionType': payload.definitionType,
                'name': payload.name,
            })
        });

        return await response.json();
    }

)

const definitionSlice = createSlice({
    name: 'definition',
    initialState: initialLeaveState,
    reducers: {},
    extraReducers: (build) => {
        build.addCase(fetchGetDLeaveTypes.fulfilled,(state,action) => {
            state.leaveTypeList = action.payload
        })
    }
});

export default definitionSlice.reducer;
export const { } = definitionSlice.actions