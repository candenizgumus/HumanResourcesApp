import {Button, Grid} from "@mui/material";
import * as React from "react";
import {changePageState} from "../../store/feature/authSlice";
import DataTable2 from "../molecules/DataTable2";
import {useDispatch} from "react-redux";
import {HumanResources, useAppSelector} from "../../store";

export const AdminMenuContents = () => {
    const page = useAppSelector((state) => state.auth.pageState);
    const dispatch = useDispatch<HumanResources>();
    const handlePageState = () => {
        dispatch(changePageState( <DataTable2 />   ));
    };
    return (
        <>
            <Grid item xs={10}>
                {page}

                <Button onClick={handlePageState} variant="outlined" color="primary" sx={{ mr: 2 }}>Change datas to data table 2</Button>
            </Grid>
            <Grid item xs={2}>
                Another Content
            </Grid>
        </>
    );
};
