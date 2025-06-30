import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBell } from "react-icons/fi";

import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from './ui/dialog';
import { LoginForm } from './login-form';
import { useAuth } from "../context/AuthContext";
import NotificationsPage from "../components/Notificationiconview"; 

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [openNotification, setOpenNotification] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="flex items-center justify-between px-6 py-3 h-20 border-b border-gray-200 shadow-sm sticky top-0 z-50 bg-white">
            <div className="flex items-center">
                <Link to="/">   <img
                    src="/logo.png"
                    alt="Logo"
                    className="w-20 h-20 object-cover"
                />
                </Link> 
            </div>

            <div className="flex items-center space-x-6">
                <ul className="flex gap-6 text-lg font-medium">
                    <li>
                        <Link
                            to="/"
                            className="transition-colors duration-200 px-4 py-2 rounded-md hover:bg-blue-500 hover:text-white"
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/about"
                            className="px-4 py-2 rounded-md hover:bg-blue-500 hover:text-white"
                        >
                            About
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/blog"
                            className="px-4 py-2 rounded-md hover:bg-blue-500 hover:text-white"
                        >
                            Blog
                        </Link>
                    </li>

                    {user && (
                        <>
                            <li>
                                <Link
                                    to="/dashboard"
                                    className="hover:bg-blue-500 hover:text-white rounded-md px-4 py-2"
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Dialog open={openNotification} onOpenChange={setOpenNotification}>
                                    <DialogTrigger asChild>
                                        <button
                                            className="text-gray-700 hover:text-blue-600 transition-colors duration-300 text-xl"
                                            title="Notifications"
                                        >
                                            <FiBell />
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                        <NotificationsPage />
                                    </DialogContent>
                                </Dialog>
                            </li>
                        </>
                    )}
                </ul>

                {user ? (
                    <button
                        onClick={handleLogout}
                        className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg font-semibold transition"
                    >

                        Logout
                    </button>
                ) : (
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-2 rounded-lg font-semibold transition">
                            Login
                        </DialogTrigger>
                        <DialogContent>
                            <LoginForm />
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
