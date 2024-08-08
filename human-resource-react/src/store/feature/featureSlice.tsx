import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IResponseFeature {
    id: number,
    name: string,
    shortDescription: string
    iconPath: string,
}

interface IInitialFeature{
    featuresList: IResponseFeature[],
    isFeatureListLoading: boolean
}

const initialFeatureState: IInitialFeature = {
    featuresList: [],
    isFeatureListLoading: true
}


export const fetchGetFeatures = createAsyncThunk(
    'get/fetchGetFeatures',
    async()=>{
        const result = await fetch('http://localhost:9090/dev/v1/feature/get-all')
            .then(data=>data.json());
        console.log(result)
        return result;
    }
);
export interface ICreateFeature{
    name:string ;
    shortDescription: string,
    iconPath: string,
    token: string
}

export const fetchCreateFeature = createAsyncThunk(
    'post/fetchCreateFeature',
    async (payload: ICreateFeature) => {

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

const featureSlice = createSlice({
    name: 'feature',
    initialState: initialFeatureState,
    reducers: {},
    extraReducers: (build)=>{
        build.addCase(fetchGetFeatures.fulfilled,(state,action)=>{
            state.featuresList = action.payload;
            state.isFeatureListLoading= false;
            console.log(state.featuresList);
        })
    }
});

export default featureSlice.reducer;
export const {} = featureSlice.actions