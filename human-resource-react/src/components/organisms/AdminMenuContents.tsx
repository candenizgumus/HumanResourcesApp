import {Button, Grid} from "@mui/material";
import {useAppSelector} from "../../store";
import OfferList from "../molecules/OfferList";
import HolidayTable from "./HolidayTable";
import CreateAdminMenuContent  from "./CreateAdminMenuContent";

export const AdminMenuContents = () => {
    const page = useAppSelector((state) => state.auth.pageState);

    return (
        <>
            <Grid item xs={10}>
                {page === 'Offers' && <OfferList />}
                {page === 'Create Admin' && <CreateAdminMenuContent />}
                {page === 'Holidays' && <HolidayTable />}
                {page === 'Admin Home' && <></>}
            </Grid>
        </>
    );
};
