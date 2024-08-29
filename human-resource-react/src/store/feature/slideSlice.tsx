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
    mobileImageUrls : string[],
    desktopImageUrls : string[],
    sehir: string,
    ilce: string,
    mahalle: string,
    projeksiyon: string,
    konsept: string
}

interface ISlidePayload {
    token: string;
    formData : FormData
}

export const fetchUploadFile = createAsyncThunk(
    'slide/fetchUploadFile',
    async (payload: ISlidePayload) => {
        const response = await fetch(RestApis.slideService + '/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${payload.token}`
            },
            body: payload.formData
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

export const fetchGetIp = createAsyncThunk(
    'slide/fetchGetIp',
    async () => {
        const response = await fetch(RestApis.slideService + '/get-ip', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error('File upload failed');
        }

        return await response.json();
    }
);
export interface IStoreTimeData {
    userIP: string,
    imageTimes: {},
    userName: string
}
export const fetchStoreTimeData = createAsyncThunk(
    'slide/fetchStoreTimeData',
    async (payload:IStoreTimeData) => {
        const response = await fetch(RestApis.slideService + '/store-time-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userIp: payload.userIP,
                imageTimes: payload.imageTimes,
                slideId: 0,
                userName: payload.userName
            })
        });

        if (!response.ok) {
            throw new Error('File upload failed');
        }

        return await response.json();
    }
);


export const fetchGetSlideById = createAsyncThunk(
    'slide/fetchGetSlideById',
    async (slideId: number) => {
        const response = await fetch(RestApis.slideService + '/get-by-id?id=' + slideId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
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