import {IPersonalDocument} from "../../models/IPersonalDocument";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";


const initialPersonalDocumentState = {
    personalDocuments: [],
    personalDocument: {},
    loading: false,
    error: null,
};

export const fetchSavePersonalDocument = createAsyncThunk(
    'personalDocument/savePersonalDocument',
    async (payload: IPersonalDocument, {rejectWithValue}) => {
        try {
            const response = await fetch('http://localhost:9090/dev/v1/personal-document/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        'employeeId': payload.employeeId,
                        'documentType': payload.documentType,
                        'documentFile': payload.documentFile,
                    }
                ),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('API Response:', data); // Log the response
            return data;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
)

export const fetchPersonalDocuments = createAsyncThunk(
    'personalDocument/fetchPersonalDocuments',
    async (_, {rejectWithValue}) => {
        try {
            const response = await fetch('http://localhost:9090/dev/v1/personal-document/get-all');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('API Response:', data); // Log the response
            return data;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

const personalDocumentSlice = createSlice({
    name: 'personalDocument',
    initialState: initialPersonalDocumentState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchPersonalDocuments.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchPersonalDocuments.fulfilled, (state, action) => {
            state.personalDocuments = action.payload;
            state.loading = false;
        });
    }
});

