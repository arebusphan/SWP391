import { useEffect, useState } from "react";

import { apiser } from "../../service/apiser";

interface HealthCheck {
    studentId: number;
    studentName: string;
    heightCm: number;
    weightKg: number;
    leftEyeVision: number;
    rightEyeVision: number;
    leftEarHearing: string;
    rightEarHearing: string;
    spineStatus: string;
    skinStatus: string;
    oralHealth: string;
    otherNotes: string;
    checkDate: string;
    classId: number;
    className: string;
}

interface Class {
    classId: number;
    className: string;
}

const ParentHealthCheck = () => {
    const [records, setRecords] = useState<HealthCheck[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            const response = await apiser.get("/students/my-health-checks", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setRecords(response.data);

            const classResponse = await apiser.get("/classes", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setClasses(classResponse.data);
        };

        fetchData().catch(err => console.error("API Error:", err));
    }, []);

    const filteredRecords = selectedClassId
        ? records.filter(r => r.classId === selectedClassId)
        : records;

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

    return (
        <div className="p-6">
            <div className="bg-white shadow-xl rounded-xl p-6">
                <h2 className="text-2xl font-bold text-blue-800 text-center mb-6">
                    Periodic Health Check Records
                </h2>

                <div className="mb-4">
                    <label className="font-semibold">Filter by Class:</label>
                    <select
                        className="ml-2 border rounded px-3 py-1"
                        value={selectedClassId ?? ""}
                        onChange={(e) => {
                            setSelectedClassId(e.target.value ? Number(e.target.value) : null);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">All Classes</option>
                        {classes.map(cls => (
                            <option key={cls.classId} value={cls.classId}>{cls.className}</option>
                        ))}
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="table-auto w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="px-3 py-2">Student</th>
                                <th className="px-3 py-2">Class</th>
                                <th className="px-3 py-2">Height</th>
                                <th className="px-3 py-2">Weight</th>
                                <th className="px-3 py-2">Vision (L/R)</th>
                                <th className="px-3 py-2">Hearing (L/R)</th>
                                <th className="px-3 py-2">Spine</th>
                                <th className="px-3 py-2">Skin</th>
                                <th className="px-3 py-2">Oral</th>
                                <th className="px-3 py-2">Date</th>
                                <th className="px-3 py-2">Other Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRecords.map((r, i) => (
                                <tr key={i} className="border-t hover:bg-gray-50">
                                    <td className="px-3 py-2">{r.studentName}</td>
                                    <td className="px-3 py-2">{classes.find(c => c.classId === r.classId)?.className || "-"}</td>
                                    <td className="px-3 py-2">{r.heightCm} cm</td>
                                    <td className="px-3 py-2">{r.weightKg} kg</td>
                                    <td className="px-3 py-2">{r.leftEyeVision} / {r.rightEyeVision}</td>
                                    <td className="px-3 py-2">{r.leftEarHearing} / {r.rightEarHearing}</td>
                                    <td className="px-3 py-2">{r.spineStatus}</td>
                                    <td className="px-3 py-2">{r.skinStatus}</td>
                                    <td className="px-3 py-2">{r.oralHealth}</td>
                                    <td className="px-3 py-2">{new Date(r.checkDate).toLocaleDateString("vi-VN")}</td>
                                    <td className="px-3 py-2">{r.otherNotes}</td>
                                </tr>
                            ))}
                            {currentRecords.length === 0 && (
                                <tr>
                                    <td colSpan={11} className="text-center py-4 text-gray-500">
                                        No health check records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-center mt-4 space-x-2">
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                        <button
                            key={page}
                            className={`px-3 py-1 border rounded ${page === currentPage ? "bg-blue-600 text-white" : "bg-white text-blue-600"}`}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ParentHealthCheck;
