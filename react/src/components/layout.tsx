import Navbar from './navbar';
import { Outlet } from 'react-router-dom';
import Footer from './footer';
const Layout = () => {
    return (
        <div>
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />

        </div>
    )
}
export default Layout;