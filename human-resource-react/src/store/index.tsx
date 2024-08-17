import {configureStore} from "@reduxjs/toolkit";
import {
    authSlice, companySlice, featureSlice, offerSlice, userStorySlice, holidaySlice,
    passwordResetSlice,
    notificationSlice, expenditureSlice, personalDocumentSlice,
    leaveSlice, bonusSlice, paymentSlice, shiftSlice,
    definitionSlice, emailSlice
} from "./feature";


import {useSelector} from "react-redux";


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
        payment:paymentSlice,
        bonus:bonusSlice,
        shift:shiftSlice,
        definition: definitionSlice,
        email: emailSlice

    }
});

export type HumanResources = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector = useSelector.withTypes<RootState>();
export default store;