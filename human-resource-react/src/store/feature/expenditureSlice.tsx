import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import RestApis from "../../config/RestApis";
import { IExpenditure } from "../../models/IExpenditure";


interface IExpenditureState {
    expenditureList: IExpenditure[],
    url: string
}

const initialExpenditureState: IExpenditureState = {
    expenditureList: [],
    url: ''
}


export interface IfetchExpenditureSave {
    token: string;
    description: string;
    price: number;
    files: File[];

}

export const fetchExpenditureSave = createAsyncThunk(
    'expenditure/fetchExpenditureSave',
    async (payload: IfetchExpenditureSave) => {
        const formData = new FormData();
        formData.append('description', payload.description);
        formData.append('price', payload.price.toString());

        payload.files.forEach(file => {
            formData.append('files', file);
        });
        const response = await fetch(RestApis.expenditureService+`/save`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ` + payload.token
            },
            body: formData
        });
        return await response.json();
    }
)

interface IfetchGetAllExpenditures {
    token: string,
    page: number,
    pageSize: number,
    searchText: string
}
export const fetchGetExpendituresOfEmployee = createAsyncThunk(
    'expenditure/fetchGetExpendituresOfEmployee',
    async (payload: IfetchGetAllExpenditures) => {

        const response = await fetch(RestApis.expenditureService+`/search-by-employee-id`, {
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

interface IFetchDownloadFile {
    token: string,
    fileName: string

}
export const fetchDownloadFile = createAsyncThunk(
    's3/fetchDownloadFile',
    async (payload: IFetchDownloadFile) => {

        const response = await fetch(RestApis.s3Service+`/download`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            },
            body: JSON.stringify({
                fileName: payload.fileName
            })
        });
        return await response.json();
    }
)


export const fetchGetExpendituresOfManager = createAsyncThunk(
    'expenditure/fetchGetExpendituresOfManager',
    async (payload: IfetchGetAllExpenditures) => {

        const response = await fetch(RestApis.expenditureService+`/search-by-company-id`, {
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
interface IfetchApproveExpenditure {
    token: string,
    id: number
}
export const fetchApproveExpenditure = createAsyncThunk(
    'expenditure/approveExpenditure',
    async (payload: IfetchApproveExpenditure) => {

        const response = await fetch(RestApis.expenditureService+`/approve-expenditure?id=` + payload.id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            }
        });

        return await response.json();
    }

)

interface IfetchApproveExpenditure {
    token: string,
    id: number
}
export const fetchDeleteExpenditure = createAsyncThunk(
    'expenditure/fetchDeleteExpenditure',
    async (payload: IfetchApproveExpenditure) => {

        const response = await fetch(RestApis.expenditureService+`/delete?id=` + payload.id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            }
        });

        return await response.json();
    }

)

export const fetchCancelExpenditure = createAsyncThunk(
    'expenditure/fetchCancelExpenditure',
    async (payload: IfetchApproveExpenditure) => {

        const response = await fetch(RestApis.expenditureService+`/cancel?id=` + payload.id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            }
        });

        return await response.json();
    }

)

export const fetchGetAllExpendituresOfEmployeeByCurrentMonth = createAsyncThunk(
    'expenditure/fetchCancelExpenditure',
    async (payload: string) => {

        const response = await fetch(RestApis.expenditureService+`/get-all-expenditures-of-employee-by-current-month`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload
            }
        });

        return await response.json();
    }

)



const expenditureSlice = createSlice({
    name: 'expenditure',
    initialState: initialExpenditureState,
    reducers: {},
    extraReducers: (build) => {
        build.addCase(fetchGetExpendituresOfEmployee.fulfilled, (state, action) => {
            state.expenditureList = action.payload;
        })
        build.addCase(fetchGetExpendituresOfManager.fulfilled, (state, action) => {
            state.expenditureList = action.payload;
        })
        build.addCase(fetchDownloadFile.fulfilled, (state, action) => {
            state.url = action.payload.url;
        })
    }
});

export default expenditureSlice.reducer;
export const { } = expenditureSlice.actions