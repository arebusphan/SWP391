import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// DTO cho student
type StudentInfo = {
    studentId: number;
    fullName: string;
    gender: string;
    dateOfBirth: string;
    guardianName: string;
    guardianPhone: string;
};

// DTO cho health profile
type HealthProfileDTO = {
    declarationId: number;
    studentId: number;
    allergies: string;
    chronicDiseases: string;
    vision: string;
    hearing: string;
    otherNotes: string;
};

const StudentDetailPage = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [info, setInfo] = useState<StudentInfo | null>(null);
    const [profile, setProfile] = useState<HealthProfileDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!studentId || !token) return;

        const fetchData = async () => {
            try {
                const studentRes = await axios.get(
                    `https://localhost:7195/api/students/get-detail/${studentId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setInfo(studentRes.data);

                const profileRes = await axios.get(
                    `https://localhost:7195/api/HealthProfile/student/${studentId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setProfile(profileRes.data);

            } catch (err) {
                console.error("\u274C Error loading data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [studentId, token]);

    if (loading) return <p>Loading...</p>;
    if (!info) return <p>Student not found.</p>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Student Detail</h2>
            <ul className="mb-6 space-y-2">
                <li><strong>Name:</strong> {info.fullName}</li>
                <li><strong>Gender:</strong> {info.gender}</li>
                <li><strong>Date of Birth:</strong> {new Date(info.dateOfBirth).toLocaleDateString()}</li>
                <li><strong>Guardian:</strong> {info.guardianName} ({info.guardianPhone})</li>
            </ul>

            <h3 className="text-lg font-semibold mb-2 text-gray-800">Health Profile</h3>
            {!profile ? (
                <p className="text-gray-500">Parents have not submitted health profile.</p>
            ) : (
                <ul className="space-y-2">
                    <li><strong>Allergies:</strong> {profile.allergies}</li>
                    <li><strong>Chronic Diseases:</strong> {profile.chronicDiseases}</li>
                    <li><strong>Vision:</strong> {profile.vision}</li>
                    <li><strong>Hearing:</strong> {profile.hearing}</li>
                    <li><strong>Other Notes:</strong> {profile.otherNotes}</li>
                </ul>
            )}
            <button
                onClick={() => navigate("/MedicalStaffPage/StudentProfile")}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                ← Back to students list
            </button>

        </div>
    );
};

export default StudentDetailPage;
