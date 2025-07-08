import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./footer";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AlertNotification from "../components/MedicalStaffPage/AlertNotification";
import type { AlertItem } from "@/components/MedicalStaffPage/AlertNotification";

let nextId = 1;

const Layout = () => {
  const location = useLocation();
  const {
    user,
    justLoggedIn,
    setJustLoggedIn,
    justLoggedOut,
    setJustLoggedOut,
  } = useAuth();

  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const addAlert = (alert: Omit<AlertItem, "id">) => {
    const newAlert = { ...alert, id: nextId++ };
    setAlerts((prev) => [...prev, newAlert]);
  };

  const removeAlert = (id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  // ✅ Welcome alert khi login
  useEffect(() => {
    if (justLoggedIn && user?.Name) {
      addAlert({
        type: "success",
        title: `Welcome, ${user.Name}!`,
        description: "You have successfully logged in.",
      });
      setJustLoggedIn(false); // chỉ hiển thị 1 lần
    }
  }, [justLoggedIn, user, setJustLoggedIn]);

  // ✅ Goodbye alert khi logout
  useEffect(() => {
    if (justLoggedOut) {
      addAlert({
        type: "success",
        title: "Goodbye!",
        description: "You have successfully logged out.",
      });
      setJustLoggedOut(false); // chỉ hiển thị 1 lần
    }
  }, [justLoggedOut, setJustLoggedOut]);

  // Ẩn footer ở các trang dashboard
  const hideFooterRoutes = [
    "/dashboard",
    "/ParentPage",
    "/MedicalStaffPage",
    "/AdminPage",
    "/ManagerPage",
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

      {/* ✅ Alert nằm góc phải trên */}
      <AlertNotification alerts={alerts} onRemove={removeAlert} />
    </div>
  );
};

export default Layout;
