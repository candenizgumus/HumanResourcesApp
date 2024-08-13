import {configureStore} from "@reduxjs/toolkit";
import {
    authSlice, companySlice, featureSlice, offerSlice, userStorySlice, holidaySlice,
    passwordResetSlice,
    notificationSlice, expenditureSlice, personalDocumentSlice,
    leaveSlice
} from "./feature";


import {useSelector} from "react-redux";
import paymentSlice from "./feature/paymentSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        feature: featureSlice,
        offer: offerSlice,
        company: companySlice,
        userStory: userStorySlice,
        holiday: holidaySlice,
        passwordReset: passwordResetSlice,
        notification: notificationSlice,
        expenditure: expenditureSlice,
        personalDocument: personalDocumentSlice,
        leave:leaveSlice,
        payment:paymentSlice

    }
});

export type HumanResources = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector = useSelector.withTypes<RootState>();
export default store;