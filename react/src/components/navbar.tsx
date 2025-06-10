import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from './ui/dialog';
import { LoginForm } from './login-form';
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="flex items-center justify-between px-6 h-20 border-b border-gray-200 shadow-sm sticky top-0 z-50 bg-white">
            {/* Logo bên trái */}
            <div className="flex items-center ">
                <img
                    src="/logo.png"
                    alt="Logo"
                    className="w-20 h-20  object-cover"
                />
            </div>

            {/* Menu và Auth bên phải */}
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
                    {user && (
                        <li>
                            <Link
                                to="/dashboard"
                                className="text-gray-700 hover:text-blue-600 transition-colors duration-300"
                            >
                                Dashboard
                            </Link>
                        </li>
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
                        <DialogTrigger
                            className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-2 rounded-lg font-semibold transition"
                        >
                            Login
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle></DialogTitle>
                            <DialogDescription>
                                
                            </DialogDescription>
                            <LoginForm />
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
