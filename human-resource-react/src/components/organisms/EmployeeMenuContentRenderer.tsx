import { Grid} from "@mui/material";
import { useAppSelector} from "../../store";
import SideBarProfile from "../molecules/SideBarProfile";
import {SideBarEmployeeShiftsAndBreaks} from "../molecules/EmployeeComponents/SideBarEmployeeShiftsAndBreaks";
import {SideBarEmployeeLeaves} from "../molecules/EmployeeComponents/SideBarEmployeeLeaves";
import {SideBarEmployeeCompanyItems} from "../molecules/EmployeeComponents/SideBarEmployeeCompanyItems";
import SideBarNotifications from "../molecules/AdminPageComponents/SideBarNotifications";
import SideBarExpenditure from "../molecules/EmployeeComponents/SideBarExpenditure";
import SideBarEmployeeHolidays from "../molecules/EmployeeComponents/SideBarEmployeeHolidays";
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
            </Grid>
        </>
    );
};

