import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout";

import ParentPage from "../pages/ParentPage";
import AdminPage from "../pages/AdminPage";
import DashboardRedirect from "../pages/NavigateDashboard";
import Unauthorized from "../pages/Unauthorized";
import ProtectedRoute from "./ProtectedRoute";
import AboutPage from "../pages/AboutPage";
import MedicalStaff from "../pages/MedicalStaffPage";



const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={
                    <div style={{ width: "500px" }}>
                        <img src="/meo-cam-bong-hoa-tren-tay-manh-me-len-23-09-00-15.jpg" alt="cat" />
                    </div>
                } />
                <Route path="/about" element={< AboutPage />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/dashboard" element={<DashboardRedirect />} />


                <Route element={<ProtectedRoute allowedRoles={["Parent"]} />}>
                    <Route path="/ParentPage/*" element={<ParentPage />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={["MedicalStaff"]} />}>
                    <Route path="/MedicalStaffPage" element={<MedicalStaff />} />
                </Route>


                <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
                    <Route path="/AdminPage" element={<AdminPage />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;
