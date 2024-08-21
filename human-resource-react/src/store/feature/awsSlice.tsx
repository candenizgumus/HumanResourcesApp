import { createAsyncThunk } from "@reduxjs/toolkit";
import RestApis from "../../config/RestApis";

export const uploadPlayerProfileImage = createAsyncThunk<string, FormData, { rejectValue: string }>(
    'user/uploadImage',
    async (formData, { rejectWithValue }) => {
        const response = await fetch(RestApis.userService+'/profile-image', {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });
        if (!response.ok) {
            return rejectWithValue('Failed to upload image');
        }
        return await response.text();
    }
);

