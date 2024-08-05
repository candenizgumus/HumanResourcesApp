import {Button, Grid} from "@mui/material";
import {HumanResources, useAppSelector} from "../../store";
import OfferList from "../molecules/OfferList";
import HolidayTable from "./HolidayTable";
import CreateAdminMenuContent  from "./CreateAdminMenuContent";
import AdminHomeContent  from "./AdminHomeContent";
import Profile from "./Profile";
import { useEffect } from "react";
import { clearToken, fetchFindUserByToken } from "../../store/feature/authSlice";
import { useDispatch } from "react-redux";

export const AdminMenuContents = () => {
    const page = useAppSelector((state) => state.auth.pageState);

    return (
        <>
            <Grid item xs={12}>
                {page === 'Offers' && <OfferList />}
                {page === 'Create Admin' && <CreateAdminMenuContent />}
                {page === 'Holidays' && <HolidayTable />}
                {page === 'Profile' && <Profile/>}
            </Grid>
        </>
    );
};
