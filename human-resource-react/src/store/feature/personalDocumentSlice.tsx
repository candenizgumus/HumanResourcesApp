import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {IPersonalDocument} from "../../models/IPersonalDocument";


export interface IPersonalDocumentState {
    personalDocument: IPersonalDocument
    personalDocuments: IPersonalDocumentState[],

    loading: boolean;
}

const initialPersonalDocumentState: IPersonalDocumentState = {
    personalDocuments: [],
    personalDocument: {} as IPersonalDocument,
    loading: false,
};

interface ISavePersonalDocument{
    employeeId: number;
    documentType: string;
    documentFile: string;
    token: string;
}

export const fetchSavePersonalDocument = createAsyncThunk(
    'personalDocument/savePersonalDocument',
    async (payload: ISavePersonalDocument, {rejectWithValue}) => {
            const response = await fetch('http://localhost:9090/dev/v1/personal-document/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + payload.token
                },
                body: JSON.stringify(
                    {
                        'employeeId': payload.employeeId,
                        'documentType': payload.documentType,
                        'documentFile': payload.documentFile,
                    }
                ),
            });
        return await response.json();
    }
)

export const fetchPersonalDocumentTypes = createAsyncThunk(
    'personalDocument/fetchPersonalDocuments',
    async (token: string, {rejectWithValue}) => {
            const response = await fetch('http://localhost:9090/dev/v1/personal-document/get-all-personal-document-types',{
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
        builder.addCase(fetchSavePersonalDocument.fulfilled, (state, action) => {
            state.personalDocument = action.payload;
            state.loading = false;
        });
    }
});

export default personalDocumentSlice.reducer;

