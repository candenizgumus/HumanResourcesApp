import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import RestApis from "../../config/RestApis";

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

        const response = await fetch(RestApis.emailService+'/send-email', {
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