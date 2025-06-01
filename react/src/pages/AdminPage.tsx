import { Routes, Route } from "react-router-dom";



import LeftSideAdmin from "../components/LeftSideAdmin";
import RightSideAdmin from "./RightSideAdmin";
import AccountManager from "../components/AccountAdminPage/AddUser";




const AdminPage = () => {
    return (
        <Routes>
            <Route element={<LeftSideAdmin />}>
                <Route index element={<RightSideAdmin />} />
                <Route path="Adduser" element={<AccountManager />} />
            </Route>
        </Routes>


    )
}
export default AdminPage;

