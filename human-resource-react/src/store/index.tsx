import { configureStore } from "@reduxjs/toolkit";
import {
    authSlice, featureSlice
} from "./feature";

const store = configureStore({
    reducer:{
        auth: authSlice,
        feature: featureSlice
    }
});

export type HumanResources = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;