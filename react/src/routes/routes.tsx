import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout";
import ParentPage from "../pages/ParentPage";
import AdminPage from "../pages/AdminPage";
import MedicalStaffPage from "../pages/MedicalStaffPage";
import AboutPage from "../pages/AboutPage";
import DashboardRedirect from "../pages/NavigateDashboard";
import Unauthorized from "../pages/Unauthorized";

// Route bảo vệ quyền truy cập theo vai trò
import ProtectedRoute from "./ProtectedRoute";
import ManagerPage from "../pages/ManagerPage";
import HomePage from "../pages/HomePage";

const AppRoutes = () => {
    return (
        <Routes>
           
            <Route path="/" element={<Layout />}>

                <Route
                    index
                    element={ <HomePage/>}
                />

            
                <Route path="/about" element={<AboutPage />} />

                <Route path="/unauthorized" element={<Unauthorized />} />

                
                <Route path="/dashboard" element={<DashboardRedirect />} />

                <Route element={<ProtectedRoute allowedRoles={["Parent"]} />}>
                    <Route path="/ParentPage/*" element={<ParentPage />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={["MedicalStaff"]} />}>
                    <Route path="/MedicalStaffPage/*" element={<MedicalStaffPage />} />
                </Route>

        
                <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
                    <Route path="/AdminPage/*" element={<AdminPage />} />
                </Route>
                <Route element={<ProtectedRoute allowedRoles={["Manager"]} />}>
                    <Route path="/ManagerPage/*" element={<ManagerPage />} />
                </Route>

            </Route>
        </Routes>
    );
};

export default AppRoutes;
