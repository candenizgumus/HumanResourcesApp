import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ILogin} from "../../models/ILogin";
import {IUser} from "../../models/IUser";
import {ICreateAdmin} from '../../models/ICreateAdmin';

interface IAuthState {
    user: IUser;
    token: string;
    isAuth: boolean;
    pageState: string;
    userType: string;
}

const initalAuthState: IAuthState = {
    user: {} as IUser,
    token: '',
    isAuth: false,
    pageState: '',
    userType: ''
};

export const fetchLogin = createAsyncThunk(
    'auth/fetchLogin',
    async (payload: ILogin) => {

        const response = await fetch('http://localhost:9090/dev/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'email': payload.email,
                'password': payload.password,
            })
        });
        return response.json();

    }
);

export const fetchFindUserByToken = createAsyncThunk(
    'user/fetchFindUserByToken',
    async (token: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:9090/dev/v1/user/find-by-token?token=${token}`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Fetching user by token failed');
            }
            return data;
        } catch (err) {
            console.log('Error: ', err);
            if (err instanceof Error) {
                return rejectWithValue(err.message);
            } else {
                return rejectWithValue('An unknown error occurred');
            }
        }
    }
);

export const fetchGetPositions = createAsyncThunk(
    'user/fetchGetPositions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('http://localhost:9090/dev/v1/user/get-positions');
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Fetching positions failed');
            }
            return data;
        } catch (err) {
            console.log('Error: ', err);
            if (err instanceof Error) {
                return rejectWithValue(err.message);
            } else {
                return rejectWithValue('An unknown error occurred');
            }
        }
    }
);

export const fetchGetSectors = createAsyncThunk(
    'user/fetchGetSectors',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('http://localhost:9090/dev/v1/user/get-sectors');
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Fetching sectors failed');
            }
            return data;
        } catch (err) {
            console.log('Error: ', err);
            if (err instanceof Error) {
                return rejectWithValue(err.message);
            } else {
                return rejectWithValue('An unknown error occurred');
            }
        }
    }
);

export const fetchFindCompanyNameAndManagerNameOfUser = createAsyncThunk(
    'user/fetchFindCompanyNameAndManagerNameOfUser',
    async (token: string, { rejectWithValue }) => {
        try {
            const response = await fetch('http://localhost:9090/dev/v1/user/find-company-name-and-manager-name-of-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + token
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Fetching company and manager name failed');
            }
            return data;
        } catch (err) {
            console.log('Error: ', err);
            if (err instanceof Error) {
                return rejectWithValue(err.message);
            } else {
                return rejectWithValue('An unknown error occurred');
            }
        }
    }
);

export const fetchCreateAdmin = createAsyncThunk(
    'user/fetchCreateAdmin',
    async (payload: ICreateAdmin, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:9090/dev/v1/auth/save-admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + payload.token
                },
                body: JSON.stringify({
                    'email': payload.email,
                    'password': payload.password
                })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Creating admin failed');
            }
            return data;
        } catch (err) {
            console.log('Error: ', err);
            if (err instanceof Error) {
                return rejectWithValue(err.message);
            } else {
                return rejectWithValue('An unknown error occurred');
            }
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: initalAuthState,
    reducers: {
        changePageState(state, action: PayloadAction<string>) {
            state.pageState = action.payload;
        },
        setToken(state, action: PayloadAction<string>) {
            state.isAuth = true;
            state.token = action.payload;
        },
        clearToken(state) {
            state.isAuth = false;
            state.token = '';
            localStorage.removeItem('token');
            state.pageState = ''
        },
        setUserType(state, action: PayloadAction<string>) {
            state.userType = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLogin.fulfilled, (state, action) => {
                state.token = action.payload.token;
                state.isAuth = true;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(fetchFindUserByToken.fulfilled, (state, action: PayloadAction<IUser>) => {

                state.user = action.payload;
            })
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state) => {
                    state.isAuth = false;
                    state.token = '';
                    state.pageState = '';
                    localStorage.removeItem('token');
                }
            );
    },
});

export const { changePageState, setToken, clearToken, setUserType } = authSlice.actions;
export default authSlice.reducer;
