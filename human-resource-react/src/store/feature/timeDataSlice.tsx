import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import RestApis from "../../config/RestApis";
import {ITimeDatasDto} from "../../models/ITimeDatasDto";

interface ITimeDataState {
    timeDatas: ITimeDatasDto[]
}

const initialSlideState: ITimeDataState = {
    timeDatas: []
};


export const fetchFindAllDistinctUsernames = createAsyncThunk(
    'timedata/fetchFindAllDistinctUsernames',
    async (token: String) => {
        const response = await fetch(RestApis.timeDataService + '/get-all-usernames', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + token,
            }
        });

        return await response.json();
    }
);

interface IfetchGetUsernamesSlides {
    token: string,
    userName: string

}

export const fetchGetUsernamesSlides = createAsyncThunk(
    'timedata/fetchGetUsernamesSlides',
    async (payload: IfetchGetUsernamesSlides) => {
        const response = await fetch(RestApis.timeDataService + '/get-usernames-slides?userName=' + payload.userName, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            },
        });

        return await response.json();
    }
);


export interface IfetchGetAllTimeDatasByUsernameAndSlideId {
    token: string,
    userName: string,
    slideId: number,

}

export const fetchGetAllTimeDatasByUsernameAndSlideId = createAsyncThunk(
    'slide/fetchStoreTimeData',
    async (payload: IfetchGetAllTimeDatasByUsernameAndSlideId) => {
        const response = await fetch(RestApis.timeDataService + '/get-all-by-username-slideid', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            },
            body: JSON.stringify({
                userName: payload.userName,
                slideId: payload.slideId,

            })
        });

        return await response.json();
    }
);


const timeDataSlice = createSlice({
    name: 'timeData',
    initialState: initialSlideState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchGetAllTimeDatasByUsernameAndSlideId.fulfilled, (state, action) => {

            state.timeDatas = action.payload;
        })

    },
});

export const {} = timeDataSlice.actions;
export default timeDataSlice.reducer;