import { useAuth } from "../context/AuthContext";

const RightSideAdmin = () => {
    const { user } = useAuth();
    return (
        <div>
            <div style={{ color: "blue" }} >Welcome {user?.Name}</div>
            <div>

            </div>
        </div>
    )
}
export default RightSideAdmin;