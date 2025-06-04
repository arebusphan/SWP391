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
                                src="/meo-cam-bong-hoa-tren-tay-manh-me-len-23-09-00-15.jpg"
                                alt="Trang chào mừng"
                                className="mx-auto max-w-xs rounded shadow"
                            />
                            <h1 className="text-xl font-semibold mt-4">Chào mừng đến hệ thống y tế học đường</h1>
                        </div>
                    }
                />

                {/* Giới thiệu hệ thống */}
                <Route path="/about" element={<AboutPage />} />

                {/* Trang khi người dùng không đủ quyền */}
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Tự động điều hướng đến dashboard tương ứng với role */}
                <Route path="/dashboard" element={<DashboardRedirect />} />

                {/* Khu vực dành riêng cho phụ huynh */}
                <Route element={<ProtectedRoute allowedRoles={["Parent"]} />}>
                    <Route path="/phu-huynh/*" element={<ParentPage />} />
                </Route>

                {/* Khu vực dành cho nhân viên y tế */}
                <Route element={<ProtectedRoute allowedRoles={["MedicalStaff"]} />}>
                    <Route path="/nhan-vien-y-te/*" element={<MedicalStaffPage />} />
                </Route>

                {/* Khu vực dành cho quản trị viên */}
                <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
                    <Route path="/quan-tri/*" element={<AdminPage />} />
                </Route>

            </Route>
        </Routes>
    );
};

export default AppRoutes;
