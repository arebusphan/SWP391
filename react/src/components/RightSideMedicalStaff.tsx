import { useAuth } from "../context/AuthContext";

const RightSideMedicalStaff = () => {
    const { user } = useAuth();
    return (
        <div>
            <div style={{ color: "blue" }} >sadsadsadsadsaddsa {user?.Name}</div>
            <div>

            </div>
        </div>
    )
}
export default RightSideMedicalStaff;