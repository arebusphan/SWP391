import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

type StudentDetail = {
    studentId: number;
    fullName: string;
    gender: string;
    dateOfBirth: string;
    guardianName: string;
    guardianPhone: string;
    allergies: string;
    chronicDiseases: string;
    vision: string;
    hearing: string;
    
};

const StudentDetailPage = () => {
    const { studentId } = useParams();
    const [detail, setDetail] = useState<StudentDetail | null>(null);

    useEffect(() => {
        const fetchDetail = async () => {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                `https://localhost:7195/api/students/get-detail/${studentId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setDetail(res.data);
        };

        fetchDetail();
    }, [studentId]);

    if (!detail) return <p>Loading...</p>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Student Detail</h2>
            <ul className="space-y-2">
                <li><strong>Name:</strong> {detail.fullName}</li>
                <li><strong>Gender:</strong> {detail.gender}</li>
                <li><strong>Date of Birth:</strong> {new Date(detail.dateOfBirth).toLocaleDateString()}</li>
                <li><strong>Guardian:</strong> {detail.guardianName} ({detail.guardianPhone})</li>
                <li><strong>Allergies:</strong> {detail.allergies}</li>
                <li><strong>Chronic Diseases:</strong> {detail.chronicDiseases}</li>
                <li><strong>Vision:</strong> {detail.vision}</li>
                <li><strong>Hearing:</strong> {detail.hearing}</li>
               
            </ul>
        </div>
    );
};

export default StudentDetailPage;
