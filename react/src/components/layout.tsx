import Navbar from './navbar';
import { Outlet } from 'react-router-dom';
import Footer from './footer';
const Layout = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: "150vh" }}>
            <Navbar />
            <main style={{ flex: "1" }}>
                <Outlet />
            </main>
            <Footer />

        </div>
    )
}
export default Layout;