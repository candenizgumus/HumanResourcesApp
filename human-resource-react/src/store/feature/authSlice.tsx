import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ILogin} from "../../models/ILogin";
import {IUser} from "../../models/IUser";
import {ICreateAdmin} from '../../models/ICreateAdmin';

interface IAuthState {
    user: IUser;
    userList: IUser[];
    token: string;
    isAuth: boolean;
    pageState: string;
    userType: string;
}

const initalAuthState: IAuthState = {
    user: {} as IUser,
    userList: [],
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

export const fetchGetEmployeeTypes = createAsyncThunk(
    'user/fetchGetEmployeeTypes',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('http://localhost:9090/dev/v1/user/get-employee-types');
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
interface UpdateProfile {
    token : string;
    name: string;
    surname: string;
    phone: string;
    title: string;
    birthDate: Date | null;
    position: string;
    location: string;

}
export const fetchUpdateUser = createAsyncThunk(
    'user/fetchUpdateUser',
    async (payload: UpdateProfile, { dispatch }) => {

        const response = await fetch('http://localhost:9090/dev/v1/user/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            },
            body: JSON.stringify({
                'name': payload.name,
                'surname': payload.surname,
                'phone': payload.phone,
                'title': payload.title,
                'birthDate': payload.birthDate,
                'position': payload.position,
                'location': payload.location
            })
        });

        if (!response.ok) {
            console.log(response)
            dispatch(clearToken());
        }

        return await response.json();

    }
);

interface IfetchGetAllUsers {
    token: string;
    page: number;
    pageSize: number;
    searchText: string;

}
export const fetchGetAllUsers = createAsyncThunk(
    'user/fetchGetAllUsers',
    async (payload: IfetchGetAllUsers, { dispatch }) => {
        const response = await fetch('http://localhost:9090/dev/v1/user/get-all', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            },body: JSON.stringify({
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
interface IfetchGetAllUsersOfManager {
    token: string;
    page: number;
    pageSize: number;
    searchText: string;

}
export const fetchGetAllUsersOfManager = createAsyncThunk(
    'user/fetchGetAllUsersOfManager',
    async (payload: IfetchGetAllUsersOfManager, { dispatch }) => {
        const response = await fetch('http://localhost:9090/dev/v1/user/get-all-users-of-manager-by-company-id', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer `  + payload.token
            },body: JSON.stringify({
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
interface IfetchAddEmployeeToManager {
    token: string;
    email:string;
    name:string;
    surname:string;
    phone:string;
    title:string;
    location:string;
    birthDate:Date;
    hireDate:Date;
    ePosition:string;
    eEmployeeType:string;
}
export const fetchAddEmployeeToManager = createAsyncThunk(
    'user/fetchAddEmployeeToManager',
    async (payload: IfetchAddEmployeeToManager, { dispatch }) => {
        const response = await fetch('http://localhost:9090/dev/v1/user/add-employee-to-manager', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            },body: JSON.stringify({
                'email': payload.email,
                'name': payload.name,
                'surname': payload.surname,
                'phone': payload.phone,
                'title': payload.title,
                'location': payload.location,
                'birthDate': payload.birthDate,
                'hireDate': payload.hireDate,
                'ePosition': payload.ePosition,
                'eEmployeeType': payload.eEmployeeType
            })
        });



        return await response.json();

    }
);

interface fetchGetUserCountPayload {
    token: string;
    searchText: string;
}

export const fetchGetUserCount = createAsyncThunk(
    'offer/fetchGetUserCount',
    async (payload: fetchGetUserCountPayload, { dispatch }) => {

            const response = await fetch('http://localhost:9090/dev/v1/user/get-count', {
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

export const fetchGetCustomerByMonth = createAsyncThunk(
    'offer/fetchGetUserCount',
    async (payload: string, { dispatch }) => {

        const response = await fetch('http://localhost:9090/dev/v1/user/count-by-month', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload
            }
        });

        return await response.json();

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
            .addCase(fetchUpdateUser.fulfilled, (state, action: PayloadAction<IUser>) => {

                state.user = action.payload;
            })
            .addCase(fetchGetAllUsers.fulfilled, (state, action: PayloadAction<IUser[]>) => {

                state.userList = action.payload;
            })
            .addCase(fetchGetAllUsersOfManager.fulfilled, (state, action: PayloadAction<IUser[]>) => {

                state.userList = action.payload;
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
