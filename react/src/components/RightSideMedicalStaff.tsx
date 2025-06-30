import { useAuth } from "../context/AuthContext";

const RightSideMedicalStaff = () => {
    const { user } = useAuth();
    return (
        <div>
            <div className="text-5xl text-blue-500" > Welcome {user?.Name} </div>
            <div>

            </div>
        </div>
    )
}
export default RightSideMedicalStaff;