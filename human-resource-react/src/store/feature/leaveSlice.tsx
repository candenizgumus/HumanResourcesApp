import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface ILeave {
    createdAt:Date 
    updatedAt:Date 
    status:string 
    id: number
    employeeId: number
    companyId: number
    description: string
    startDate:Date
    endDate:Date
    approveDate:Date
    isLeaveApproved:boolean
    attachedFile:string
    fullName: string
    email: string
    dLeaveTypeId: number
}

interface IInitialLeave {
    leaveList: ILeave[],
    isLeaveListLoading: boolean;
}

const initialLeaveState: IInitialLeave = {
    leaveList: [],
    isLeaveListLoading: false,
}

interface IFetchSaveLeave {
    token : string,
    description: string;
    startDate: Date;
    endDate: Date;
    dLeaveTypeId: number;
    files: File[];
}

export const fetchSaveLeave = createAsyncThunk(
    'leave/fetchSaveLeave',
    async (payload: IFetchSaveLeave) => {
        const formData = new FormData();
        formData.append('description', payload.description);

        // Format the dates to 'yyyy-MM-dd'
        const formatDate = (date: Date) => date.toISOString().split('T')[0];
        formData.append('startDate', formatDate(payload.startDate));
        formData.append('endDate', formatDate(payload.endDate));

        formData.append('dLeaveTypeId', payload.dLeaveTypeId.toString());

        payload.files.forEach((file) => {
            formData.append('files', file);
        });

        const response = await fetch('http://localhost:9090/dev/v1/leave/save', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ` + payload.token
            },
            body: formData
        });

        return await response.json();
    }
)

interface IFetchSaveLeaveAsManager {
    token : string,
    description: string;
    startDate: Date;
    endDate: Date;
    dLeaveTypeId: number;
    files: File[];
    employeeId: number;
}

export const fetchAssignLeave = createAsyncThunk(
    'leave/fetchAssignLeave',
    async (payload: IFetchSaveLeaveAsManager) => {
        const formData = new FormData();
        formData.append('description', payload.description);

        // Format the dates to 'yyyy-MM-dd'
        const formatDate = (date: Date) => date.toISOString().split('T')[0];
        formData.append('startDate', formatDate(payload.startDate));
        formData.append('endDate', formatDate(payload.endDate));

        formData.append('dLeaveTypeId', payload.dLeaveTypeId.toString());
        formData.append('employeeId', payload.employeeId.toString());
        payload.files.forEach((file) => {
            formData.append('files', file);
        });

        const response = await fetch('http://localhost:9090/dev/v1/leave/assign-leave', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ` + payload.token
            },
            body: formData
        });

        return await response.json();
    }
)
export interface IRequestWıthIdAndToken{
    token: string,
    id: number,
}

interface IfetchGetAllLeaves{
    token:string,
    page:number,
    pageSize:number,
    searchText:string
}
export const fetchGetLeavesOfEmployee = createAsyncThunk(
    'leave/fetchGetLeavesOfEmployee',
    async (payload: IfetchGetAllLeaves) => {

        const response = await fetch(`http://localhost:9090/dev/v1/leave/search-by-employee-id`, {
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

export const fetchGetLeavesOfManager = createAsyncThunk(
    'leave/fetchGetLeavesOfManager',
    async (payload: IfetchGetAllLeaves) => {

        const response = await fetch(`http://localhost:9090/dev/v1/leave/search-by-company-id`, {
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

export const fetchApproveLeave = createAsyncThunk(
    'leave/fetchApproveLeave',
    async (payload: IRequestWıthIdAndToken) => {

        const response = await fetch(`http://localhost:9090/dev/v1/leave/approve-leave?id=` + payload.id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            }
        });

        return await response.json();
    }

)

export const fetchDeleteLeave = createAsyncThunk(
    'leave/fetchDeleteLeave',
    async (payload: IRequestWıthIdAndToken) => {

        const response = await fetch(`http://localhost:9090/dev/v1/leave/delete?id=` + payload.id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            }
        });

        return await response.json();
    }

)

export const fetchCancelLeave = createAsyncThunk(
    'leave/fetchCancelLeave',
    async (payload: IRequestWıthIdAndToken) => {

        const response = await fetch(`http://localhost:9090/dev/v1/leave/cancel?id=` + payload.id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            }
        });

        return await response.json();
    }

)
interface IFetchChangeLeaveDay{
    token:string,
    id: number,
    leaveDays: number
}

export const fetchUpdateAnnualLeaveDays = createAsyncThunk(
    'leave/fetchUpdateAnnualLeaveDays',
    async (payload: IFetchChangeLeaveDay) => {

        const response = await fetch('http://localhost:9090/dev/v1/leave/change-leave-day?id='+payload.id+'&leaveDay='+payload.leaveDays, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            }
        });

        return await response.json();
    }

)





const leaveSlice = createSlice({
    name: 'leave',
    initialState: initialLeaveState,
    reducers: {},
    extraReducers: (build) => {
        build.addCase(fetchGetLeavesOfEmployee.fulfilled, (state, action) => {
            state.leaveList = action.payload;
        })
        build.addCase(fetchGetLeavesOfEmployee.pending, (state) => {
            state.isLeaveListLoading = true;
        })
        build.addCase(fetchGetLeavesOfEmployee.rejected, (state, action) => {
            
        })
        build.addCase(fetchGetLeavesOfManager.fulfilled, (state, action) => {
            state.leaveList = action.payload;
        })
        build.addCase(fetchGetLeavesOfManager.pending, (state) => {
            state.isLeaveListLoading = true;
        })
        build.addCase(fetchGetLeavesOfManager.rejected, (state, action) => {
            
        })
    }
});

export default leaveSlice.reducer;
export const { } = leaveSlice.actions