import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearToken } from "./authSlice";
import {ICompany} from "../../models/ICompany";
import RestApis from "../../config/RestApis";

export interface ICompanyLogo {

    id: number,
    name: string,
    logo: string,
}


export interface IUpdateCompany {
    token: string,
    id: number,
    name: string,
    logo: string,
    description: string
    country: string
}

export interface IUpcomingExpiry {
    id: number,
    name: string,
    logo: string,
    numberOfEmployee: number,
    status : string,
    contactEmail: string,
    subscriptionType: string,
    subscriptionStartDate: Date,
    subscriptionEndDate: Date
}

interface IInitialCompany{
    company: ICompany;
    companyList: ICompany[],
    logoList: ICompanyLogo[];
    companyCountByMonth: any;
    isCompanyListLoading: boolean;
    islogoListLoading: boolean;
    isCompanyCountLoading: boolean;
    upcomingExpiries: IUpcomingExpiry[];
}

const initialCompanyState: IInitialCompany = {
    company : {} as ICompany,
    upcomingExpiries : [],
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
        const result = await fetch(RestApis.companyService+'/get-all-company-logos')
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

            const response = await fetch(RestApis.companyService+'/get-all', {
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

            const response = await fetch(RestApis.companyService+'/get-count', {
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

            const response = await fetch(RestApis.companyService+'/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + payload.token
                },
                body: JSON.stringify({
                    'id': payload.id,
                    'name': payload.name,
                    'logo': payload.logo,
                    'country': payload.country,
                    'description': payload.description
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

        const response = await fetch(RestApis.companyService+'/getCompanyCountByMonth',{
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

export const fetchGetCompanyDataOfManager = createAsyncThunk(
    'company/fetchGetCompanyDataOfManager',
    async (token:string, { dispatch }) => {

        const response = await fetch(RestApis.companyService+'/get-company-of-manager', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + token
            }
        });


        return await response.json();

    }
);
interface IUpdateCompanyByManager {
    token: string;
    name: string;
    description: string;
    country: string;
    photo: File | null;
}
export const fetchUpdateCompanyByManager = createAsyncThunk(
    'company/fetchUpdateCompanyByManager',
    async (payload:IUpdateCompanyByManager, { dispatch }) => {
        const formData = new FormData();


        formData.append('name', payload.name);
        formData.append('description', payload.description);
        formData.append('country', payload.country);

        if (payload.photo) {
            formData.append('photo', payload.photo);
        }

        const response = await fetch(RestApis.companyService+'/update-company-by-manager', {
            method: 'PUT',
            headers: {

                'Authorization': `Bearer ` + payload.token
            },
            body: formData
        });


        return await response.json();



    }
);

export const fetchGetUpcomingMembershipExpiries = createAsyncThunk(
    'company/fetchGetUpcomingMembershipExpiries',
    async (token:string) => {

        const response = await fetch(RestApis.companyService+'/get-upcoming-membership-expiries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + token
            }
        });
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
        build.addCase(fetchGetCompanyDataOfManager.fulfilled,(state,action:PayloadAction<ICompany>)=>{
            state.company = action.payload;
        })
        build.addCase(fetchUpdateCompanyByManager.fulfilled,(state,action:PayloadAction<ICompany>)=>{
            state.company = action.payload;
        })
        build.addCase(fetchGetUpcomingMembershipExpiries.fulfilled,(state,action)=>{
            state.upcomingExpiries = action.payload;
        })
    }
});

export default companySlice.reducer;
export const {} = companySlice.actions