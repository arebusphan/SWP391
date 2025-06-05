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

const AppRoutes = () => {
    return (
        <Routes>
            {/* Route gốc "/" sẽ luôn dùng chung layout */}
            <Route path="/" element={<Layout />}>

                {/* Trang chính hoặc landing page */}
                <Route
                    index
                    element={
                        <div className="text-center py-10">
                            {/* Ảnh trang chào mừng */}
                            <img
                                src="/hinhnen.png"
                                alt="Trang chào mừng"
                                className="mx-auto max-w-xs rounded shadow"
                            />
                            <h1 className="text-xl font-semibold mt-4">Chào mừng đến hệ thống y tế học đường</h1>
                        </div>
                    }
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

            </Route>
        </Routes>
    );
};

export default AppRoutes;
