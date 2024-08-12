import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface ILeave {
    id: number,
    userId: number,
    notificationType: string,
    notificationText: string,
    isRead: boolean,
    userType: string
    url: string
}


interface IInitialLeave {
    leaveList: ILeave[],
    isLeaveListLoading: boolean;
}

const initialLeaveState: IInitialLeave = {
    leaveList: [],
    isLeaveListLoading: false,
}


interface IFetchGetLeaves {
    token: string;
    page: number;
    pageSize: number;
    searchText: string;

}
export const fetchGetLeaves = createAsyncThunk(
    'leave/fetchGetLeaves',
    async (payload: IFetchGetLeaves) => {
        const response = await fetch('http://localhost:9090/dev/v1/leave/get-all', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            },body: JSON.stringify({
                'page': payload.page,
                'pageSize' : payload.pageSize,
                'searchText' : payload.searchText
            })
        });

        return await response.json();

    }
);

interface IFetchSaveLeave {
    token: string;
    page: number;
    pageSize: number;
    searchText: string;

}
export const fetchSaveLeave = createAsyncThunk(
    'leave/fetchSaveLeave',
    async (payload: IFetchSaveLeave) => {
        const response = await fetch('http://localhost:9090/dev/v1/leave/get-all', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            },body: JSON.stringify({
                'page': payload.page,
                'pageSize' : payload.pageSize,
                'searchText' : payload.searchText
            })
        });

        return await response.json();

    }
);

export interface IDeleteLeave{
    token: string,
    id: number,
}
export const fetchDeleteLeave = createAsyncThunk(
    'leave/fetchDeleteLeave',
    async (payload:IDeleteLeave) => {
        const response = await fetch('http://localhost:9090/dev/v1/leave/delete?id='+payload.id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            }
        });
        return await response.json();
    }
);


const leaveSlice = createSlice({
    name: 'leave',
    initialState: initialLeaveState,
    reducers: {},
    extraReducers: (build) => {
        build.addCase(fetchSaveLeave.fulfilled, (state, action) => {
            state.leaveList = action.payload;
        })
        build.addCase(fetchSaveLeave.pending, (state) => {
            state.isLeaveListLoading = true;
        })
        build.addCase(fetchSaveLeave.rejected, (state, action) => {
            
        })
    }
});

export default leaveSlice.reducer;
export const { } = leaveSlice.actions