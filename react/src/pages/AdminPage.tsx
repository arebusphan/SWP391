import { Routes, Route, Navigate } from "react-router-dom";

import LeftSideAdmin from "../components/LeftSideAdmin";
import AccountManager from "../components/AccountAdminPage/AddUser";
import Studentview from "../components/AccountAdminPage/Studentview";

const AdminPage = () => {
    return (
        <Routes>
            <Route element={<LeftSideAdmin />}>
                {/* ✅ Mặc định chuyển hướng về Adduser */}
                <Route index element={<Navigate to="Adduser" replace />} />
                
                <Route path="Adduser" element={<AccountManager />} />
                <Route path="Studentview" element={<Studentview />} />
            </Route>
        </Routes>
    );
};

export default AdminPage;
