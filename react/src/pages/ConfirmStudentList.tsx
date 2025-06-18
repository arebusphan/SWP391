import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface Class {
    classId: number;
    className: string;
}

interface ConfirmStudent {
    studentId: number;
    studentName: string;
    confirmStatus: string;
    declineReason?: string;
    parentPhone?: string;
}

const ConfirmStudentList = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<number>(0);
    const [notificationId, setNotificationId] = useState<number>(1);
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [confirmStudents, setConfirmStudents] = useState<ConfirmStudent[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<ConfirmStudent | null>(null);
    const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 10;

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        if (selectedClassId > 0 && notificationId > 0) {
            fetchConfirmations();
        }
    }, [selectedClassId, notificationId, statusFilter]);

    const fetchClasses = async () => {
        try {
            const res = await axios.get("https://localhost:7195/api/classes");
            setClasses(res.data);
            setSelectedClassId(res.data[0]?.classId || 0);
        } catch (err) {
            alert("Failed to load class list.");
        }
    };

    const fetchConfirmations = async () => {
        try {
            const res = await axios.get("https://localhost:7195/api/notifications/students/confirmation", {
                params: {
                    notificationId,
                    classId: selectedClassId,
                    status: statusFilter || undefined,
                },
            });
            setConfirmStudents(res.data);
            setSelectedStudentIds([]);
            setSelectAll(false);
            setCurrentPage(1);
        } catch {
            alert("Failed to load confirmation list.");
        }
    };

    const toggleStudentSelection = (studentId: number) => {
        setSelectedStudentIds((prev) =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedStudentIds([]);
        } else {
            const confirmedIds = filteredStudents.filter(s => s.confirmStatus === "Confirmed").map(s => s.studentId);
            setSelectedStudentIds(confirmedIds);
        }
        setSelectAll(!selectAll);
    };

    const exportToExcel = () => {
        const data = selectedStudentIds.map((id) => {
            const student = confirmStudents.find(s => s.studentId === id);
            return {
                "Student ID": student?.studentId,
                "Full Name": student?.studentName,
                "Status": student?.confirmStatus,
                "Decline Reason": student?.declineReason || "",
                "Parent Phone": student?.parentPhone || "",
                "Class": selectedClass?.className || "",
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "SelectedStudents");

        const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const file = new Blob([buffer], { type: "application/octet-stream" });
        saveAs(file, `Selected_Students_${selectedClass?.className}.xlsx`);
    };

    const filteredStudents = statusFilter
        ? confirmStudents.filter(s => s.confirmStatus === statusFilter)
        : confirmStudents;

    const selectedClass = classes.find(cls => cls.classId === selectedClassId);

    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
    const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white mt-10 shadow-md rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Vaccination Confirmation</h2>

            <div className="flex flex-wrap gap-4 mb-6 items-center">
                <label className="mr-2 font-semibold">Select Grade:</label>
                <select
                    className="px-4 py-2 border rounded-md"
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(Number(e.target.value))}
                >
                    {classes.map((cls) => (
                        <option key={cls.classId} value={cls.classId}>
                            {cls.className}
                        </option>
                    ))}
                </select>

                <label className="ml-4 mr-2 font-semibold">Filter Status:</label>
                <select
                    className="px-4 py-2 border rounded-md"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                    <option value="Declined">Declined</option>
                </select>
            </div>

            {currentStudents.length === 0 ? (
                <p className="italic text-gray-500">No students in this class.</p>
            ) : (
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-blue-100 text-left">
                            <th className="border px-3 py-2">Student ID</th>
                            <th className="border px-3 py-2">Full Name</th>
                            <th className="border px-3 py-2">Details</th>
                            <th className="border px-3 py-2">Status</th>
                            <th className="border px-3 py-2 text-center">
                                <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                    title="Select all confirmed students"
                                />
                                <span className="ml-2">Need Vaccine</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentStudents.map((stu) => (
                            <tr key={stu.studentId} className="hover:bg-blue-50">
                                <td className="border px-3 py-2">{stu.studentId}</td>
                                <td className="border px-3 py-2">{stu.studentName}</td>
                                <td className="border px-3 py-2">
                                    <button
                                        className="text-blue-600 underline"
                                        onClick={() => setSelectedStudent(stu)}
                                    >
                                        View Details
                                    </button>
                                </td>
                                <td className="border px-3 py-2">{stu.confirmStatus}</td>
                                <td className="border px-3 py-2 text-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedStudentIds.includes(stu.studentId)}
                                        onChange={() => toggleStudentSelection(stu.studentId)}
                                        disabled={stu.confirmStatus !== "Confirmed"}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {totalPages > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded ${page === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}

            {selectedStudentIds.length > 0 && (
                <div className="mt-6 text-right">
                    <button onClick={exportToExcel} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        Export to Excel
                    </button>
                </div>
            )}

            {selectedStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-[400px] shadow-xl relative">
                        <button
                            onClick={() => setSelectedStudent(null)}
                            className="absolute top-2 right-3 text-xl font-bold text-gray-600"
                        >
                            &times;
                        </button>
                        <h3 className="text-xl font-bold mb-4">Confirmation Details</h3>
                        <p><strong>Student ID:</strong> {selectedStudent.studentId}</p>
                        <p><strong>Full Name:</strong> {selectedStudent.studentName}</p>
                        <p><strong>Status:</strong> {selectedStudent.confirmStatus}</p>
                        <p><strong>Decline Reason:</strong> {selectedStudent.declineReason || "-"}</p>
                        <p><strong>Parent Phone:</strong> {selectedStudent.parentPhone || "-"}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConfirmStudentList;