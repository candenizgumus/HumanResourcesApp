import { configureStore } from "@reduxjs/toolkit";
import {
    authSlice, featureSlice
} from "./feature";
import getOfferSlice from "./feature/getOfferSlice";
import {useSelector} from "react-redux";

const store = configureStore({
    reducer:{
        auth: authSlice,
        feature: featureSlice,
        getOffer: getOfferSlice

    }
});

export type HumanResources = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector = useSelector.withTypes<RootState>();
export default store;