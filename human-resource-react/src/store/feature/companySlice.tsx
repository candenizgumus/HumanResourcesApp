import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearToken } from "./authSlice";

export interface ICompanyLogo {
    id: number,
    name: string,
    logo: string,
}
export interface ICompany {
    id: number,
    name: string,
    logo: string,
    description: string,
    numberOfEmployee: number,
    status: string,
    createdAt: number
}

export interface IUpdateCompany {
    token: string,
    id: number,
    name: string,
    logo: string,
    description: string,
    numberOfEmployee: number
}

interface IInitialCompany{
    companyList: ICompany[],
    logoList: ICompanyLogo[];
    companyCountByMonth: any;
    isCompanyListLoading: boolean;
    islogoListLoading: boolean;
    isCompanyCountLoading: boolean;
}

const initialCompanyState: IInitialCompany = {
    companyList: [],
    logoList: [],
    isCompanyListLoading: false,
    islogoListLoading: false,
    isCompanyCountLoading: false,
    companyCountByMonth: null
}


export const fetchGetCompanyLogos = createAsyncThunk(
    'get/fetchGetCompanyLogos',
    async()=>{
        const result = await fetch('http://localhost:9090/dev/v1/company/get-all-company-logos')
            .then(data=>data.json());
        return result;
    }
);
interface fetchGetCompaniesPayload {
    token: string;
    page: number;
    pageSize: number;
    searchText: string;
}

export const fetchGetCompanies = createAsyncThunk(
    'offer/fetchGetCompanies',
    async (payload: fetchGetCompaniesPayload, { dispatch }) => {

            const response = await fetch('http://localhost:9090/dev/v1/company/get-all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + payload.token
                },
                body: JSON.stringify({
                    'page': payload.page,
                    'pageSize': payload.pageSize,
                    'searchText': payload.searchText
                })
            });

            if (!response.ok) {
                console.log(response)
                dispatch(clearToken());
            }

            return await response.json();

    }
);

interface fetchGetCompanyCountPayload {
    token: string;
    searchText: string;
}

export const fetchGetCompanyCount = createAsyncThunk(
    'offer/fetchGetCompanyCount',
    async (payload: fetchGetCompanyCountPayload, { dispatch }) => {

            const response = await fetch('http://localhost:9090/dev/v1/company/get-count', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + payload.token
                },
                body: JSON.stringify({
                    'searchText': payload.searchText
                })
            });

            if (!response.ok) {
                console.log(response)
                dispatch(clearToken());
            }

            return await response.json();

    }
);

export const fetchUpdateCompany = createAsyncThunk(
    'offer/fetchUpdateCompany',
    async (payload: IUpdateCompany, { dispatch }) => {

            const response = await fetch('http://localhost:9090/dev/v1/company/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + payload.token
                },
                body: JSON.stringify({
                    'id': payload.id,
                    'name': payload.name,
                    'logo': payload.logo,
                    'description': payload.description,
                    'numberOfEmployee': payload.numberOfEmployee,
                })
            });

            if (!response.ok) {
                console.log(response)
                dispatch(clearToken());
            }

            return await response.json();

    }
);

export const fetchCompanyCountByMonth = createAsyncThunk(
    'companyCount/fetchCompanyCountByMonth',
    async (token: string, { dispatch }) => {

        const response = await fetch('http://localhost:9090/dev/v1/company/getCompanyCountByMonth',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + token
            }
        });

        if (!response.ok) {
                console.log(response)
                dispatch(clearToken());
            }
            return await response.json();
    }
  );


const companySlice = createSlice({
    name: 'company',
    initialState: initialCompanyState,
    reducers: {},
    extraReducers: (build)=>{
        build.addCase(fetchGetCompanyLogos.fulfilled,(state,action)=>{
            state.logoList = action.payload;
        })
        build.addCase(fetchGetCompanies.fulfilled,(state,action)=>{
            console.log(action.payload);
            state.companyList = action.payload;
            state.isCompanyListLoading= false;
        })
        build.addCase(fetchUpdateCompany.fulfilled,(state,action)=>{
            console.log(action.payload);
        })
        build.addCase(fetchGetCompanyCount.fulfilled,(state,action)=>{
            console.log(action.payload);
        })
        build.addCase(fetchCompanyCountByMonth.fulfilled, (state, action) => {
            state.companyCountByMonth = action.payload;
            console.log(action.payload)
          })
    }
});

export default companySlice.reducer;
export const {} = companySlice.actions