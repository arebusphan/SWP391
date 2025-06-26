import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface Class {
    classId: number;
    className: string;
}

interface Notification {
    notificationId: number;
    eventName: string;
    eventDate: string;
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
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<number>(0);
    const [selectedNotificationId, setSelectedNotificationId] = useState<number>(0);
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [confirmStudents, setConfirmStudents] = useState<ConfirmStudent[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<ConfirmStudent | null>(null);
    const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const studentsPerPage = 10;

    useEffect(() => {
        axios.get("https://localhost:7195/api/classes").then((res) => {
            setClasses(res.data);
            setSelectedClassId(res.data[0]?.classId || 0);
        });

        axios.get("https://localhost:7195/api/notifications/list-basic").then((res) => {
            setNotifications(res.data);
            setSelectedNotificationId(res.data[0]?.notificationId || 0);
        });
    }, []);

    useEffect(() => {
        if (selectedClassId && selectedNotificationId) {
            axios
                .get("https://localhost:7195/api/notifications/students/confirmation", {
                    params: {
                        notificationId: selectedNotificationId,
                        classId: selectedClassId,
                        status: statusFilter || undefined,
                    },
                })
                .then((res) => {
                    setConfirmStudents(res.data);
                    setSelectedStudentIds([]);
                    setCurrentPage(1);
                });
        }
    }, [selectedClassId, selectedNotificationId, statusFilter]);

    const filteredStudents = statusFilter
        ? confirmStudents.filter((s) => s.confirmStatus === statusFilter)
        : confirmStudents;

    const indexOfLast = currentPage * studentsPerPage;
    const indexOfFirst = indexOfLast - studentsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
    const selectedClass = classes.find((c) => c.classId === selectedClassId);

    const toggleStudentSelection = (studentId: number) => {
        setSelectedStudentIds((prev) =>
            prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
        );
    };

    const handleSelectAll = () => {
        const confirmedIds = filteredStudents
            .filter((s) => s.confirmStatus === "Confirmed")
            .map((s) => s.studentId);
        const isAllSelected = confirmedIds.every((id) => selectedStudentIds.includes(id));
        setSelectedStudentIds(isAllSelected ? [] : confirmedIds);
    };

    const exportToExcel = () => {
        const data = confirmStudents.map((s) => ({
            "Student ID": s.studentId,
            "Full Name": s.studentName,
            "Status": s.confirmStatus,
            "Decline Reason": s.declineReason || "-",
            "Parent Phone": s.parentPhone || "-",
            "Class": selectedClass?.className || "",
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Confirm Students");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, `confirmation_list_${selectedClass?.className}.xlsx`);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white mt-10 shadow-md rounded-xl">
            <h2 className="text-2xl font-bold mb-4 text-center">Vaccination Confirmation</h2>

            <div className="flex flex-wrap gap-4 mb-6 items-center justify-center">
                <select
                    className="border px-4 py-2 rounded"
                    value={selectedNotificationId}
                    onChange={(e) => setSelectedNotificationId(+e.target.value)}
                >
                    {notifications.map((n) => (
                        <option key={n.notificationId} value={n.notificationId}>
                            {n.eventName} ({new Date(n.eventDate).toLocaleDateString()})
                        </option>
                    ))}
                </select>

                <select
                    className="border px-4 py-2 rounded"
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(+e.target.value)}
                >
                    {classes.map((cls) => (
                        <option key={cls.classId} value={cls.classId}>
                            {cls.className}
                        </option>
                    ))}
                </select>

                <label className="flex items-center gap-2">
                    Filter Status:
                    <select
                        className="border px-3 py-2 rounded"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Pending">Pending</option>
                        <option value="Declined">Declined</option>
                    </select>
                </label>
            </div>

            {currentStudents.length === 0 ? (
                <p className="italic text-gray-500 text-center">No students in this class.</p>
            ) : (
                <table className="w-full table-auto border border-gray-300 text-center">
                    <thead className="bg-blue-100">
                        <tr>
                            <th className="border px-3 py-2">Student ID</th>
                            <th className="border px-3 py-2">Full Name</th>
                            <th className="border px-3 py-2">Details</th>
                            <th className="border px-3 py-2">Status</th>
                            <th className="border px-3 py-2">
                                <div className="flex items-center justify-center gap-2">
                                    Select
                                    <input
                                        type="checkbox"
                                        checked={filteredStudents
                                            .filter((s) => s.confirmStatus === "Confirmed")
                                            .every((s) => selectedStudentIds.includes(s.studentId))}
                                        onChange={handleSelectAll}
                                    />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentStudents.map((stu) => (
                            <tr key={stu.studentId} className="hover:bg-blue-50">
                                <td className="border px-3 py-2">{stu.studentId}</td>
                                <td className="border px-3 py-2">{stu.studentName}</td>
                                <td
                                    className="border px-3 py-2 text-blue-600 underline cursor-pointer"
                                    onClick={() => setSelectedStudent(stu)}
                                >
                                    View Details
                                </td>
                                <td className="border px-3 py-2">{stu.confirmStatus}</td>
                                <td className="border px-3 py-2">
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

            <div className="mt-6">
                {totalPages > 1 && (
                    <div className="flex justify-center mb-4">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                className={`px-3 py-1 rounded mx-1 ${page === currentPage ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        onClick={exportToExcel}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Export to Excel
                    </button>
                </div>
            </div>

            {selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* CHỈ nền đen mờ, KHÔNG BLUR */}
                    <div className="absolute inset-0 bg-black/20"></div>

                    {/* Modal hộp trắng nổi bật */}
                    <div className="relative bg-white rounded-xl shadow-xl p-6 w-[420px] max-w-full z-10">
                        <button
                            onClick={() => setSelectedStudent(null)}
                            className="absolute top-2 right-3 text-xl text-gray-600 hover:text-red-500"
                        >
                            &times;
                        </button>
                        <h3 className="text-base font-semibold mb-4">📋 Confirmation Details</h3>
                        <div className="space-y-2 text-sm">
                            <div><strong>Student ID:</strong> {selectedStudent.studentId}</div>
                            <div><strong>Full Name:</strong> {selectedStudent.studentName}</div>
                            <div><strong>Status:</strong> {selectedStudent.confirmStatus}</div>
                            <div><strong>Decline Reason:</strong> {selectedStudent.declineReason || "—"}</div>
                            <div><strong>Parent Phone:</strong> {selectedStudent.parentPhone || "—"}</div>
                        </div>
                    </div>
                </div>
            )}




        </div>
    );
};

export default ConfirmStudentList;
