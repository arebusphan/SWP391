import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
    MdPerson,
    MdAssignment,
    MdLocalHospital,
    MdHealthAndSafety,
    MdCheckCircle,
    MdReport,
    MdDashboard,
    MdMenu
} from "react-icons/md";

const LeftSideMedicalStaff = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        {
            label: "Student Profile Management",
            path: "/MedicalStaffPage/StudentProfile",
            icon: <MdPerson size={20} />
        },
        {
            label: "Request For Medication",
            path: "/MedicalStaffPage/RequestForMedication",
            icon: <MdAssignment size={20} />
        },
        {
            label: "Sending Medical Event",
            path: "/MedicalStaffPage/Vaccination",
            icon: <MdLocalHospital size={20} />
        },
        {
            label: "ConfirmStudents",
            path: "/MedicalStaffPage/ConfirmStudents",
            icon: <MdCheckCircle size={20} />
        },
        {
            label: "Vaccine Result",
            path: "/MedicalStaffPage/VaccinationResult",
            icon: <MdHealthAndSafety size={20} />
        },
        {
            label: "Health Check",
            path: "/MedicalStaffPage/HealthCheck",
            icon: <MdHealthAndSafety size={20} />
        },
        {
            label: "Medical Incident",
            path: "/MedicalStaffPage/MedicalIncident",
            icon: <MdReport size={20} />
        },
        {
            label: "Material Management",
            path: "/MedicalStaffPage/MaterialManagement",
            icon: <MdLocalHospital size={20} />
        },
        {
            label: "Dashboard And Report",
            path: "#",
            icon: <MdDashboard size={20} />
        }
    ];

    return (
        <div className="h-screen flex">
            <div
                className={`bg-blue-900 text-white overflow-hidden transition-all duration-300 ease-in-out flex flex-col ${isOpen ? "w-64 p-4" : "w-12 p-2"
                    }`}
            >
                <div
                    role="button"
                    tabIndex={0}
                    className="flex items-center text-lg w-full cursor-pointer rounded-lg hover:bg-blue-700 px-2 py-2 mb-4"
                    onClick={() => setIsOpen(!isOpen)}
                    onKeyDown={(e) => e.key === "Enter" && setIsOpen(!isOpen)}
                >
                    <div className="w-6 text-center">
                        <MdMenu size={20} />
                    </div>
                    <span
                        className={`ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
                            }`}
                    >
                        Menu
                    </span>
                </div>

                <div className="space-y-2">
                    {menuItems.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => navigate(item.path)}
                            className={`flex items-center cursor-pointer rounded-lg hover:bg-blue-700 px-2 py-2 transition-colors duration-300 ${location.pathname === item.path ? "bg-blue-800" : ""
                                }`}
                        >
                            <div className="text-lg w-6 text-center">{item.icon}</div>
                            <span
                                className={`ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
                                    }`}
                            >
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default LeftSideMedicalStaff;
