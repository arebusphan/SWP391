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
      {/* Login Modal giống Navbar */}
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

      <footer className="bg-white text-gray-800 relative z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.12)] border-t-2 border-white">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 text-sm">
          {/* School Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-blue-700">FPT Primary School</h3>
            <p className="flex items-center gap-2">
              <MdLocationOn /> P. Tăng Nhơn Phú, TP.HCM
            </p>
            <p className="flex items-center gap-2">
              <MdPhone /> 0703 250 127
            </p>
            <p className="flex items-center gap-2">
              <MdEmail /> contact@fptprimary.edu.vn
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-blue-700">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="hover:underline hover:text-blue-600 flex items-center gap-2"
                >
                  <MdHome /> Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="hover:underline hover:text-blue-600 flex items-center gap-2"
                >
                  <MdInfo /> About Us
                </a>
              </li>
              <li>
                <span
                  onClick={handleDashboardClick}
                  className="hover:underline hover:text-blue-600 flex items-center gap-2 cursor-pointer"
                >
                  <MdDashboard /> Dashboard
                </span>
              </li>
            </ul>
          </div>

          {/* Support & Social */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-blue-700">Health Support</h3>
            <p className="flex items-center gap-2"><MdPhone /> Hotline: 1900 123 456</p>
            <p className="flex items-center gap-2"><MdEmail /> support@healthschool.edu.vn</p>
            <p className="mt-2 text-sm italic">24/7 student health consulting</p>

            <h3 className="text-lg font-semibold mt-6 mb-3 text-blue-700">Opening Hours</h3>
            <p className="flex items-center gap-2"><MdAccessTime /> Mon – Fri: 07:30 AM – 05:00 PM</p>
            <p className="flex items-center gap-2"><MdAccessTime /> Sat – Sun: Closed</p>

            <h3 className="text-lg font-semibold mt-6 mb-3 text-blue-700">Follow Us</h3>
            <div className="flex space-x-4 text-sm">
              <a href="https://facebook.com" className="hover:text-blue-600 flex items-center gap-1">
                <MdFacebook /> Facebook
              </a>
              <a href="https://zalo.me" className="hover:text-blue-600 flex items-center gap-1">
                <MdMessage /> Zalo
              </a>
              <a href="https://discord.com" className="hover:text-blue-600 flex items-center gap-1">
                <MdPeopleAlt /> Discord
              </a>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 border-t border-gray-200 py-4 bg-gray-50">
          © 2025 FPT Primary School. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default Footer;
