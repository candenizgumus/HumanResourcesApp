import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {ILogin} from "../../models/ILogin";
import DataTable from "../../components/molecules/DataTable";

const initalAuthState  = {
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
                    'userType': payload.userType
                })
            }).then(data=> data.json())
            return response;

        }catch(err){
            console.log('hata...: ', err);
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
            state.token = action.payload;
            state.isAuth = true;
        })
    },

});

export const {changePageState} = authSlice.actions
export default authSlice.reducer;