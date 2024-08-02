import {Button, Grid} from "@mui/material";
import {useAppSelector} from "../../store";
import OfferList from "../molecules/OfferList";
import HolidayTable from "./HolidayTable";
import CreateAdminMenuContent  from "./CreateAdminMenuContent";
import AdminHomeContent  from "./AdminHomeContent";
import Profile from "./Profile";

export const AdminMenuContents = () => {
    const page = useAppSelector((state) => state.auth.pageState);

    return (
        <>
            <Grid item xs={12}>
                {page === 'Offers' && <OfferList />}
                {page === 'Create Admin' && <CreateAdminMenuContent />}
                {page === 'Holidays' && <HolidayTable />}
                {page === 'Admin Home' && <AdminHomeContent/>}
                {page === 'Profile' && <Profile/>}
            </Grid>
        </>
    );
};
