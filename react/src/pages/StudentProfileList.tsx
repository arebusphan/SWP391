import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ thêm

type StudentProfile = {
    studentId: number;
    fullName: string;
    gender: string;
    dateOfBirth: string;
    guardianName: string;
    guardianPhone: string;
};

const StudentProfileList = () => {
    const [students, setStudents] = useState<StudentProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // ✅ thêm

    useEffect(() => {
        async function fetchStudents() {
            const token = localStorage.getItem("token");
            let role = localStorage.getItem("role");

            if (!token || !role) {
                alert("❗ Missing token or role. Please login again.");
                console.warn("token:", token);
                console.warn("role:", role);
                setLoading(false);
                return;
            }

            if (!["Parent", "MedicalStaff"].includes(role)) {
                console.warn("⚠️ Role không hợp lệ:", role);
                role = "Parent";
            }

            const url =
                role === "Parent"
                    ? "https://localhost:7195/api/students/get-StuByGuardian"
                    : "https://localhost:7195/api/students/get-all-basic";

            try {
                const res = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("📦 Dữ liệu học sinh:", res.data);
                setStudents(res.data);
            } catch (err) {
                console.error("❌ Error loading student data:", err);
                alert("❌ Failed to load student profiles.");
            } finally {
                setLoading(false);
            }
        }

        fetchStudents();
    }, []);

    const formatDate = (dateStr: string): string =>
        new Date(dateStr).toLocaleDateString("vi-VN");

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Student Profiles</h2>

            {loading ? (
                <p>Loading...</p>
            ) : students.length === 0 ? (
                <p>No student records found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border border-gray-300 text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 border-b">Name</th>
                                <th className="p-3 border-b">Gender</th>
                                <th className="p-3 border-b">Date of Birth</th>
                                <th className="p-3 border-b">Guardian Name</th>
                                <th className="p-3 border-b">Guardian Phone</th>
                                <th className="p-3 border-b">Actions</th> {/* ✅ thêm cột */}
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((s) => (
                                <tr key={s.studentId} className="hover:bg-gray-50">
                                    <td className="p-3 border-b">{s.fullName}</td>
                                    <td className="p-3 border-b capitalize">{s.gender}</td>
                                    <td className="p-3 border-b">{formatDate(s.dateOfBirth)}</td>
                                    <td className="p-3 border-b">{s.guardianName}</td>
                                    <td className="p-3 border-b">{s.guardianPhone}</td>
                                    <td className="p-3 border-b">
                                        <button
                                            onClick={() => navigate(`/MedicalStaffPage/student-detail/${s.studentId}`)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default StudentProfileList;
