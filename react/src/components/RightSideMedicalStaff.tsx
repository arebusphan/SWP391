import { useAuth } from "../context/AuthContext";

const RightSideMedicalStaff = () => {
    const { user } = useAuth();
    return (
        <div>
            <div style={{ color: "blue" }} >e xin chao {user?.Name} a</div>
            <div>

            </div>
        </div>
    )
}
export default RightSideMedicalStaff;