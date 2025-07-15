import { useEffect, useState } from "react";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { apiser } from "../service/apiser";

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
        apiser.get("/classes").then((res) => {
            setClasses(res.data);
            setSelectedClassId(res.data[0]?.classId || 0);
        });

        apiser.get("/HealthNotification/list-basic").then((res) => {
            setNotifications(res.data);
            setSelectedNotificationId(res.data[0]?.notificationId || 0);
        });
    }, []);

    useEffect(() => {
        if (selectedClassId && selectedNotificationId) {
            apiser
                .get("/notifications/students/confirmation", {
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
        <div className=" mx-auto ">
            <h2 className="text-4xl font-bold p-10 text-blue-800">Vaccination Confirmation</h2>

            {/* Bộ lọc */}
            <div className="flex flex-wrap gap-4 mb-8  items-center">
            Vaccin Event:
                <select
                    className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={selectedNotificationId}
                    onChange={(e) => setSelectedNotificationId(+e.target.value)}
                >
                    {notifications.map((n) => (
                        <option key={n.notificationId} value={n.notificationId}>
                            {n.eventName} ({new Date(n.eventDate).toLocaleDateString()})
                        </option>
                    ))}
                </select>
                Class
                <select
                    className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(+e.target.value)}
                >
                    {classes.map((cls) => (
                        <option key={cls.classId} value={cls.classId}>
                            {cls.className}
                        </option>
                    ))}
                </select>

             
                    Filter Status:
                    <select
                        className="border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Pending">Pending</option>
                        <option value="Declined">Declined</option>
                    </select>
               
            </div>

            {/* Danh sách học sinh */}
            {currentStudents.length === 0 ? (
                <p className="italic text-gray-500 text-center">No students in this class.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-gray-300 rounded-lg overflow-hidden">
                        <thead className="bg-blue-100 text-gray-800 font-semibold">
                            <tr>
                                <th className="border px-4 py-2">Student ID</th>
                                <th className="border px-4 py-2">Full Name</th>
                                <th className="border px-4 py-2">Details</th>
                                <th className="border px-4 py-2">Status</th>
                                <th className="border px-4 py-2">
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
                        <tbody className="bg-white">
                            {currentStudents.map((stu) => (
                                <tr key={stu.studentId} className="hover:bg-blue-50 transition">
                                    <td className="border px-4 py-2">{stu.studentId}</td>
                                    <td className="border px-4 py-2">{stu.studentName}</td>
                                    <td
                                        className="border px-4 py-2 text-blue-600 underline cursor-pointer"
                                        onClick={() => setSelectedStudent(stu)}
                                    >
                                        View Details
                                    </td>
                                    <td className="border px-4 py-2">{stu.confirmStatus}</td>
                                    <td className="border px-4 py-2">
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
                </div>
            )}

            {/* Phân trang & Export */}
            <div className="mt-6">
                {totalPages > 1 && (
                    <div className="flex justify-center mb-4">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                className={`px-3 py-1 rounded-lg mx-1 text-sm transition ${page === currentPage
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                    }`}
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
                        className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition font-medium"
                    >
                        Export to Excel
                    </button>
                </div>
            </div>

            {/* Modal chi tiết học sinh */}
            {selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative bg-white rounded-xl shadow-xl p-6 w-[420px] max-w-full z-10">
                        <button
                            onClick={() => setSelectedStudent(null)}
                            className="absolute top-2 right-3 text-xl text-gray-600 hover:text-red-500"
                        >
                            &times;
                        </button>
                        <h3 className="text-lg font-semibold mb-4 text-blue-700">📋 Confirmation Details</h3>
                        <div className="space-y-2 text-sm text-gray-700">
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
