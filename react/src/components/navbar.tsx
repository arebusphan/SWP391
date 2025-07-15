import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiBell, FiLogIn, FiLogOut } from "react-icons/fi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { LoginForm } from "./login-form";
import { useAuth } from "../context/AuthContext";
import NotificationsPage from "../components/Notificationiconview";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [scrollDir, setScrollDir] = useState<"up" | "down">("up");
  const [hovering, setHovering] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const dashboardRoutes = [
    "/dashboard",
    "/AdminPage",
    "/ParentPage",
    "/MedicalStaffPage",
    "/ManagerPage",
  ];
  const isDashboardRoute = dashboardRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrollDir(currentY > lastY ? "down" : "up");
      setScrollY(currentY);
      lastY = currentY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const nearTop = scrollY <= 30;
  const shrink = scrollY > 30;

  let hide = false;
  if (isDashboardRoute) {
    hide = !hovering;
  } else {
    hide = scrollDir === "down" && shrink && !hovering && !open;
  }

  const topClass = hide ? "-top-20" : "top-0";
  const scaleClass = isDashboardRoute ? "scale-95" : nearTop ? "scale-100" : "scale-95";
  const roundClass = isDashboardRoute
    ? "rounded-xl mx-4"
    : nearTop
    ? "rounded-none mx-0"
    : "rounded-xl mx-4";

  const handleMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHovering(true);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => {
      setHovering(false);
    }, 500); // delay để tránh giật
  };

  return (
    <>
      {/* Vùng hover */}
      <div
        className={`fixed z-30 h-20 top-0 transition-all duration-500 ease-in-out 
          ${roundClass}
          ${isDashboardRoute ? "left-10 right-4" : "left-0 right-0"}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      {/* Navbar chính */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`fixed z-40 w-full transition-all duration-500 ease-in-out ${topClass}`}
      >
        <nav
          className={`flex items-center justify-between px-6 py-3 h-20
            border border-gray-200 shadow-md bg-white
            transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
            ${roundClass} ${scaleClass}`}
        >
          <div className="flex items-center">
            <Link to="/">
              <img
                src="/z6759560753295_48e4ffbf710bd2f566f182b8e8953f65.jpg"
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
                    <Dialog
                      open={openNotification}
                      onOpenChange={setOpenNotification}
                    >
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
                className="flex items-center gap-2 bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg font-semibold transition"
              >
                <FiLogOut className="text-xl" />
                Logout
              </button>
            ) : (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-xl font-semibold shadow transition">
                    <FiLogIn className="text-xl" />
                    Login
                  </button>
                </DialogTrigger>

                <DialogContent className="max-w-md rounded-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-blue-700">
                      Login
                    </DialogTitle>
                  </DialogHeader>
                  <LoginForm className="pt-2" />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
