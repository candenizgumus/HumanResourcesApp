import { Grid} from "@mui/material";
import { useAppSelector} from "../../store";
import SideBarProfile from "../molecules/SideBarProfile";
import {SideBarEmployeeShiftsAndBreaks} from "../molecules/EmployeeComponents/SideBarEmployeeShiftsAndBreaks";
import SideBarEmployeeLeaves from "../molecules/EmployeeComponents/SideBarEmployeeLeaves";
import {SideBarEmployeeCompanyItems} from "../molecules/EmployeeComponents/SideBarEmployeeCompanyItems";
import SideBarNotifications from "../molecules/SideBarNotifications";
import SideBarExpenditure from "../molecules/EmployeeComponents/SideBarExpenditure";
import SideBarEmployeeHolidays from "../molecules/EmployeeComponents/SideBarEmployeeHolidays";
import ChangePassword from "../molecules/ChangePassword";
import SideBarEmployeeBonus from "../molecules/EmployeeComponents/SideBarEmployeeBonus";
import {ManagerHomeContent} from "../molecules/ManagerComponents/ManagerHomeContent";
export const EmployeeMenuContentRenderer = () => {
    const page = useAppSelector((state) => state.auth.pageState);

    return (
        <>
            <Grid item xs={12}>
                {page === 'Shifts & Breaks' && <SideBarEmployeeShiftsAndBreaks />}
                {page === 'Holidays' && <SideBarEmployeeHolidays/>}
                {page === 'Leaves' && <SideBarEmployeeLeaves/>}
                {page === 'Profile' && <SideBarProfile/>}
                {page === 'Company Items' && <SideBarEmployeeCompanyItems/>}
                {page === 'Notifications' && <SideBarNotifications/>}
                {page === 'Expenditure' && <SideBarExpenditure/>}
                {page === 'Change Password' && <ChangePassword/>}
                {page === 'Bonus' && <SideBarEmployeeBonus/>}
                {page === 'Dashboard' && <ManagerHomeContent/>}
            </Grid>
        </>
    );
};

