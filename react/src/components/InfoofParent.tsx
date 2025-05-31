import { useAuth } from "../context/AuthContext";


const InfoofParent = () => {
    const { user } = useAuth();
    return (
        <div>
            <div>Name: {user?.Name}</div>
            <div>Tuoi: {user?.Name}</div>
            <div>Tuoi: {user?.Name}</div>
            <div>Tuoi: {user?.Name}</div>
        </div>
    )
}
export default InfoofParent;