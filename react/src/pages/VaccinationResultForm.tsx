import axios from "axios";
import { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

interface Class {
    classId: number;
    className: string;
}

interface NotificationBasic {
    notificationId: number;
    eventName: string;
    eventDate: string;
}


interface VaccinationStudent {
    studentId: number;
    studentName: string;
    className: string;
    confirmStatus: string;
    vaccinated?: boolean;
    vaccinatedDate?: string;
    observationStatus?: string;
    parentPhone?: string;
}

const VaccineResultForm = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [notifications, setNotifications] = useState<NotificationBasic[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<number>(0);
    const [selectedNotificationId, setSelectedNotificationId] = useState<number>(0);
    const [students, setStudents] = useState<VaccinationStudent[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<VaccinationStudent | null>(null);
    const [vaccinated, setVaccinated] = useState<boolean | null>(null);
    const [observationStatus, setObservationStatus] = useState<string>("");
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [filterVaccine, setFilterVaccine] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const studentsPerPage = 10;

    useEffect(() => {
        axios.get("https://localhost:7195/api/classes").then((res) => {
            setClasses(res.data);
            setSelectedClassId(res.data[0]?.classId);
        });
        axios.get("https://localhost:7195/api/notifications/list-basic").then((res) => {
            setNotifications(res.data);
            setSelectedNotificationId(res.data[0]?.notificationId);
        });
    }, []);

    useEffect(() => {
        if (selectedClassId && selectedNotificationId) {
            axios
                .get("https://localhost:7195/api/vaccinations/by-notification", {
                    params: { notificationId: selectedNotificationId, classId: selectedClassId },
                })
                .then((res) => setStudents(res.data));
        }
    }, [selectedClassId, selectedNotificationId]);

    const handleSave = async () => {
        if (!selectedStudent || vaccinated === null) return;

        await axios.post("https://localhost:7195/api/vaccinations/record", {
            studentId: selectedStudent.studentId,
            notificationId: selectedNotificationId,
            vaccinated,
            vaccinatedDate: new Date().toISOString(),
            observationStatus,
            vaccinatedBy: "BS. Hồng Hà",
        });

        setSelectedStudent(null);
        setVaccinated(null);
        setObservationStatus("");

        const res = await axios.get("https://localhost:7195/api/vaccinations/by-notification", {
            params: { notificationId: selectedNotificationId, classId: selectedClassId },
        });
        setStudents(res.data);
    };

    const filtered = students.filter((s) => {
        const matchVaccine =
            filterVaccine === "Vaccinated"
                ? s.vaccinated === true
                : filterVaccine === "NotVaccinated"
                ? !s.vaccinated
                : true;
        return s.confirmStatus === "Confirmed" && matchVaccine;
    });

    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filtered.slice(indexOfFirstStudent, indexOfLastStudent);
    const totalPages = Math.ceil(filtered.length / studentsPerPage);

    const handleExport = () => {
        const exportData = students
            .filter((s) => selectedIds.includes(s.studentId))
            .map((s) => ({
                "Student ID": s.studentId,
                "Student Name": s.studentName,
                "Class": s.className,
                "Vaccinated": s.vaccinated ? "Yes" : "No",
                "Vaccinated Date": s.vaccinatedDate || "",
                "Observation": s.observationStatus || "",
            }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Vaccinated List");
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "vaccination_result.xlsx");
    };

    const toggleSelectAllVaccinated = () => {
        const vaccinatedIds = filtered.filter((s) => s.vaccinated).map((s) => s.studentId);
        const isAllSelected = vaccinatedIds.every((id) => selectedIds.includes(id));
        setSelectedIds(isAllSelected ? [] : vaccinatedIds);
    };

    return (
        <div className="max-w-7xl mx-auto p-8 bg-white mt-10 shadow-lg rounded-2xl">
            <h2 className="text-3xl font-bold mb-8 text-center text-blue-800">💉 Vaccine Result</h2>

            {/* Bộ lọc */}
            <div className="flex flex-wrap gap-4 mb-8 justify-center items-center">
                <select
                    className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={selectedNotificationId}
                    onChange={(e) => {
                        setSelectedNotificationId(+e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    {notifications.map((n) => (
                        <option key={n.notificationId} value={n.notificationId}>
                            {n.eventName} ({n.eventDate})
                        </option>
                    ))}
                </select>

                <select
                    className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={selectedClassId}
                    onChange={(e) => {
                        setSelectedClassId(+e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    {classes.map((c) => (
                        <option key={c.classId} value={c.classId}>
                            {c.className}
                        </option>
                    ))}
                </select>

                <label className="flex items-center gap-2 text-sm">
                    Vaccination status:
                    <select
                        className="border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={filterVaccine}
                        onChange={(e) => {
                            setFilterVaccine(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">All</option>
                        <option value="Vaccinated">Vaccinated</option>
                        <option value="NotVaccinated">Not Vaccinated</option>
                    </select>
                </label>
            </div>

            {/* Bảng kết quả */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-300 rounded-md overflow-hidden">
                    <thead className="bg-blue-100 text-gray-800 font-semibold text-center">
                        <tr>
                            <th className="border px-4 py-2">Student ID</th>
                            <th className="border px-4 py-2">Name</th>
                            <th className="border px-4 py-2">Vaccinated</th>
                            <th className="border px-4 py-2">Action</th>
                            <th className="border px-4 py-2">
                                <div className="flex justify-center items-center gap-2">
                                    Select
                                    <input
                                        type="checkbox"
                                        onChange={toggleSelectAllVaccinated}
                                        checked={
                                            filtered
                                                .filter((s) => s.vaccinated)
                                                .every((s) => selectedIds.includes(s.studentId)) &&
                                            filtered.some((s) => s.vaccinated)
                                        }
                                    />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white text-center">
                        {currentStudents.map((stu) => (
                            <tr key={stu.studentId} className="hover:bg-blue-50 transition">
                                <td className="border px-4 py-2">{stu.studentId}</td>
                                <td className="border px-4 py-2">{stu.studentName}</td>
                                <td className="border px-4 py-2">{stu.vaccinated ? "Yes" : "No"}</td>
                                <td
                                    className="border px-4 py-2 text-blue-600 underline cursor-pointer"
                                    onClick={() => setSelectedStudent(stu)}
                                >
                                    View Detail
                                </td>
                                <td className="border px-4 py-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(stu.studentId)}
                                        onChange={() =>
                                            setSelectedIds((prev) =>
                                                prev.includes(stu.studentId)
                                                    ? prev.filter((id) => id !== stu.studentId)
                                                    : [...prev, stu.studentId]
                                            )
                                        }
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Phân trang + Export */}
            <div className="flex justify-between items-center mt-6">
                <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            className={`px-3 py-1 rounded-lg text-sm ${page === currentPage
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                }`}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </button>
                    ))}
                </div>
                <button
                    onClick={handleExport}
                    className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition font-medium"
                >
                    Export to Excel
                </button>
            </div>

            {/* Modal chi tiết học sinh */}
            {selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative bg-white rounded-xl shadow-xl p-6 w-[440px] max-w-full z-10">
                        <button
                            onClick={() => setSelectedStudent(null)}
                            className="absolute top-2 right-3 text-xl text-gray-600 hover:text-red-500"
                        >
                            &times;
                        </button>

                        <h3 className="text-lg font-semibold mb-4 text-blue-700">📋 Student Details</h3>
                        <div className="space-y-3 text-sm text-gray-700">
                            <div><strong>Name:</strong> {selectedStudent.studentName}</div>
                            <div><strong>Class:</strong> {selectedStudent.className}</div>
                            <div><strong>Phone:</strong> {selectedStudent.parentPhone}</div>

                            <div>
                                <label className="block font-medium mb-1">Vaccination Status:</label>
                                <div className="flex gap-4">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="vaccinated"
                                            checked={vaccinated === true}
                                            onChange={() => setVaccinated(true)}
                                        />
                                        <span className="ml-2">Vaccinated</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="vaccinated"
                                            checked={vaccinated === false}
                                            onChange={() => setVaccinated(false)}
                                        />
                                        <span className="ml-2">Not Vaccinated</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Observation:</label>
                                <textarea
                                    value={observationStatus}
                                    onChange={(e) => setObservationStatus(e.target.value)}
                                    className="w-full border border-gray-300 mt-1 p-2 rounded focus:ring-blue-500 focus:border-blue-500"
                                    rows={3}
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    onClick={handleSave}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setSelectedStudent(null)}
                                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
};

export default VaccineResultForm;
