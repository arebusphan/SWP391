import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './navbar';
import Footer from './footer';

const Layout = () => {
    const location = useLocation();


    const hideFooterRoutes = [
        "/dashboard",
        "/ParentPage",
        "/MedicalStaffPage",
        "/AdminPage",
        "/ManagerPage"
    ];


    const shouldHideFooter = hideFooterRoutes.some((route) =>
        location.pathname.startsWith(route)
    );

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            {!shouldHideFooter && <Footer />}
        </div>
    );
};

export default Layout;
