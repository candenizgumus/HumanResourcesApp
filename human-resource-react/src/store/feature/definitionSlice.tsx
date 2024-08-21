import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EDefinitionType } from "../../models/IDefinitionType";
import { IRequestWithIdAndToken } from "./leaveSlice";
import RestApis from "../../config/RestApis";

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

        const response = await fetch(RestApis.definitionService+'/get-all', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            },
            body: JSON.stringify(
                payload.definitionType
            )
        });

        return await response.json();
    }

)

export interface IFetchGetDefinitionsWithPage {
    token: string;
    definitionType: EDefinitionType ;
    page: number;
    pageSize: number;
    searchText: string;
}
export const fetchGetDefinitionsWithPage = createAsyncThunk(
    'leave/fetchGetDefinitionsWithPage',
    async (payload: IFetchGetDefinitionsWithPage) => {

        const response = await fetch(RestApis.definitionService+'/get-all-with-page', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            },
            body: JSON.stringify({
                'definitionType': payload.definitionType,
                'page': payload.page,
                'pageSize': payload.pageSize,
                'searchText': payload.searchText
            })
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

        const response = await fetch(RestApis.definitionService+'/save', {
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

        const response = await fetch(RestApis.definitionService+'/delete?id='+payload.id, {
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
        build.addCase(fetchGetDefinitionsWithPage.fulfilled,(state,action: PayloadAction<IDefinition[]>) => {
            state.definitionList = action.payload
        })
    }
});

export default definitionSlice.reducer;
export const { } = definitionSlice.actions