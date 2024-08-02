import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ILogin} from "../../models/ILogin";
import OfferList from "../../components/molecules/OfferList";
import {IUser} from "../../models/IUser";

interface IAuthState{
    user: IUser[],
    token: string,
    isAuth: boolean,
    pageState: string
}

const initalAuthState: IAuthState  = {
    user: {} as IUser[],
    token: '',
    isAuth : false,
    pageState:'',

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
    async (token: string) => {
        try {
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
        changePageState(state, action:PayloadAction<string>){
            state.pageState = action.payload
        },
        setToken(state,action: PayloadAction<string>){
            state.isAuth = true;
            state.token = action.payload;
        },
        clearToken(state){

            state.isAuth = false;
            state.token = '';
        }
    },
    extraReducers: (build)=>{
        build.addCase(fetchLogin.fulfilled, (state, action)=>{
            state.token = action.payload.token;
            localStorage.setItem('token', action.payload.token);
            state.isAuth = true;
        })
        build.addCase(fetchFindUserByToken.fulfilled, (state, action: PayloadAction<IUser[]>)=>{

            state.user = action.payload;

        })
    },

});

export const {changePageState,setToken,clearToken} = authSlice.actions
export default authSlice.reducer;