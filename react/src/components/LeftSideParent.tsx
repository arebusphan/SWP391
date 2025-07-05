import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  MdPerson,
  MdNotifications,
  MdHistory,
  MdLocalPharmacy,
  MdMenu,
  MdVaccines,
} from "react-icons/md";

const LeftSideParent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Đọc trạng thái sidebar từ localStorage khi khởi tạo
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem("parent_sidebar");
    return saved === "false" ? false : true;
  });

  // ✅ Toggle + lưu trạng thái vào localStorage
  const toggleSidebar = () => {
    setIsOpen((prev) => {
      const newState = !prev;
      localStorage.setItem("parent_sidebar", newState.toString());
      return newState;
    });
  };

  const menuItems = [
    {
      label: "Profile",
      path: "/ParentPage/Info",
      icon: <MdPerson size={20} />,
    },
    {
      label: "Sending Medicine",
      path: "/ParentPage/SendingMedicine",
      icon: <MdLocalPharmacy size={20} />,
    },
    {
      label: "Notification",
      path: "/ParentPage/Notificationview",
      icon: <MdNotifications size={20} />,
    },
    {
      label: "Vaccination Confirmation",
      path: "/ParentPage/VaccinationConfirmation",
      icon: <MdVaccines size={20} />,
    },
    {
      label: "Vaccine Result",
      path: "/ParentPage/VaccineResult",
      icon: <MdVaccines size={20} />,
    },
    {
      label: "Incident History",
      path: "/ParentPage/IncidentHistory",
      icon: <MdHistory size={20} />,
    },
    {
      label: "Student Health Check",
      path: "/ParentPage/parent-health-check",
      icon: <span>🩺</span>,
    },
  ];

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div
        className={`bg-blue-900 text-white overflow-hidden transition-all duration-300 ease-in-out flex flex-col ${
          isOpen ? "w-64 p-4" : "w-12 p-2"
        }`}
      >
        {/* Toggle Button */}
        <div
          role="button"
          tabIndex={0}
          className="flex items-center text-lg w-full cursor-pointer rounded-lg hover:bg-blue-700 px-2 py-2 mb-4"
          onClick={toggleSidebar}
          onKeyDown={(e) => e.key === "Enter" && toggleSidebar()}
        >
          <div className="w-6 text-center">
            <MdMenu size={20} />
          </div>
          <span
            className={`ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ${
              isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
            }`}
          >
            Menu
          </span>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className={`flex items-center cursor-pointer rounded-lg hover:bg-blue-700 px-2 py-2 transition-colors duration-300 ${
                location.pathname === item.path ? "bg-blue-800" : ""
              }`}
            >
              <div className="text-lg w-6 text-center">{item.icon}</div>
              <span
                className={`ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ${
                  isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default LeftSideParent;
