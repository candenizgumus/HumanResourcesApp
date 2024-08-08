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

interface IInitialUserStory{
    storyList: IUserStoryResponse[],
    isCommentListLoading: boolean,
}

const initialUserStory = {
    storyList: [],
    isCommentListLoading: true
};

export const fetchGetUserStories = createAsyncThunk(
    'userStory/fetchUserStories',
    async (_, { rejectWithValue }) => {
            const response = await fetch('http://localhost:9090/dev/v1/comment/get-all')
            .then(data => data.json());
            console.log(response);
            return response;
    }
);

export interface ICreateUserStory{
    name:string ;
    shortDescription: string,
    iconPath: string,
    token: string
}

export const fetchCreateUserStories = createAsyncThunk(
    'post/fetchCreateUserStories',
    async (payload: ICreateUserStory) => {

            const response = await fetch(`http://localhost:9090/dev/v1/feature/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + payload.token
                },
                body: JSON.stringify({
                    'name': payload.name,
                    'shortDescription': payload.shortDescription,
                    'iconPath': payload.iconPath,
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
    },
});

export default userStorySlice.reducer;
export const {} = userStorySlice.actions