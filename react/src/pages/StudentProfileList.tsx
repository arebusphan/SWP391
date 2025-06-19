import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type StudentProfile = {
    studentId: number;
    fullName: string;
    gender: string;
    dateOfBirth: string;
    guardianName: string;
    guardianPhone: string;
    className: string;
};

const StudentProfileList = () => {
    const [students, setStudents] = useState<StudentProfile[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<StudentProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [classFilter, setClassFilter] = useState("");
    const [searchName, setSearchName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchStudents() {
            const token = localStorage.getItem("token");
            const role = localStorage.getItem("role");

            if (!token || !role) return alert("Missing token or role.");

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
                setStudents(res.data);
                setFilteredStudents(res.data);
            } catch (err) {
                console.error(err);
                alert("Failed to fetch students");
            } finally {
                setLoading(false);
            }
        }

        fetchStudents();
    }, []);

    useEffect(() => {
        let filtered = [...students];

        if (classFilter) {
            filtered = filtered.filter((s) => s.className === classFilter);
        }

        if (searchName.trim() !== "") {
            filtered = filtered.filter((s) =>
                s.fullName.toLowerCase().includes(searchName.toLowerCase())
            );
        }

        setFilteredStudents(filtered);
    }, [classFilter, searchName, students]);

    const formatDate = (d: string) => new Date(d).toLocaleDateString("vi-VN");

    const uniqueClasses = Array.from(new Set(students.map((s) => s.className)));

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Student Profiles</h2>

            <div className="flex items-center gap-4 mb-4">
                <select
                    className="border px-3 py-1 rounded"
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value)}
                >
                    <option value="">-- All Classes --</option>
                    {uniqueClasses.map((cls) => (
                        <option key={cls} value={cls}>
                            {cls}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Search by name"
                    className="border px-3 py-1 rounded w-60"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : filteredStudents.length === 0 ? (
                <p>No students found.</p>
            ) : (
                        <table className="w-full table-fixed border-collapse shadow rounded-lg overflow-hidden text-sm">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700">
                                    <th className="p-3 text-center w-[16.6%]">Name</th>
                                    <th className="p-3 text-center w-[10%]">Gender</th>
                                    <th className="p-3 text-center w-[15%]">Date of Birth</th>
                                    <th className="p-3 text-center w-[16.6%]">Guardian Name</th>
                                    <th className="p-3 text-center w-[16.6%]">Guardian Phone</th>
                                    <th className="p-3 text-center w-[10%]">Class</th>
                                    <th className="p-3 text-center w-[15%]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((s) => (
                                    <tr
                                        key={s.studentId}
                                        className="bg-white hover:bg-gray-50 border-b"
                                    >
                                        <td className="p-3 text-center">{s.fullName}</td>
                                        <td className="p-3 text-center">{s.gender}</td>
                                        <td className="p-3 text-center">{formatDate(s.dateOfBirth)}</td>
                                        <td className="p-3 text-center">{s.guardianName}</td>
                                        <td className="p-3 text-center">{s.guardianPhone}</td>
                                        <td className="p-3 text-center">{s.className}</td>
                                        <td className="p-3 text-center">
                                            <button
                                                onClick={() => navigate(`/student/${s.studentId}`)}
                                                className="text-blue-600 hover:underline font-medium"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

            )}
        </div>
    );
};

export default StudentProfileList;
