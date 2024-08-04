import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ILogin} from "../../models/ILogin";
import OfferList from "../../components/molecules/OfferList";
import {IUser} from "../../models/IUser";
import {ICreateAdmin} from '../../models/ICreateAdmin';
import {useDispatch} from "react-redux";
interface IAuthState{
    user: IUser,
    token: string,
    isAuth: boolean,
    pageState: string
}

const initalAuthState: IAuthState  = {
    user: {} as IUser,
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

export const fetchGetPositions = createAsyncThunk(
    'user/fetchGetPositions',
    async()=>{
        const result = await fetch('http://localhost:9090/dev/v1/user/get-positions')
            .then(data=>data.json());
        return result;
    }
);

export const fetchGetSectors = createAsyncThunk(
    'user/fetchGetPositions',
    async()=>{
        const result = await fetch('http://localhost:9090/dev/v1/user/get-sectors')
            .then(data=>data.json());
        return result;
    }
);

export const fetchFindCompanyNameAndManagerNameOfUser = createAsyncThunk(
    'user/fetchFindCompanyNameAndManagerNameOfUser',
    async (token: string) => {


        const response = await fetch('http://localhost:9090/dev/v1/user/find-company-name-and-manager-name-of-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + token // Adding Bearer token
            }
        }).then(data => data.json());

        return response;

    }

);

export const fetchCreateAdmin = createAsyncThunk(
    'user/fetchCreateAdmin',
    async (payload: ICreateAdmin) => {
        try {
            await fetch(`http://localhost:9090/dev/v1/auth/save-admin`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `+ payload.token
                },
                body: JSON.stringify({
                    'email': payload.email,
                    'password': payload.password
                })
            })
        } catch (err) {
            console.log('hata...: ', err);
            throw err; // Hata varsa fırlat
        }
    }
)




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
            state.pageState = 'Admin Home'
        })
        build.addCase(fetchFindUserByToken.fulfilled, (state, action: PayloadAction<IUser>)=>{
            state.user = action.payload;
        })
        build.addCase(fetchCreateAdmin.rejected, (state, action) => {
            const dispatch = useDispatch();
            dispatch(clearToken())
        })
        build.addCase(fetchFindCompanyNameAndManagerNameOfUser.rejected, (state, action)=>{
            const dispatch = useDispatch();
            dispatch(clearToken())
        })
    },

});

export const {changePageState,setToken,clearToken} = authSlice.actions
export default authSlice.reducer;