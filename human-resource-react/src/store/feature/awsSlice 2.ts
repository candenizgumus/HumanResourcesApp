import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const uploadPlayerProfileImage = createAsyncThunk<string, FormData, { rejectValue: string }>(
    'user/uploadImage',
    async (formData, { rejectWithValue }) => {
        const response = await fetch('http://localhost:9090/dev/v1/user/profile-image', {
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
