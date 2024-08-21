import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import RestApis from "../../config/RestApis";

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
    leaveType: string
    responseMessage: string
    managerName: string
}

interface IInitialLeave {
    leaveList: ILeave[],
    isLeaveListLoading: boolean;
    selectedLeave: ILeave;
}

const initialLeaveState: IInitialLeave = {
    leaveList: [],
    isLeaveListLoading: false,
    selectedLeave: {} as ILeave
}

interface IFetchSaveLeave {
    token : string,
    description: string;
    startDate: Date;
    endDate: Date;
    leaveType: string;
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

        formData.append('leaveType', payload.leaveType.toString());

        payload.files.forEach((file) => {
            formData.append('files', file);
        });

        const response = await fetch(RestApis.leaveService+'/save', {
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
    leaveType: string;
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

        formData.append('leaveType', payload.leaveType.toString());
        formData.append('employeeId', payload.employeeId.toString());
        payload.files.forEach((file) => {
            formData.append('files', file);
        });

        const response = await fetch(RestApis.leaveService+'/assign-leave', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ` + payload.token
            },
            body: formData
        });

        return await response.json();
    }
)
export interface IRequestWithIdAndToken{
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

        const response = await fetch(RestApis.leaveService+`/search-by-employee-id`, {
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

export const fetchGetLeaveById = createAsyncThunk(
    'leave/fetchGetLeaveById',
    async (payload: IRequestWithIdAndToken) => {

        const response = await fetch(RestApis.leaveService+`/search-by-leave-id?id=`+payload.id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            }
        });

        return await response.json();
    }

)

export const fetchGetLeavesOfManager = createAsyncThunk(
    'leave/fetchGetLeavesOfManager',
    async (payload: IfetchGetAllLeaves) => {

        const response = await fetch(RestApis.leaveService+`/search-by-company-id`, {
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
interface IRequestWithIdAndTokenAndResponse {
    id: number,
    token: string,
    responseMessage: string
}

export const fetchApproveLeave = createAsyncThunk(
    'leave/fetchApproveLeave',
    async (payload: IRequestWithIdAndTokenAndResponse) => {

        const response = await fetch(RestApis.leaveService+`/approve-leave`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            },
            body: JSON.stringify({
                'id': payload.id,
                'responseMessage': payload.responseMessage
            })
        });

        return await response.json();
    }

)

export const fetchDeleteLeave = createAsyncThunk(
    'leave/fetchDeleteLeave',
    async (payload: IRequestWithIdAndTokenAndResponse) => {

        const response = await fetch(RestApis.leaveService+`/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            },
            body: JSON.stringify({
                'id': payload.id,
                'responseMessage': payload.responseMessage
            })
        });

        return await response.json();
    }

)

export const fetchCancelLeave = createAsyncThunk(
    'leave/fetchCancelLeave',
    async (payload: IRequestWithIdAndTokenAndResponse) => {

        const response = await fetch(RestApis.leaveService+`/cancel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            },
            body: JSON.stringify({
                'id': payload.id,
                'responseMessage': payload.responseMessage
            })
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

        const response = await fetch(RestApis.leaveService+'/change-leave-day?id='+payload.id+'&leaveDay='+payload.leaveDays, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            }
        });

        return await response.json();
    }

)

interface IFetchUpdateLeave {
    token : string;
    id : number;
    description: string;
    startDate: Date;
    endDate: Date;
    leaveType: string;
}

export const fetchUpdateLeave = createAsyncThunk(
    'leave/fetchUpdateLeave',
    async (payload: IFetchUpdateLeave) => {

        const response = await fetch(RestApis.leaveService+`/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            },
            body: JSON.stringify({
                'id': payload.id,
                'description': payload.description,
                'startDate': payload.startDate,
                'endDate': payload.endDate,
                'leaveType': payload.leaveType
            })
        });

        return await response.json();
    }

)

export const fetchGetCurrentLeavesOfEmployeeForHomePage = createAsyncThunk(
    'leave/fetchUpdateAnnualLeaveDays',
    async (payload: string) => {

        const response = await fetch(RestApis.leaveService+'/get-all-current-leaves', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload
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
        build.addCase(fetchGetLeaveById.fulfilled, (state, action) => {
            state.selectedLeave = action.payload;
        })
    }
});

export default leaveSlice.reducer;
export const { } = leaveSlice.actions