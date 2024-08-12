import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface INotification {
    id: number,
    userId: number,
    notificationType: string,
    notificationText: string,
    isRead: boolean,
    userType: string
    url: string
}

export interface IUpdateIsRead {
    token: string,
    id: number,
    isRead: boolean,
}

export interface IDeleteNotification {
    token: string,
    id: number,
}

interface IInitialNotification {
    notificationList: INotification[],
    notificationAllList: INotification[],
    isNotificationListLoading: boolean;
}

const initialNotificationState: IInitialNotification = {
    notificationList: [],
    notificationAllList: [],
    isNotificationListLoading: false,
}

export const fetchGetUnreadNotifications = createAsyncThunk(
    'notification/fetchGetUnreadNotifications',
    async (token: string) => {
        const response = await fetch('http://localhost:9090/dev/v1/notification/get-all-unread', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + token
            }
        });

        return await response.json();

    }
);
interface IFetchGetNotifications {
    token: string;
    page: number;
    pageSize: number;
    searchText: string;

}
export const fetchGetNotifications = createAsyncThunk(
    'notification/fetchGetNotifications',
    async (payload: IFetchGetNotifications) => {
        const response = await fetch('http://localhost:9090/dev/v1/notification/get-all', {
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

export const fetchUpdateIsRead = createAsyncThunk(
    'notification/fetchUpdateIsRead',
    async (payload:IUpdateIsRead) => {
        const response = await fetch('http://localhost:9090/dev/v1/notification/update-is-read', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            },
            body: JSON.stringify({
                'id': payload.id,
                'isRead' : payload.isRead
            })
        });

        return await response.json();

    }
);



export const fetchDeleteNotification = createAsyncThunk(
    'notification/fetchDeleteNotification',
    async (payload:IDeleteNotification) => {
        const response = await fetch('http://localhost:9090/dev/v1/notification/delete?id='+payload.id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            }
        });
        return await response.json();
    }
);

export interface IContactUsNotificationPayload {
    senderName: string,
    senderEmail: string,
    subject: string
    message: string
}

export const fetchSaveContactUsNotification = createAsyncThunk(
    'notification/fetchSaveContactUsNotification',
    async (payload:IContactUsNotificationPayload) => {
        const response = await fetch('http://localhost:9090/dev/v1/notification/save-contact-us-notification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'senderName': payload.senderName,
                'senderEmail' : payload.senderEmail,
                'subject': payload.subject,
                'message': payload.message
            })
        });

        return await response.json();

    }
);


const notificationSlice = createSlice({
    name: 'notification',
    initialState: initialNotificationState,
    reducers: {},
    extraReducers: (build) => {
        build.addCase(fetchGetUnreadNotifications.fulfilled, (state, action) => {
            state.notificationList = action.payload;
        })
        build.addCase(fetchGetUnreadNotifications.pending, (state) => {
            state.isNotificationListLoading = true;
        })
        build.addCase(fetchGetUnreadNotifications.rejected, (state, action) => {
            
        })
        build.addCase(fetchGetNotifications.fulfilled, (state, action) => {
            state.notificationAllList = action.payload;
        })
    }
});

export default notificationSlice.reducer;
export const { } = notificationSlice.actions