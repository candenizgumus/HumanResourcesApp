import {createAsyncThunk} from "@reduxjs/toolkit";

export const fetchGetPasswordResetCode = createAsyncThunk(
    'getPasswordResetCode/fetchPasswordReset',
    async (payload: { email: string }, {rejectWithValue}) => {
        const response = await fetch('http://localhost:9090/dev/v1/password-reset/send-password-reset-email?email=' + payload.email, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.log(response)
        }
        return await response.json();
    }
);


export const fetchResetPassword = createAsyncThunk(
    'passwordReset/fetchResetPassword',
    async (payload: { token: string, newPassword: string }, {rejectWithValue}) => {
        const response = await fetch('http://localhost:9090/dev/v1/password-reset/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.log(response)
        }
        return await response.json();
    }
)

