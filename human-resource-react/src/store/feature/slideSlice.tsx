import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import RestApis from "../../config/RestApis";

interface ISlideState {
    response: string
    images: ISlide
    slides: ISlide[]
}

const initialSlideState: ISlideState = {
    response: '',
    images: {} as ISlide,
    slides: []
};

export interface ISlide {
    id : number,
    imageUrls : string[],
    sehir: string,
    ilce: string,
    mahalle: string,
    projeksiyon: string,
    konsept: string
}

interface ISlidePayload {
    token: string;
    files: File[];
}

export const fetchUploadFile = createAsyncThunk(
    'slide/fetchUploadFile',
    async (payload: ISlidePayload) => {
        const formData = new FormData();
        if (payload.files) {
            formData.append('file', payload.files[0]);
        }
        const response = await fetch(RestApis.slideService + '/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${payload.token}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('File upload failed');
        }

        return await response.json();
    }
);

export const fetchGetAllSlides = createAsyncThunk(
    'slide/fetchGetAllSlides',
    async (token: string) => {
        const response = await fetch(RestApis.slideService + '/get-all', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + token
            },
        });

        if (!response.ok) {
            throw new Error('File upload failed');
        }

        return await response.json();
    }
);


const slideSlice = createSlice({
    name: 'slide',
    initialState: initialSlideState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUploadFile.fulfilled, (state, action:PayloadAction<ISlide>) => {
                state.images = action.payload;
            })
            .addCase(fetchGetAllSlides.fulfilled, (state, action:PayloadAction<ISlide[]>) => {
                state.slides = action.payload;
            })
    },
});

export const {  } = slideSlice.actions;
export default slideSlice.reducer;