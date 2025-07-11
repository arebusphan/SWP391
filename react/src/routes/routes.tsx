﻿import { Routes, Route } from "react-router-dom";
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
import BlogPage from "../pages/BlogPage";
import BlogDetail from "../pages/BLogDetails";

const AppRoutes = () => {
    return (
        <Routes>
           
            <Route path="/" element={<Layout />}>

                <Route
                    index
                    element={ <HomePage/>}
                />
                <Route path="/dashboard" element={<DashboardRedirect />} />
            
                <Route path="/about" element={<AboutPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
    

                <Route element={<ProtectedRoute allowedRoles={["Parent"]} />}>
                    <Route path="/ParentPage/*" element={<ParentPage />} />
                </Route>
                <Route path="/blogs/:id" element={<BlogDetail />} />
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
