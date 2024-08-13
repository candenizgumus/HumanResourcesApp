import { Grid} from "@mui/material";
import { useAppSelector} from "../../store";
import SideBarProfile from "../molecules/SideBarProfile";
import SideBarAddEmployee from "../molecules/ManagerComponents/SideBarAddEmployee";
import SideBarEmployees from "../molecules/ManagerComponents/SideBarEmployees";
import SideBarHolidayTableUser from "../molecules/ManagerComponents/SideBarHolidayTableUser";
import SideBarNotifications from "../molecules/AdminPageComponents/SideBarNotifications";
import SideBarCompany from "../molecules/ManagerComponents/SideBarCompany";
import SideBarCreateComment from "../molecules/ManagerComponents/SideBarCreateComment";
import SideBarManagerExpenditures from "../molecules/ManagerComponents/SideBarManagerExpenditures";
import SideBarManagerLeaves from "../molecules/ManagerComponents/SideBarManagerLeaves";
import ChangePassword from "../molecules/ChangePassword";
import EditEmployee from "../molecules/ManagerComponents/EditEmployee";
import AddDocument from "../molecules/ManagerComponents/AddDocument";
import SideBarPayments from "../molecules/ManagerComponents/SideBarPayments";
export const ManagerMenuContentRenderer = () => {
    const page = useAppSelector((state) => state.auth.pageState);

    return (
        <>
            <Grid item xs={12}>
                {page === 'Holidays' && <SideBarHolidayTableUser />}
                {page === 'Profile' && <SideBarProfile/>}
                {page === 'Add Employee' && <SideBarAddEmployee/>}
                {page === 'Employees' && <SideBarEmployees/>}
                {page === 'Notifications' && <SideBarNotifications/>}
                {page === 'Company' && <SideBarCompany/>}
                {page === 'Add Comment' && <SideBarCreateComment/>}
                {page === 'Expenditure' && <SideBarManagerExpenditures/>}
                {page === 'Change Password' && <ChangePassword/>}
                {page === 'Edit Employee' && <EditEmployee/>}
                {page === 'Add Document' && <AddDocument/>}
                {page === 'Leaves' && <SideBarManagerLeaves/>}
                {page === 'Payments' && <SideBarPayments/>}
            </Grid>
        </>
    );
};

