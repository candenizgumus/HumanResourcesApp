import { configureStore } from "@reduxjs/toolkit";
import {
    authSlice
} from "./feature";

const store = configureStore({
    reducer:{
        auth: authSlice,

    }
});

export type HumanResources = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;