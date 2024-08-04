import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface IUserStoryResponse {
    id: number,
    managerName: string,
    companyName: string,
    title: string,
    commentText: string,
    photo: string
}

interface IInitialUserStory{
    storyList: IUserStoryResponse[],
    isCommentListLoading: boolean,
}

const initialUserStory = {
    storyList: [],
    isCommentListLoading: true
};

export const fetchCreateUserStories = createAsyncThunk(
    'userStory/fetchUserStories',
    async (_, { rejectWithValue }) => {
            const response = await fetch('http://localhost:9090/dev/v1/comment/get-all')
            .then(data => data.json());
            console.log(response);
            return response;
    }
);

const userStorySlice = createSlice({
    name: 'userStory',
    initialState: initialUserStory,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCreateUserStories.fulfilled, (state, action) => {
                state.storyList = action.payload;
                state.isCommentListLoading = false;
            })
    },
});

export default userStorySlice.reducer;
export const {} = userStorySlice.actions