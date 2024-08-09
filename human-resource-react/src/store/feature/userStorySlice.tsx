import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface IUserStoryResponse {
    id: number,
    managerName: string,
    companyName: string,
    title: string,
    shortDescription: string,
    longDescription: string,
    photo: string,
    sector: string,
    numberOfEmployees:number,
    logo: string,
    country: string
}
export interface IUserStory{
    id: number,
    managerName: string,
    companyId: number,
    title: string,
    shortDescription: string,
    longDescription: string,
}

interface IInitialUserStory{
    storyList: IUserStoryResponse[],
    isCommentListLoading: boolean,
    companyStory: IUserStory
}

const initialUserStory = {
    storyList: [],
    isCommentListLoading: true,
    companyStory: {} as IUserStory
};

export const fetchGetUserStories = createAsyncThunk(
    'userStory/fetchUserStories',
    async (_, { rejectWithValue }) => {
            const response = await fetch('http://localhost:9090/dev/v1/comment/get-all')
            .then(data => data.json());
            return response;
    }
);



export const fetchGetUserStory = createAsyncThunk(
    'userStory/fetchGetUserStory',

    async (token: string) => {
        const response = await fetch(`http://localhost:9090/dev/v1/comment/get-company-comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + token
            }
        });

        return await response.json();
    }
);

export interface ICreateUserStory{
    shortDescription: string,
    longDescription: string,
    token: string
}

export const fetchCreateUserStories = createAsyncThunk(
    'userStory/fetchCreateUserStories',
    async (payload: ICreateUserStory) => {

            const response = await fetch(`http://localhost:9090/dev/v1/comment/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + payload.token
                },
                body: JSON.stringify({
                    'shortDescription': payload.shortDescription,
                    'longDescription': payload.longDescription,
                })
            });
             
            return await response.json();
    }

)

export interface IUpdateUserStory{
    shortDescription: string,
    longDescription: string,
    token: string,
    setNewManager: boolean
}

export const fetchUpdateUserStories = createAsyncThunk(
    'userStory/fetchUpdateUserStories',
    async (payload: IUpdateUserStory) => {

            const response = await fetch(`http://localhost:9090/dev/v1/comment/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + payload.token
                },
                body: JSON.stringify({
                    'shortDescription': payload.shortDescription,
                    'longDescription': payload.longDescription,
                    'setNewManager': payload.setNewManager
                })
            });
             
            return await response.json();
    }

)

const userStorySlice = createSlice({
    name: 'userStory',
    initialState: initialUserStory,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGetUserStories.fulfilled, (state, action) => {
                state.storyList = action.payload;
                state.isCommentListLoading = false;
                console.log(action.payload)
            })
            .addCase(fetchGetUserStory.fulfilled, (state, action) => {
                state.companyStory = action.payload;
                console.log(action.payload)
            })
    },
});

export default userStorySlice.reducer;
export const {} = userStorySlice.actions