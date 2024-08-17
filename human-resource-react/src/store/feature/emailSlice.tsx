import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IInitialEmail{
}

const initialEmailState: IInitialEmail = {
}

interface fetchSendEmailPayload {
    token: string,
    to: string,
    message: string,
    subject: string
}
export const fetchSendEmail = createAsyncThunk(
    'email/fetchSendEmail',
    async (payload: fetchSendEmailPayload, ) => {

        const response = await fetch('http://localhost:9090/dev/v1/email/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            },
            body: JSON.stringify({
                'to': payload.to,
                'subject': payload.subject,
                'message': payload.message
            })
        });

        return await response.json();

    }
);

const emailSlice = createSlice({
    name: 'email',
    initialState: initialEmailState,
    reducers: {},
    extraReducers: (build)=>{
        build.addCase(fetchSendEmail.fulfilled,(state,action)=>{

        })
    }
});

export default emailSlice.reducer;
export const {} = emailSlice.actions