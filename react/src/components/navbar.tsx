import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

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
        <div>


            <nav
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 24px',
                    height: '60px',
                    background: '#f8f9fa',
                    borderBottom: '1px solid #eee',
                }}
            >
                <img
                    src="/jfkdnu8n.png"
                    alt="Logo"
                    className="w-20 h-20 rounded-full object-cover"
                />

                {user ? (
                    <>

                        <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
                            Đăng xuất
                        </button>
                    </>
                ) : (
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger
                            style={{
                                backgroundColor: '#dbeafe',
                                fontWeight: 600,
                                borderRadius: '12px',
                                padding: '10px 16px',
                                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                                transition: 'background-color 0.3s ease',
                            }}
                        >
                            Login
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Đăng nhập</DialogTitle>
                            <DialogDescription>
                                Nhập số điện thoại để nhận mã OTP và đăng nhập.
                            </DialogDescription>
                            <LoginForm />
                        </DialogContent>
                    </Dialog>
                )}
            </nav>
            <nav
                style={{
                    display: 'flex',
                    gap: '24px',
                    alignItems: 'center',
                    padding: '0 24px',
                    height: '48px',
                    background: '#fff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                }}
            >
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                {user && (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                    </>
                )}
            </nav>

        </div>
    );
};

export default Navbar;