import {Button, Grid} from "@mui/material";
import * as React from "react";
import {changePageState} from "../../store/feature/authSlice";
import DataTable2 from "../molecules/DataTable2";
import {useDispatch} from "react-redux";
import {HumanResources, useAppSelector} from "../../store";
import OfferList from "../molecules/OfferList";
import HolidayTable from "../molecules/HolidayTable";

export const AdminMenuContents = () => {
    const page = useAppSelector((state) => state.auth.pageState);

    return (
        <>
            <Grid item xs={10}>
                {page === 'OfferList' && <OfferList />}
                {page === 'DataTable2' && <DataTable2 />}
                {page === 'HolidayTable' && <HolidayTable />}

            </Grid>
            <Grid item xs={2}>
                Another Content
            </Grid>
        </>
    );
};
