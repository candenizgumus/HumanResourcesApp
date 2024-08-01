import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ILogin} from "../../models/ILogin";
import DataTable from "../../components/molecules/DataTable";
import {IUser} from "../../models/IUser";

interface IAuthState{
    user: IUser[],
    token: string,
    isAuth: boolean,
    pageState: JSX.Element
}

const initalAuthState: IAuthState  = {
    user: [],
    token: '',
    isAuth : false,
    pageState:<DataTable/>,

}

export const fetchLogin = createAsyncThunk(
    'auth/fetchLogin',
    async(payload: ILogin)=>{
        try{
            const response =  await fetch('http://localhost:9090/dev/v1/auth/login',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'email': payload.email,
                    'password': payload.password,

                })
            }).then(data=> data.json())
            return response;

        }catch(err){
            console.log('hata...: ', err);
        }

    }
);

export const fetchFindUserByToken = createAsyncThunk(
    'user/fetchFindUserByToken',
    async (_, { getState }) => {
        try {
            const state = getState() as { auth: IAuthState };
            const token = state.auth.token; // token değerini al

            console.log("Token: ", token); // Token'ı konsola yazdır

            const response = await fetch(`http://localhost:9090/dev/v1/user/find-by-token?token=${token}`)
                .then(data => data.json());





            return response;

        } catch (err) {
            console.log('hata...: ', err);
            throw err; // Hata varsa fırlat
        }
    }
);





const authSlice = createSlice({
    name: 'auth',
    initialState: initalAuthState,
    reducers:{
        changePageState(state, action){
            state.pageState = action.payload
        }
    },
    extraReducers: (build)=>{
        build.addCase(fetchLogin.fulfilled, (state, action)=>{
            state.token = action.payload.token;
            state.isAuth = true;
        })
        build.addCase(fetchFindUserByToken.fulfilled, (state, action: PayloadAction<IUser[]>)=>{

            state.user = action.payload;

        })
    },

});

export const {changePageState} = authSlice.actions
export default authSlice.reducer;