import { Grid} from "@mui/material";
import { useAppSelector} from "../../store";
import SideBarProfile from "../molecules/SideBarProfile";
import SideBarAddEmployee from "../molecules/ManagerComponents/SideBarAddEmployee";
import SideBarEmployees from "../molecules/ManagerComponents/SideBarEmployees";
import SideBarHolidayTableUser from "../molecules/ManagerComponents/SideBarHolidayTableUser";
import SideBarNotifications from "../molecules/SideBarNotifications";
import SideBarCompany from "../molecules/ManagerComponents/SideBarCompany";
import SideBarCreateComment from "../molecules/ManagerComponents/SideBarCreateComment";
import SideBarManagerExpenditures from "../molecules/ManagerComponents/SideBarManagerExpenditures";
import SideBarManagerLeaves from "../molecules/ManagerComponents/SideBarManagerLeaves";
import ChangePassword from "../molecules/ChangePassword";
import EditEmployee from "../molecules/ManagerComponents/EditEmployee";
import SideBarPayments from "../molecules/ManagerComponents/SideBarPayments";
import PersonalDocumetList from "../molecules/ManagerComponents/SideBarPersonalDocumentList";
import SideBarManagerBonus from "../molecules/ManagerComponents/SideBarManagerBonus";
import SideBarCreateManager from "../molecules/ManagerComponents/SideBarCreateManager";
import SideBarCreateDefinition from "../molecules/SideBarCreateDefinition";
import {SetShifts} from "../molecules/ManagerComponents/SetShifts";
import SideBarCompanyItems from "../molecules/ManagerComponents/SideBarCompanyItems";
import {EmployeeHomeContent} from "../molecules/EmployeeComponents/EmployeeHomeContent";
import DeactivateAccount from "../molecules/DeactivateAccount";
import AddCompanyItemAssignment from "../molecules/ManagerComponents/AddCompanyItemAssignment";
import SideBarTask from "../molecules/ManagerComponents/SideBarTask";
import  UploadFile  from "../molecules/ManagerComponents/UploadFile"
import SlideComponent from "../molecules/ManagerComponents/SlideComponent";
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
                {// page === 'Add Document' && <AddDocument/>
                }
                {page === 'Leaves' && <SideBarManagerLeaves/>}
                {page === 'Payments' && <SideBarPayments/>}
                {page === 'Personal Documents' && <PersonalDocumetList/>}
                {page === 'Bonus' && <SideBarManagerBonus/>}
                {page === 'Create Manager' && <SideBarCreateManager/>}
                {page === 'Shift' && <SetShifts/>}
                {// page === 'Add Item' && <AddCompanyItem/>
                }
                {page === 'Company Items' && <SideBarCompanyItems/>}
                {page === 'Create Definition' && <SideBarCreateDefinition/>}
                {page === 'Dashboard' && <EmployeeHomeContent open={false}/>}
                {page === 'Deactivate Account' && <DeactivateAccount/>}
                {page === 'Assign Item' && <AddCompanyItemAssignment/>}
                {page === 'Task' && <SideBarTask/>}
                {page === 'Create Slide' && <UploadFile/>}
                {page === 'Slides' && <SlideComponent/>}
            </Grid>
        </>
    );
};

