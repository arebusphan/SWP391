import { useEffect, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { apiser } from "../service/apiser";

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
    const [selectedForReminder, setSelectedForReminder] = useState<number[]>([]);
    const [sendingReminder, setSendingReminder] = useState(false);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 10;

    const [selectedStudent, setSelectedStudent] = useState<{
        student: StudentProfile;
        profile: HealthProfileDTO | null;
    } | null>(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await apiser.get("/students/get-all-basic", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStudents(res.data);

                const healthMapTemp: Record<number, HealthProfileDTO> = {};
                for (const stu of res.data) {
                    try {
                        const profileRes = await apiser.get(
                            `/HealthProfile/student/${stu.studentId}`,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        healthMapTemp[stu.studentId] = profileRes.data;
                    } catch {
                        // No profile found
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
        // Reset to first page when filters change
        setCurrentPage(1);
    }, [students, classFilter, searchName, filterByProfile, healthMap]);

    const formatDate = (d: string) => new Date(d).toLocaleDateString("vi-VN");
    const uniqueClasses = Array.from(new Set(students.map((s) => s.className)));

    // Pagination calculations  
    const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
    const startIndex = (currentPage - 1) * studentsPerPage;
    const endIndex = startIndex + studentsPerPage;
    const currentStudents = filteredStudents.slice(startIndex, endIndex);

    const handleView = (student: StudentProfile) => {
        const profile = healthMap[student.studentId] || null;
        setSelectedStudent({ student, profile });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSelectForReminder = (studentId: number) => {
        setSelectedForReminder(prev => 
            prev.includes(studentId) 
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleSelectAllMissing = () => {
        const missingProfileStudents = filteredStudents.filter(s => !healthMap[s.studentId]);
        const missingIds = missingProfileStudents.map(s => s.studentId);
        setSelectedForReminder(missingIds);
    };

    const handleSendReminder = async () => {
        if (selectedForReminder.length === 0) {
            alert("Vui lòng chọn ít nhất một học sinh để gửi thông báo!");
            return;
        }

        setSendingReminder(true);
        try {
            await apiser.post(
                "/HealthProfile/send-reminder",
                { studentIds: selectedForReminder },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(`Đã gửi thông báo thành công cho ${selectedForReminder.length} phụ huynh!`);
            setSelectedForReminder([]);
        } catch (error) {
            console.error("Error sending reminders:", error);
            alert("Có lỗi xảy ra khi gửi thông báo. Vui lòng thử lại!");
        } finally {
            setSendingReminder(false);
        }
    };

    return (
        <>
            <div className={` mx-auto  transition-all duration-300 ${selectedStudent ? 'blur-sm pointer-events-none select-none' : ''}`}>
                <h2 className="text-4xl font-bold p-10 text-blue-800">Student Profiles</h2>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6 items-center">
                    <select
                        className="border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={classFilter}
                        onChange={(e) => setClassFilter(e.target.value)}
                        aria-label="Filter by class"
                    >
                        <option value="">-- All Classes --</option>
                        {uniqueClasses.map((cls) => (
                            <option key={cls} value={cls}>{cls}</option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="🔍 Search by name"
                        className="border border-gray-300 rounded-xl px-4 py-2 w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />

                    <select
                        className="border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={filterByProfile}
                        onChange={(e) => setFilterByProfile(e.target.value)}
                        aria-label="Filter by health profile status"
                    >
                        <option value="all">-- All --</option>
                        <option value="has">Has Profile</option>
                        <option value="missing">Missing Profile</option>
                    </select>
                </div>

                {/* Reminder Actions */}
                {filterByProfile === "missing" && (
                    <div className="mb-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                        <div className="flex flex-wrap gap-3 items-center">
                            <button
                                onClick={handleSelectAllMissing}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                            >
                                Select All Missing
                            </button>
                            <button
                                onClick={handleSendReminder}
                                disabled={selectedForReminder.length === 0 || sendingReminder}
                                className={`px-4 py-2 rounded-lg transition ${
                                    selectedForReminder.length === 0 || sendingReminder
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-orange-500 text-white hover:bg-orange-600"
                                }`}
                            >
                                {sendingReminder ? "Sending..." : `Send Reminder (${selectedForReminder.length})`}
                            </button>
                            {selectedForReminder.length > 0 && (
                                <button
                                    onClick={() => setSelectedForReminder([])}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                                >
                                    Clear Selection
                                </button>
                            )}
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            💡 Select students to send health profile reminders to their parents via email.
                        </p>
                    </div>
                )}

                {/* Table */}
                <div className="overflow-auto rounded-xl shadow-sm">
                    <table className="min-w-full table-auto text-sm border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-blue-50 text-blue-800">
                            <tr>
                                {filterByProfile === "missing" && (
                                    <th className="p-3 text-center font-semibold">Select</th>
                                )}
                                {["Name", "Gender", "DOB", "Guardian", "Phone", "Class", "Status", "Action"].map((heading) => (
                                    <th key={heading} className="p-3 text-center font-semibold">{heading}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {currentStudents.map((s, idx) => (
                                <tr key={s.studentId} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition`}>
                                    {filterByProfile === "missing" && (
                                        <td className="p-3 text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedForReminder.includes(s.studentId)}
                                                onChange={() => handleSelectForReminder(s.studentId)}
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                aria-label={`Select ${s.fullName} for reminder`}
                                            />
                                        </td>
                                    )}
                                    <td className="p-3 text-center">{s.fullName}</td>
                                    <td className="p-3 text-center">{s.gender}</td>
                                    <td className="p-3 text-center">{formatDate(s.dateOfBirth)}</td>
                                    <td className="p-3 text-center">{s.guardianName}</td>
                                    <td className="p-3 text-center">{s.guardianPhone}</td>
                                    <td className="p-3 text-center">{s.className}</td>
                                    <td className="p-3 text-center">
                                        {healthMap[s.studentId] ? (
                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                                ✅ Has Profile
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                                                ❌ Missing
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-3 text-center">
                                        <button
                                            onClick={() => handleView(s)}
                                            className="text-blue-600 hover:text-blue-800 font-medium underline"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-6">
                        <div className="flex gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    className={`px-3 py-1 rounded-lg text-sm ${
                                        page === currentPage
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                    } transition`}
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Results Info */}
                <div className="text-center mt-4 text-gray-600">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredStudents.length)} of {filteredStudents.length} students
                </div>

                {/* Reminder Section - Only visible when profiles are missing */}
                {/*filterByProfile === "missing" && (
                    <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                        <p className="text-yellow-800 font-semibold mb-2">
                            ⚠️ Missing Health Profiles
                        </p>
                        <p className="text-gray-700 mb-4">
                            Some students are missing health profiles. You can send a reminder to their guardians.
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={handleSelectAllMissing}
                                className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition"
                            >
                                Select All Missing
                            </button>
                            <button
                                onClick={handleSendReminder}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
                                disabled={sendingReminder}
                            >
                                {sendingReminder ? "Sending..." : "Send Reminder"}
                            </button>
                        </div>
                    </div>
                )*/}
            </div>

            {/* Dialog Modal */}
            <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
                <DialogContent className="max-w-lg" showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-blue-700">Student Detail</DialogTitle>
                    </DialogHeader>
                    {selectedStudent && (
                        <div className="space-y-2 text-gray-700">
                            <p><strong>Name:</strong> {selectedStudent.student.fullName}</p>
                            <p><strong>Gender:</strong> {selectedStudent.student.gender}</p>
                            <p><strong>DOB:</strong> {formatDate(selectedStudent.student.dateOfBirth)}</p>
                            <p><strong>Guardian:</strong> {selectedStudent.student.guardianName} ({selectedStudent.student.guardianPhone})</p>

                            <div className="mt-6">
                                <h3 className="font-semibold text-lg mb-2 text-blue-600">🩺 Health Profile</h3>
                                {!selectedStudent.profile ? (
                                    <p className="italic text-gray-500">No profile submitted.</p>
                                ) : (
                                    <div className="space-y-2">
                                        <p><strong>Allergies:</strong> {selectedStudent.profile.allergies}</p>
                                        <p><strong>Chronic Diseases:</strong> {selectedStudent.profile.chronicDiseases}</p>
                                        <p><strong>Vision:</strong> {selectedStudent.profile.vision}</p>
                                        <p><strong>Hearing:</strong> {selectedStudent.profile.hearing}</p>
                                        <p><strong>Notes:</strong> {selectedStudent.profile.otherNotes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default StudentProfileList;
