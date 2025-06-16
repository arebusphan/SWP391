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
import NotificationsPage from "../components/Notificationiconview"; // Đường dẫn có thể cần sửa tùy thư mục

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
        <nav className="flex items-center justify-between px-6 h-20 border-b border-gray-200 shadow-sm sticky top-0 z-50 bg-white">
            <div className="flex items-center">
                <img
                    src="/logo.png"
                    alt="Logo"
                    className="w-20 h-20 object-cover"
                />
            </div>

            <div className="flex items-center gap-6">
                <ul className="flex gap-6 text-lg font-medium">
                    <li>
                        <Link
                            to="/"
                            className="text-gray-700 hover:text-blue-600 transition-colors duration-300"
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/about"
                            className="text-gray-700 hover:text-blue-600 transition-colors duration-300"
                        >
                            About
                        </Link>
                    </li>
                    <li>
                        <Link
                            to=""
                            className="text-gray-700 hover:text-blue-600 transition-colors duration-300"
                        >
                            Blog
                        </Link>
                    </li>

                    {user && (
                        <>
                            <li>
                                <Link
                                    to="/dashboard"
                                    className="text-gray-700 hover:text-blue-600 transition-colors duration-300"
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
