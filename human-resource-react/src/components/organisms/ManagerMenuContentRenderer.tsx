import { Grid} from "@mui/material";
import { useAppSelector} from "../../store";
import SideBarOffers from "../molecules/AdminPageComponents/SideBarOffers";
import SideBarHolidayTableAdmin from "../molecules/AdminPageComponents/SideBarHolidayTableAdmin";
import CreateAdminMenuContent  from "../molecules/AdminPageComponents/SideBarCreateAdmin";
import SideBarProfile from "../molecules/SideBarProfile";
import SideBarUsers from "../molecules/AdminPageComponents/SideBarUsers";
import CompanyList from "../molecules/AdminPageComponents/SideBarCompanies";
import SideBarAddEmployee from "../molecules/ManagerComponents/SideBarAddEmployee";
import SideBarEmployees from "../molecules/ManagerComponents/SideBarEmployees";
import {SideBarEmployeeShiftsAndBreaks} from "../molecules/EmployeeComponents/SideBarEmployeeShiftsAndBreaks";
import {SideBarEmployeeLeaves} from "../molecules/EmployeeComponents/SideBarEmployeeLeaves";
import {SideBarEmployeeCompanyItems} from "../molecules/EmployeeComponents/SideBarEmployeeCompanyItems";
import {lazy} from "react";
import SideBarHolidayFormUser from "../molecules/ManagerComponents/SideBarHolidayFormUser";
import SideBarHolidayTableUser from "../molecules/ManagerComponents/SideBarHolidayTableUser";
const EditEmployee = lazy(() => import('../molecules/ManagerComponents/EditEmployee'));
export const ManagerMenuContentRenderer = () => {
    const page = useAppSelector((state) => state.auth.pageState);

    return (
        <>
            <Grid item xs={12}>
                {page === 'Holidays' && <SideBarHolidayTableUser />}
                {page === 'Profile' && <SideBarProfile/>}
                {page === 'Add Employee' && <SideBarAddEmployee/>}
                {page === 'Employees' && <SideBarEmployees/>}
            </Grid>
        </>
    );
};

