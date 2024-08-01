import AdminPageNavBar from "../components/organisms/AdminPageNavBar";
import SideBar from "../components/organisms/SideBar";

export const AdminPage = () => {
    return (
        <>
        <AdminPageNavBar/>

        <div className="container-fluid ">
                    <div className="row">
                        <div className="col-2 border-black shadow" >
                <SideBar/>
                </div>
                <div className="col-10">

                    
                </div>
            </div>
        </div>

        </>

    );
};
