import {Button, Grid} from "@mui/material";
import {HumanResources, useAppSelector} from "../../store";
import SideBarOffers from "../molecules/SideBarOffers";
import SideBarHolidayTable from "../molecules/SideBarHolidayTable";
import CreateAdminMenuContent  from "../molecules/AdminPageComponents/SideBarCreateAdmin";
import AdminHomeContent  from "../molecules/AdminPageComponents/AdminHomeContent";
import SideBarProfile from "../molecules/SideBarProfile";
import { useEffect } from "react";
import { clearToken, fetchFindUserByToken } from "../../store/feature/authSlice";
import { useDispatch } from "react-redux";
import SideBarUsers from "../molecules/SideBarUsers";
import CompanyList from "../molecules/SideBarCompanies";
import SideBarAddEmployee from "../molecules/ManagerComponents/SideBarAddEmployee";
import SideBarEmployees from "../molecules/ManagerComponents/SideBarEmployees";
import {SideBarEmployeeShiftsAndBreaks} from "../molecules/EmployeeComponents/SideBarEmployeeShiftsAndBreaks";
import {SideBarEmployeeHolidays} from "../molecules/EmployeeComponents/SideBarEmployeeHolidays";
import {SideBarEmployeeLeaves} from "../molecules/EmployeeComponents/SideBarEmployeeLeaves";
import {SideBarEmployeeCompanyItems} from "../molecules/EmployeeComponents/SideBarEmployeeCompanyItems";

export const AdminMenuContentRenderer = () => {
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
                {page === 'Employees' && <SideBarEmployees/>}
                {page === 'Shifts & Breaks' && <SideBarEmployeeShiftsAndBreaks />}
                {page === 'Leaves' && <SideBarEmployeeLeaves/>}
                {page === 'Company Items' && <SideBarEmployeeCompanyItems/>}
            </Grid>
        </>
    );
};
