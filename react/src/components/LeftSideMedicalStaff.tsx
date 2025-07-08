import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  MdPerson,
  MdAssignment,
  MdLocalHospital,
  MdHealthAndSafety,
  MdCheckCircle,
  MdReport,
  MdDashboard,
  MdMenu,
} from "react-icons/md";

const menuItems = [
  {
    label: "Student Profile Management",
    path: "/MedicalStaffPage/StudentProfile",
    icon: <MdPerson size={20} />,
  },
  {
    label: "Request For Medication",
    path: "/MedicalStaffPage/RequestForMedication",
    icon: <MdAssignment size={20} />,
  },
  {
    label: "Sending Medical Event",
    path: "/MedicalStaffPage/Vaccination",
    icon: <MdLocalHospital size={20} />,
  },
  {
    label: "Vaccination Confirmation",
    path: "/MedicalStaffPage/ConfirmStudents",
    icon: <MdCheckCircle size={20} />,
  },
  {
    label: "Vaccine Result",
    path: "/MedicalStaffPage/VaccinationResult",
    icon: <MdHealthAndSafety size={20} />,
  },
  {
    label: "Health Check",
    path: "/MedicalStaffPage/HealthCheck",
    icon: <MdHealthAndSafety size={20} />,
  },
  {
    label: "Medical Incident",
    path: "/MedicalStaffPage/IncidentManagement",
    icon: <MdReport size={20} />,
  },
  {
    label: "Material Management",
    path: "/MedicalStaffPage/MaterialManagement",
    icon: <MdLocalHospital size={20} />,
  },
  {
    label: "Dashboard And Report",
    path: "#",
    icon: <MdDashboard size={20} />,
  },
];

const LeftSideMedicalStaff = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem("medical_sidebar");
    return saved === "false" ? false : true;
  });

  const toggleSidebar = () => {
    setIsOpen((prev) => {
      const newState = !prev;
      localStorage.setItem("medical_sidebar", newState.toString());
      return newState;
    });
  };

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [highlightY, setHighlightY] = useState(0);
  const [highlightHeight, setHighlightHeight] = useState(44); // default height

  useEffect(() => {
    const activeIndex = menuItems.findIndex(
      (item) => item.path === location.pathname
    );
    const activeEl = itemRefs.current[activeIndex];
    if (activeEl) {
      setHighlightY(activeEl.offsetTop);
      setHighlightHeight(activeEl.offsetHeight);
    }
  }, [location.pathname]);

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div
        className={`bg-blue-900 text-white overflow-hidden transition-all duration-300 ease-in-out flex flex-col ${
          isOpen ? "w-72 p-5" : "w-12 p-2"
        }`}
      >
        <div className="mt-14 relative">
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

          {/* Highlight Box */}
          <div
            className="absolute left-0 right-0 bg-white z-0 shadow-md transition-all duration-500 ease-in-out rounded-lg"
            style={{
              transform: `translateY(${highlightY}px)`,
              height: `${highlightHeight}px`,
            }}
          ></div>

          {/* Menu Items */}
          <div className="space-y-2 relative z-10">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <div
                  key={index}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center cursor-pointer rounded-lg px-2 py-2 transition-all duration-300 relative ${
                    isActive
                      ? "text-blue-800 font-semibold"
                      : "hover:bg-blue-700 hover:text-white"
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
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default LeftSideMedicalStaff;
