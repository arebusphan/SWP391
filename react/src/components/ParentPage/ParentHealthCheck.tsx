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
                headers: { Authorization: `Bearer ${token}` },
            });
            setRecords(response.data);

            const classResponse = await apiser.get("/classes", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setClasses(classResponse.data);
        };

        fetchData().catch((err) => console.error("API Error:", err));
    }, []);

    const filteredRecords = selectedClassId
        ? records.filter((r) => r.classId === selectedClassId)
        : records;

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredRecords.slice(
        indexOfFirstRecord,
        indexOfLastRecord
    );
    const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

    return (
        <div>
            <h2 className="text-4xl font-bold text-blue-900 drop-shadow text-center p-10">
                 Periodic Health Check Records
            </h2>
        <div className=" mx-auto">
            <div className="bg-white shadow-xl rounded-2xl p-6">
                

                <div className="mb-4 flex items-center gap-2">
                    <label className="font-semibold text-blue-900">Filter by Class:</label>
                    <select
                        className="border border-gray-300 rounded px-3 py-1 focus:ring focus:ring-blue-200"
                        value={selectedClassId ?? ""}
                        onChange={(e) => {
                            setSelectedClassId(e.target.value ? Number(e.target.value) : null);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">All Classes</option>
                        {classes.map((cls) => (
                            <option key={cls.classId} value={cls.classId}>
                                {cls.className}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="overflow-x-auto border rounded-lg">
                    <table className="table-auto w-full text-sm border-collapse">
                        <thead className="bg-blue-900 text-white">
                            <tr>
                                <th className="border px-3 py-2">Student</th>
                                <th className="border px-3 py-2">Class</th>
                                <th className="border px-3 py-2">Height</th>
                                <th className="border px-3 py-2">Weight</th>
                                <th className="border px-3 py-2">Vision (L/R)</th>
                                <th className="border px-3 py-2">Hearing (L/R)</th>
                                <th className="border px-3 py-2">Spine</th>
                                <th className="border px-3 py-2">Skin</th>
                                <th className="border px-3 py-2">Oral</th>
                                <th className="border px-3 py-2">Date</th>
                                <th className="border px-3 py-2">Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRecords.map((r, i) => (
                                <tr
                                    key={i}
                                    className="border-t hover:bg-blue-50 text-gray-800"
                                >
                                    <td className="border px-3 py-2">{r.studentName}</td>
                                    <td className="border px-3 py-2">
                                        {classes.find((c) => c.classId === r.classId)?.className || "-"}
                                    </td>
                                    <td className="border px-3 py-2">{r.heightCm} cm</td>
                                    <td className="border px-3 py-2">{r.weightKg} kg</td>
                                    <td className="border px-3 py-2">
                                        {r.leftEyeVision} / {r.rightEyeVision}
                                    </td>
                                    <td className="border px-3 py-2">
                                        {r.leftEarHearing} / {r.rightEarHearing}
                                    </td>
                                    <td className="border px-3 py-2">{r.spineStatus}</td>
                                    <td className="border px-3 py-2">{r.skinStatus}</td>
                                    <td className="border px-3 py-2">{r.oralHealth}</td>
                                    <td className="border px-3 py-2">
                                        {new Date(r.checkDate).toLocaleDateString("vi-VN")}
                                    </td>
                                    <td className="border px-3 py-2">{r.otherNotes}</td>
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

                <div className="flex justify-center mt-6 space-x-2 flex-wrap">
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                        (page) => (
                            <button
                                key={page}
                                className={`px-3 py-1 border rounded ${page === currentPage
                                        ? "bg-blue-900 text-white"
                                        : "bg-white text-blue-900 hover:bg-blue-100"
                                    }`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        )
                    )}
                </div>
            </div>
            </div>
        </div>
    );
};

export default ParentHealthCheck;
