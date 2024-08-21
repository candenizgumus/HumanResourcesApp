import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import RestApis from "../../config/RestApis";

interface IPasswordReset {
    isResetCodeSend: boolean
}

const initalPasswordResetState: IPasswordReset = {
    isResetCodeSend: false
};

export const fetchGetPasswordResetCode = createAsyncThunk(
    'getPasswordResetCode/fetchPasswordReset',
    async (payload: { email: string }) => {
        const response = await fetch(RestApis.passwordResetService+'/send-password-reset-email?email=' + payload.email, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        return await response.json();
    }
);


export const fetchResetPassword = createAsyncThunk(
    'passwordReset/fetchResetPassword',
    async (payload: { token: string, newPassword: string }, {rejectWithValue}) => {
        const response = await fetch(RestApis.passwordResetService+'/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        return await response.json();
    }
)



const passwordResetSlice = createSlice({
    name: 'passwordReset',
    initialState: initalPasswordResetState,
    reducers: {
        setIsCodeSend(state, action: PayloadAction<boolean>){
            state.isResetCodeSend = action.payload;
        }
    },
    extraReducers: (builder) => {  
    },
});

export const { setIsCodeSend } = passwordResetSlice.actions;
export default passwordResetSlice.reducer;