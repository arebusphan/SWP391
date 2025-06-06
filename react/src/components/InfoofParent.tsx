import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getstudentid } from "../service/serviceauth";

export type ParentofStudent= {
    studentId: number;
    fullName: string;
    dateOfBirth: string;
    gender: string;
    guardianId: number;
    guardianName: string;
    guardianPhone: string;
}
const InfoofParent = () => {
    const { user } = useAuth();
    const [student, setstudent] = useState<ParentofStudent|null>(null);
    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await getstudentid();
                setstudent(response.data[0]);
            } catch (error) {
                console.error("Fail when get user:", error);
            }
        }
        fetchUsers();
    }, []);

    if (!user) {
        return <div>Load info</div>;
    }
    if (!student) {
        return <div>Load info</div>;
    }
    
    return (
        <div className="p-4 bg-white shadow rounded max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-green-700">Parent Info</h2>
            <div><strong>Name:</strong> {user.Name || ""}</div>
           
            <div><strong>Phone:</strong> {user.Phone}</div>
            <div><strong>Email:</strong> {user.Email}</div>
            <div>Connect with Student</div>
            <div><strong>Name Student:</strong> {student.fullName}</div>
            <div><strong>Gender Student:</strong> {student.gender}</div>
            <div><strong>Birth Student:</strong> {student.dateOfBirth.split("T")[0]}</div>
            
           
        </div>
    );
};

export default InfoofParent;
