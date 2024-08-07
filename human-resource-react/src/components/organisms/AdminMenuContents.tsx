import {Button, Grid} from "@mui/material";
import {HumanResources, useAppSelector} from "../../store";
import SideBarOffers from "../molecules/SideBarOffers";
import SideBarHolidayTable from "../molecules/SideBarHolidayTable";
import CreateAdminMenuContent  from "../molecules/AdminPageComponents/SideBarCreateAdmin";
import AdminHomeContent  from "./AdminHomeContent";
import SideBarProfile from "../molecules/SideBarProfile";
import { useEffect } from "react";
import { clearToken, fetchFindUserByToken } from "../../store/feature/authSlice";
import { useDispatch } from "react-redux";
import SideBarUsers from "../molecules/SideBarUsers";
import CompanyList from "../molecules/SideBarCompanies";
import SideBarAddEmployee from "../molecules/ManagerComponents/SideBarAddEmployee";

export const AdminMenuContents = () => {
    const page = useAppSelector((state) => state.auth.pageState);

    return (
        <>
            <Grid item xs={12}>
                {page === 'Offers' && <SideBarOffers />}
                {page === 'Create Admin' && <CreateAdminMenuContent />}
                {page === 'Holidays' && <SideBarHolidayTable />}
                {page === 'Profile' && <SideBarProfile/>}
                {page === 'Companies' && <CompanyList/>}
                {page === 'Users' && <SideBarUsers/>}
                {page === 'Add Employee' && <SideBarAddEmployee/>}
            </Grid>
        </>
    );
};
