import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { EDefinitionType } from "../../models/IDefinitionType";
import { IRequestWithIdAndToken } from "./leaveSlice";

interface IInitialLeave {
    definitionList: IDefinition[]
}
export interface IDefinition {
    id: number,
    name: string,
    definitionType: EDefinitionType,
    companyId: number
}

const initialLeaveState: IInitialLeave = {
    definitionList: []
}
export interface IFetchGetDefinitions {
    token: string;
    definitionType: EDefinitionType ;
}
export const fetchGetDefinitions = createAsyncThunk(
    'leave/fetchGetDefinitions',
    async (payload: IFetchGetDefinitions) => {

        const response = await fetch('http://localhost:9090/dev/v1/definition/get-all', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            },
            body: JSON.stringify(
               payload.definitionType,
            )
        });

        return await response.json();
    }

)
export interface IFetchSaveDefinition {
    token: string,
    definitionType: EDefinitionType,
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

export const fetchDeleteDefinition = createAsyncThunk(
    'leave/fetchDeleteDefinition',
    async (payload: IRequestWithIdAndToken) => {

        const response = await fetch('http://localhost:9090/dev/v1/definition/delete?id='+payload.id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            }
        });

        return await response.json();
    }

)

const definitionSlice = createSlice({
    name: 'definition',
    initialState: initialLeaveState,
    reducers: {},
    extraReducers: (build) => {
        build.addCase(fetchGetDefinitions.fulfilled,(state,action) => {
            state.definitionList = action.payload
        })
    }
});

export default definitionSlice.reducer;
export const { } = definitionSlice.actions