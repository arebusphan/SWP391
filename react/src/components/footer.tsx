import {
    MdLocationOn,
    MdPhone,
    MdEmail,
    MdAccessTime,
    MdFacebook,
    MdMessage,
    MdPeopleAlt,
    MdHome,
    MdInfo,
    MdDashboard,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { LoginForm } from "@/components/login-form";

const Footer = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [openLogin, setOpenLogin] = useState(false);

    const handleDashboardClick = () => {
        if (!user) {
            setOpenLogin(true);
            return;
        }
        switch (user.Role) {
            case "Parent":
                navigate("/ParentPage");
                break;
            case "MedicalStaff":
                navigate("/MedicalPage");
                break;
            case "Manager":
                navigate("/ManagerPage");
                break;
            default:
                navigate("/dashboard");
        }
    };

    return (
        <>
            {/* Login Modal */}
            <Dialog open={openLogin} onOpenChange={setOpenLogin}>
                <DialogContent className="max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-blue-700">
                            Login
                        </DialogTitle>
                    </DialogHeader>
                    <LoginForm className="pt-2" />
                </DialogContent>
            </Dialog>

            {/* ==== Footer ==== */}
            <footer
                className="
          bg-blue-50 text-gray-700
          shadow-[inset_0_6px_12px_-6px_rgba(0,0,0,0.15)]
          border-t-4 border-blue-400
          rounded-t-2xl
          relative z-10
        "
            >
                <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 text-sm">
                    {/* School Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-blue-800">
                            FPT Primary School
                        </h3>
                        <p className="flex items-center gap-2">
                            <MdLocationOn className="text-blue-600" /> Thu Duc
                        </p>
                        <p className="flex items-center gap-2">
                            <MdPhone className="text-blue-600" /> 0703250127
                        </p>
                        <p className="flex items-center gap-2">
                            <MdEmail className="text-blue-600" /> contact@fptprimary.edu.vn
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-blue-800">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            {[
                                { href: "/", icon: MdHome, label: "Home" },
                                { href: "/about", icon: MdInfo, label: "About Us" },
                            ].map((l) => (
                                <li key={l.label}>
                                    <a
                                        href={l.href}
                                        className="flex items-center gap-2 hover:text-blue-600 transition"
                                    >
                                        <l.icon /> {l.label}
                                    </a>
                                </li>
                            ))}
                            <li>
                                <span
                                    onClick={handleDashboardClick}
                                    className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition"
                                >
                                    <MdDashboard /> Dashboard
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Support & Social */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-blue-800">
                            Health Support
                        </h3>
                        <p className="flex items-center gap-2">
                            <MdPhone className="text-blue-600" /> Hotline: 1900123456
                        </p>
                        <p className="flex items-center gap-2">
                            <MdEmail className="text-blue-600" /> support@healthschool.edu.vn
                        </p>
                        <p className="mt-2 text-sm italic">
                            24/7 student health consulting
                        </p>

                        <h3 className="text-lg font-semibold mt-6 mb-3 text-blue-800">
                            Opening Hours
                        </h3>
                        <p className="flex items-center gap-2">
                            <MdAccessTime className="text-blue-600" />Monday-Friday: Open
                        </p>
                        <p className="flex items-center gap-2">
                            <MdAccessTime className="text-blue-600" />Saturday-Sunday: Close
                        </p>

                        <h3 className="text-lg font-semibold mt-6 mb-3 text-blue-800">
                            Follow Us
                        </h3>
                        <div className="flex space-x-4">
                            <a
                                href="https://facebook.com"
                                className="flex items-center gap-1 hover:text-blue-600 transition"
                            >
                                <MdFacebook /> Facebook
                            </a>
                            <a
                                href="https://zalo.me"
                                className="flex items-center gap-1 hover:text-blue-600 transition"
                            >
                                <MdMessage /> Zalo
                            </a>
                            <a
                                href="https://discord.com"
                                className="flex items-center gap-1 hover:text-blue-600 transition"
                            >
                                <MdPeopleAlt /> Discord
                            </a>
                        </div>
                    </div>
                </div>

                <div className="text-center text-xs text-gray-500 border-t border-blue-200 py-4">
                   @FptSchool
                </div>
            </footer>
        </>
    );
};

export default Footer;
