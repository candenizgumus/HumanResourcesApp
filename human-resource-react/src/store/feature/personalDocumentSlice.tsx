import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {IPersonalDocument} from "../../models/IPersonalDocument";
import RestApis from "../../config/RestApis";


export interface IPersonalDocumentState {
    personalDocument: IPersonalDocument
    personalDocuments: IPersonalDocument[],
    loading: boolean;
}

const initialPersonalDocumentState: IPersonalDocumentState = {
    personalDocuments: [],
    personalDocument: {} as IPersonalDocument,
    loading: false,
};

interface ISavePersonalDocument {
    employeeId: number;
    documentType: string;
    documentFile: File[];
    description: string;
    token: string;
}

export const fetchSavePersonalDocument = createAsyncThunk(
    'personalDocument/fetchSavePersonalDocument',
    async (payload: ISavePersonalDocument, {rejectWithValue}) => {
        const formData = new FormData();
        formData.append('employeeId', String(payload.employeeId));
        formData.append('documentType', payload.documentType);
        formData.append('documentFile', payload.documentFile[0]); // İlk dosyayı ekliyoruz
        formData.append('description', payload.description);
        const response = await fetch(RestApis.personelDocumentService+'/save', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ` + payload.token
            },
            body: formData, // FormData'yı body olarak ekliyoruz
        });
        return await response.json();
    }
)

export const fetchDeletePersonalDocument = createAsyncThunk(
    'personalDocument/fetchDeletePersonalDocumentAndFile',
    async (payload: { id: number, attachedFile: string, token: string }, { rejectWithValue }) => {
            const response = await fetch(RestApis.personelDocumentService+`/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + payload.token
                },
                body: JSON.stringify({
                    'id': payload.id,
                    'attachedFile': payload.attachedFile
                })
            });

            return await response.json();

    }
);

interface IFetchGetPersonalDocument {
    token: string;
    searchText: string;
    page: number;
    pageSize: number;
}

export const fetchPersonalDocuments = createAsyncThunk(
    'personalDocument/fetchPersonalDocuments',
    async (payload: IFetchGetPersonalDocument, {rejectWithValue}) => {
        const response = await fetch(RestApis.personelDocumentService+'/get-all', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            },
            body: JSON.stringify({
                'searchText': payload.searchText,
                'pageSize': payload.pageSize,
                'page': payload.page
            })
        });
        return await response.json();
    }
);

interface IFetchPersonalDocument {
    employeeId: number;
    token: string;
}

export const fetchPersonalDocumentsOfEmployee = createAsyncThunk(
    'personalDocument/fetchPersonalDocumentsOfEmployee',
    async (payload: IFetchPersonalDocument, {rejectWithValue}) => {
        const response = await fetch(RestApis.personelDocumentService+'/get-by-employee-id', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            },
            body: JSON.stringify(
                {
                    'employeeId': payload.employeeId
                }
            ),
        });
        return await response.json();
    }
);

export const fetchPersonalDocumentTypes = createAsyncThunk(
    'personalDocument/fetchPersonalDocumentsTypes',
    async (token: string, {rejectWithValue}) => {
        const response = await fetch(RestApis.personelDocumentService+'/get-all-personal-document-types', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + token
            },
        });
        return await response.json();
    }
);

const personalDocumentSlice = createSlice({
    name: 'personalDocument',
    initialState: initialPersonalDocumentState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchPersonalDocumentTypes.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchPersonalDocumentTypes.fulfilled, (state, action) => {
            state.personalDocuments = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchPersonalDocumentTypes.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(fetchSavePersonalDocument.fulfilled, (state, action) => {
            state.personalDocument = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchSavePersonalDocument.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchPersonalDocuments.fulfilled, (state, action) => {
            state.personalDocuments = action.payload;
        });
        builder.addCase(fetchPersonalDocuments.rejected, (state) => {
            state.loading = false;
        });
    }
});


export default personalDocumentSlice.reducer;

