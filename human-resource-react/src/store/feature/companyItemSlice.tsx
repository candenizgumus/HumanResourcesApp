import {IPersonalDocument} from "../../models/IPersonalDocument";
import {ICompanyItem} from "../../models/ICompanyItem";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

export interface ICompanyItemState {
    companyItem: ICompanyItem
    companyItems: ICompanyItem[],
    loading: boolean;
}

const initialCompanyItemState: ICompanyItemState = {
    companyItems: [],
    companyItem: {} as ICompanyItem,
    loading: false,
};

interface ISaveCompanyItem {
    name: string;
    companyItemType: string;
    serialNumber: string;
    token: string;
}

export const fetchSaveCompanyItem = createAsyncThunk(
    'companyItem/fetchSaveCompanyItem',
    async (payload: ISaveCompanyItem, {rejectWithValue}) => {
        const response = await fetch('http://localhost:9090/dev/v1/company-item/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            },
            body: JSON.stringify({
                'name': payload.name,
                'companyItemType': payload.companyItemType,
                'serialNumber': payload.serialNumber
            })
        });
        return await response.json();
    }
)

export const fetchDeleteCompanyItem = createAsyncThunk(
    'companyItem/fetchDeleteCompanyItem',
    async (payload: { id: number, token: string }, { rejectWithValue }) => {
            const response = await fetch(`http://localhost:9090/dev/v1/company-item/delete/${payload.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + payload.token
                }
            });
            return await response.json();
        }
    );

export const fetchCompanyItems = createAsyncThunk(
    'companyItem/fetchCompanyItems',
    async (payload: { token: string, searchText: string, page: number, pageSize: number }) => {
        const response = await fetch('http://localhost:9090/dev/v1/company-item/get-all', {
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

export const fetchCompanyItemAssignments = createAsyncThunk(
    'companyItem/fetchCompanyItemsWithAssignments',
    async (token: string) => {
        const response = await fetch('http://localhost:9090/dev/v1/company-item-assignment/get-all', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + token
            }
        });
        return await response.json();
    }
);

export const fetchCompanyItemTypes = createAsyncThunk(
    'companyItem/fetchCompanyItemTypes',
    async (token: string) => {
        const response = await fetch('http://localhost:9090/dev/v1/company-item/get-types', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + token
            }
        });
        return await response.json();
    }
);

interface ICompanyItemAssignment {
    companyItemId: number;
    employeeId: number;
    token: string;
}
export const fetchCreateCompanyItemAssignment = createAsyncThunk(
    'companyItem/fetchCreateCompanyItemAssignment',
    async (payload: ICompanyItemAssignment) => {
        const response = await fetch('http://localhost:9090/dev/v1/company-item-assignment/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            },
            body: JSON.stringify({
                'companyItemId': payload.companyItemId,
                'employeeId': payload.employeeId
            })
        });
        return await response.json();
    }
);


export const fetchGetAssignedItemsOfEmployee = createAsyncThunk(
    'companyItem/fetchGetAssignedItemsOfEmployee',
    async (token: string, {rejectWithValue}) => {
        const response = await fetch('http://localhost:9090/dev/v1/company-item-assignment/get-assinged-items-of-employee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + token
            }
        });
        return await response.json();
    }
);



const companyItemSlice = createSlice({
    name: 'companyItem',
    initialState: initialCompanyItemState,
    reducers: {
        setCompanyItem: (state, action) => {
            state.companyItem = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchSaveCompanyItem.fulfilled, (state, action) => {
            state.companyItems.push(action.payload);
        });
        builder.addCase(fetchCompanyItems.fulfilled, (state, action) => {
            state.companyItems = action.payload;
        });
        builder.addCase(fetchDeleteCompanyItem.fulfilled, (state, action) => {
            state.companyItems = state.companyItems.filter(item => item.id !== action.payload.id);
        });
        builder.addCase(fetchCompanyItemTypes.fulfilled, (state, action) => {
            state.companyItems = action.payload;
        });
        builder.addCase(fetchCreateCompanyItemAssignment.fulfilled, (state, action) => {
            state.companyItems = action.payload;
        });
        builder.addCase(fetchCompanyItemAssignments.fulfilled, (state, action) => {
            state.companyItems = action.payload;
        });
    }
});