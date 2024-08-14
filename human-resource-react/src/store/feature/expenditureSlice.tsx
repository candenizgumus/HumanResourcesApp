import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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
        const response = await fetch(`http://localhost:9090/dev/v1/expenditure/save`, {
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

interface IFetchDownloadFile {
    token: string,
    fileName: string

}
export const fetchDownloadFile = createAsyncThunk(
    's3/fetchDownloadFile',
    async (payload: IFetchDownloadFile) => {

        const response = await fetch(`http://localhost:9090/dev/v1/s3/download`, {
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

// export const fetchDownloadExpenditureFile = createAsyncThunk(
//     'expenditure/fetchDownloadFile',
//     async ({ email, fileName, token }: { email: string; fileName: string; token: string }) => {
//         try {
//             const response = await fetch(`http://localhost:9090/dev/v1/expenditure/download?email=${encodeURIComponent(email)}&fileName=${encodeURIComponent(fileName)}`, {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                 },
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to fetch presigned URL');
//             }

//             const presignedUrl = await response.text();

//             // Create a link to download the file
//             const link = document.createElement('a');
//             link.href = presignedUrl;
//             link.setAttribute('download', fileName); // Optional, specify the filename
//             document.body.appendChild(link);
//             link.click();
//             link.remove();
//         } catch (error) {

//         }
//     }
// );

export const fetchGetExpendituresOfManager = createAsyncThunk(
    'expenditure/fetchGetExpendituresOfManager',
    async (payload: IfetchGetAllExpenditures) => {

        const response = await fetch(`http://localhost:9090/dev/v1/expenditure/search-by-company-id`, {
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

        const response = await fetch(`http://localhost:9090/dev/v1/expenditure/approve-expenditure?id=` + payload.id, {
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

        const response = await fetch(`http://localhost:9090/dev/v1/expenditure/delete?id=` + payload.id, {
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

        const response = await fetch(`http://localhost:9090/dev/v1/expenditure/cancel?id=` + payload.id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
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