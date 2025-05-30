import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const DashboardRedirect = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        switch (user.role) {
            case "Admin":
                navigate("/AdminPage");
                break;
            case "Parent":
                navigate("/ParentPage");
                break;
            case "MedicalStaff":
                navigate("/MedicalStaffPage");
                break;
            default:
                navigate("/");
        }
    }, [user, navigate]);

    return null;
};
export default DashboardRedirect;
