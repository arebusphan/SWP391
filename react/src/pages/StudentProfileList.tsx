import { useEffect, useState } from "react";
import axios from "axios";

type StudentProfile = {
    studentId: number;
    fullName: string;
    gender: string;
    dateOfBirth: string;
    guardianName: string;
    guardianPhone: string;
    className: string;
};

type HealthProfileDTO = {
    declarationId: number;
    studentId: number;
    allergies: string;
    chronicDiseases: string;
    vision: string;
    hearing: string;
    otherNotes: string;
};

const StudentProfileList = () => {
    const [students, setStudents] = useState<StudentProfile[]>([]);
    const [healthMap, setHealthMap] = useState<Record<number, HealthProfileDTO>>({});
    const [filteredStudents, setFilteredStudents] = useState<StudentProfile[]>([]);
    const [classFilter, setClassFilter] = useState("");
    const [searchName, setSearchName] = useState("");
    const [filterByProfile, setFilterByProfile] = useState("all");

    const [selectedStudent, setSelectedStudent] = useState<{
        student: StudentProfile;
        profile: HealthProfileDTO | null;
    } | null>(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get("https://localhost:7195/api/students/get-all-basic", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStudents(res.data);

                const healthMapTemp: Record<number, HealthProfileDTO> = {};
                for (const stu of res.data) {
                    try {
                        const profileRes = await axios.get(
                            `https://localhost:7195/api/HealthProfile/student/${stu.studentId}`,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        healthMapTemp[stu.studentId] = profileRes.data;
                    } catch {
                        // no profile for student
                    }
                }
                setHealthMap(healthMapTemp);
            } catch (err) {
                console.error(err);
                alert("Failed to fetch students or profiles");
            }
        }
        fetchData();
    }, [token]);

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
        if (filterByProfile === "has") {
            filtered = filtered.filter((s) => healthMap[s.studentId]);
        } else if (filterByProfile === "missing") {
            filtered = filtered.filter((s) => !healthMap[s.studentId]);
        }
        setFilteredStudents(filtered);
    }, [students, classFilter, searchName, filterByProfile, healthMap]);

    const formatDate = (d: string) => new Date(d).toLocaleDateString("vi-VN");
    const uniqueClasses = Array.from(new Set(students.map((s) => s.className)));

    const handleView = (student: StudentProfile) => {
        const profile = healthMap[student.studentId] || null;
        setSelectedStudent({ student, profile });
    };

    return (
        <>
            <div className={`max-w-6xl mx-auto p-6 bg-white rounded shadow ${selectedStudent ? 'blur-sm pointer-events-none select-none' : ''}`}>
                <h2 className="text-2xl font-bold mb-4">Student Profiles</h2>

                <div className="flex items-center gap-4 mb-4">
                    <select
                        className="border px-3 py-1 rounded"
                        value={classFilter}
                        onChange={(e) => setClassFilter(e.target.value)}
                    >
                        <option value="">-- All Classes --</option>
                        {uniqueClasses.map((cls) => (
                            <option key={cls} value={cls}>{cls}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Search by name"
                        className="border px-3 py-1 rounded w-60"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                    <select
                        className="border px-3 py-1 rounded"
                        value={filterByProfile}
                        onChange={(e) => setFilterByProfile(e.target.value)}
                    >
                        <option value="all">-- All --</option>
                        <option value="has">☑ Has Profile</option>
                        <option value="missing">❌ Missing Profile</option>
                    </select>
                </div>

                <table className="w-full table-fixed border-collapse shadow rounded-lg overflow-hidden text-sm">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            <th className="p-3 text-center">Name</th>
                            <th className="p-3 text-center">Gender</th>
                            <th className="p-3 text-center">DOB</th>
                            <th className="p-3 text-center">Guardian</th>
                            <th className="p-3 text-center">Phone</th>
                            <th className="p-3 text-center">Class</th>
                            <th className="p-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((s) => (
                            <tr key={s.studentId} className="hover:bg-gray-50">
                                <td className="p-3 text-center">{s.fullName}</td>
                                <td className="p-3 text-center">{s.gender}</td>
                                <td className="p-3 text-center">{formatDate(s.dateOfBirth)}</td>
                                <td className="p-3 text-center">{s.guardianName}</td>
                                <td className="p-3 text-center">{s.guardianPhone}</td>
                                <td className="p-3 text-center">{s.className}</td>
                                <td className="p-3 text-center">
                                    <button
                                        onClick={() => handleView(s)}
                                        className="text-blue-600 hover:underline"
                                    >View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 z-50 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="relative bg-white p-6 rounded-xl shadow-xl max-w-lg w-full">
                        <button
                            onClick={() => setSelectedStudent(null)}
                            className="absolute top-2 right-4 text-2xl text-gray-500 hover:text-black"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-4 text-blue-700">Student Detail</h2>
                        <p><strong>Name:</strong> {selectedStudent.student.fullName}</p>
                        <p><strong>Gender:</strong> {selectedStudent.student.gender}</p>
                        <p><strong>DOB:</strong> {formatDate(selectedStudent.student.dateOfBirth)}</p>
                        <p><strong>Guardian:</strong> {selectedStudent.student.guardianName} ({selectedStudent.student.guardianPhone})</p>

                        <div className="mt-4">
                            <h3 className="font-semibold text-lg mb-2">Health Profile</h3>
                            {!selectedStudent.profile ? (
                                <p className="italic text-gray-500">No profile submitted.</p>
                            ) : (
                                <>
                                    <p><strong>Allergies:</strong> {selectedStudent.profile.allergies}</p>
                                    <p><strong>Chronic Diseases:</strong> {selectedStudent.profile.chronicDiseases}</p>
                                    <p><strong>Vision:</strong> {selectedStudent.profile.vision}</p>
                                    <p><strong>Hearing:</strong> {selectedStudent.profile.hearing}</p>
                                    <p><strong>Notes:</strong> {selectedStudent.profile.otherNotes}</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default StudentProfileList;
