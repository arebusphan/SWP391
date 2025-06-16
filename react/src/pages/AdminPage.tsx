import { Routes, Route } from "react-router-dom";



import LeftSideAdmin from "../components/LeftSideAdmin";
import RightSideAdmin from "./RightSideAdmin";
import AccountManager from "../components/AccountAdminPage/AddUser";
import Studentview from "../components/AccountAdminPage/Studentview"


const AdminPage = () => {
    return (
        <Routes>
            <Route element={<LeftSideAdmin />}>
                <Route index element={<RightSideAdmin />} />
                <Route path="Adduser" element={<AccountManager />} />
                <Route path="Studentview" element={<Studentview/>}/>
            </Route>
        </Routes>


    )
}
export default AdminPage;

