import {IPersonalDocument} from "../../models/IPersonalDocument";
import {ICompanyItem} from "../../models/ICompanyItem";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import RestApis from "../../config/RestApis";

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
        const response = await fetch(RestApis.companyItemService+'/save', {
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
            const response = await fetch(RestApis.companyItemService+`/delete/${payload.id}`, {
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
        const response = await fetch(RestApis.companyItemService+'/get-all', {
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

export const fetchCompanyItemsForAssignment = createAsyncThunk(
    'companyItem/fetchCompanyItems',
    async (payload: { token: string, searchText: string, page: number, pageSize: number }) => {
        const response = await fetch(RestApis.companyItemService+'/get-all-for-assignment', {
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
        const response = await fetch(RestApis.companyItemService+'-assignment/get-all', {
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
        const response = await fetch(RestApis.companyItemService+'/get-types', {
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
        const response = await fetch(RestApis.companyItemService+'-assignment/save', {
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
        const response = await fetch(RestApis.companyItemService+'-assignment/get-assinged-items-of-employee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + token
            }
        });
        return await response.json();
    }
);

export const fetchGetAssignedItemsOfEmployeeDetailed = createAsyncThunk(
    'companyItem/fetchGetAssignedItemsOfEmployeeDetailed',
    async (token: string) => {
        const response = await fetch(RestApis.companyItemService+'-assignment/get-all-by-employee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + token
            }
        });
        return await response.json();
    }
);

export const fetchApproveItemAssignmentByEmployee = createAsyncThunk(
    'companyItem/fetchApproveItemAssignmentByEmployee',
    async (payload: { id: number, token: string }) => {
        const response = await fetch(RestApis.companyItemService+`-assignment/approve-assignment/${payload.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            }
        });
        return await response.json();
    }
);

export const fetchRejectItemAssignmentByEmployee = createAsyncThunk(
    'companyItem/fetchRejectItemAssignmentByEmployee',
    async (payload: { id: number, token: string, message: string }) => {
        const response = await fetch(RestApis.companyItemService+`-assignment/reject-assignment`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            },
            body: JSON.stringify({
                'id': payload.id,
                'message': payload.message
            })
        });
        return await response.json();
    }
);

export const fetchCancelItemAssignmentByManager = createAsyncThunk(
    'companyItem/fetchCancelItemAssignmentByManager',
    async (payload: { id: number, token: string }) => {
        const response = await fetch(RestApis.companyItemService+`-assignment/cancel-assignment-by-manager/${payload.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
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
        builder.addCase(fetchCompanyItemsForAssignment.fulfilled, (state, action) => {
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
        builder.addCase(fetchGetAssignedItemsOfEmployeeDetailed.fulfilled, (state, action) => {
            state.companyItems = action.payload;
        });
        builder.addCase(fetchApproveItemAssignmentByEmployee.fulfilled, (state, action) => {
            state.companyItems = action.payload;
        });
        builder.addCase(fetchRejectItemAssignmentByEmployee.fulfilled, (state, action) => {
            state.companyItems = action.payload;
        });
        builder.addCase(fetchCancelItemAssignmentByManager.fulfilled, (state, action) => {
            state.companyItems = action.payload;
        });
    }
});