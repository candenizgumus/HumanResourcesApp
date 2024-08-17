import { Grid} from "@mui/material";
import { useAppSelector} from "../../store";
import SideBarOffers from "../molecules/AdminPageComponents/SideBarOffers";
import SideBarCreateAdmin  from "../molecules/AdminPageComponents/SideBarCreateAdmin";
import SideBarCreateFeature  from "../molecules/AdminPageComponents/SideBarCreateFeature";
import SideBarProfile from "../molecules/SideBarProfile";
import SideBarUsers from "../molecules/AdminPageComponents/SideBarUsers";
import CompanyList from "../molecules/AdminPageComponents/SideBarCompanies";
import SideBarAddEmployee from "../molecules/ManagerComponents/SideBarAddEmployee";
import SideBarEmployees from "../molecules/ManagerComponents/SideBarEmployees";
import {lazy} from "react";
import ChangePassword from "../molecules/ChangePassword";
import SideBarCompany from "../molecules/ManagerComponents/SideBarCompany";
import SideBarHolidayTableAdmin from "../molecules/AdminPageComponents/SideBarHolidayTableAdmin";
import SideBarCreateDefinition from "../molecules/SideBarCreateDefinition";
import SideBarNotifications from "../molecules/SideBarNotifications";
import AdminHomeContent from "../molecules/AdminPageComponents/AdminHomeContent";
import SideBarUpcomingMembershipExpiries from "../molecules/AdminPageComponents/SideBarUpcomingMembershipExpiries";
import DeactivateAccount from "../molecules/DeactivateAccount";
const EditEmployee = lazy(() => import('../molecules/ManagerComponents/EditEmployee'));
const SideBarCreateComment = lazy(() => import('../molecules/ManagerComponents/SideBarCreateComment'));
export const AdminMenuContentRenderer = () => {
    const page = useAppSelector((state) => state.auth.pageState);

    return (
        <>

            <Grid item xs={12}>
                {page === 'Offers' && <SideBarOffers />}
                {page === 'Create Admin' && <SideBarCreateAdmin />}
                {page === 'Create Feature' && <SideBarCreateFeature />}
                {page === 'Holidays' && <SideBarHolidayTableAdmin />}
                {page === 'Profile' && <SideBarProfile/>}
                {page === 'Companies' && <CompanyList/>}
                {page === 'Users' && <SideBarUsers/>}
                {page === 'Add Employee' && <SideBarAddEmployee/>}
                {page === 'Employees' && <SideBarEmployees/>}
                {page === 'Edit Employee' && <EditEmployee/>}
                {page === 'Change Password' && <ChangePassword/>}
                {page === 'Add Comment' && <SideBarCreateComment/>} 
                {page === 'Notifications' && <SideBarNotifications/>}
                {page === 'Edit Company' && <SideBarCompany/>}
                {page === 'Create Definition' && <SideBarCreateDefinition/>}
                {page === 'Dashboard' && <AdminHomeContent/>}
                {page === 'Deactivate Account' && <DeactivateAccount/>}
                {page === 'Upcoming Expiries' && <SideBarUpcomingMembershipExpiries/>}
            </Grid>
        </>
    );
};

