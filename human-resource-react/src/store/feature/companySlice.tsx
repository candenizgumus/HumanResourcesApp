import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IResponseCompany {
    id: number,
    name: string,
    logo: string
}

interface IInitialCompany{
    companiesList: IResponseCompany[],
    isCompanyListLoading: boolean
}

const initialCompanyState: IInitialCompany = {
    companiesList: [],
    isCompanyListLoading: true
}


export const fetchGetCompanies = createAsyncThunk(
    'get/fetchGetCompanies',
    async()=>{
        const result = await fetch('http://localhost:9090/dev/v1/company/get-all')
            .then(data=>data.json());
        return result;
    }
);

const companySlice = createSlice({
    name: 'company',
    initialState: initialCompanyState,
    reducers: {},
    extraReducers: (build)=>{
        build.addCase(fetchGetCompanies.fulfilled,(state,action)=>{
            state.companiesList = action.payload;
            state.isCompanyListLoading= false;
            console.log(state.companiesList);
        })
    }
});

export default companySlice.reducer;
export const {} = companySlice.actions