import { useAuth } from "../context/AuthContext";

const RightSideParent = () => {
    const { user } = useAuth();
    return (
        <div>
            <div style={{ color: "blue" }} >sadsadsadsadsaddsa {user?.Name}</div>
            <div>

            </div>
        </div>
    )
}
export default RightSideParent;