import { useEffect, useState } from "react";
import axios from "axios";

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
}

const ParentHealthCheck = () => {
    const [records, setRecords] = useState<HealthCheck[]>([]);

    const getMyHealthChecks = async () => {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://localhost:7195/api/students/my-health-checks", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    };

    useEffect(() => {
        getMyHealthChecks()
            .then(data => setRecords(data))
            .catch(err => console.error("Lỗi gọi API:", err));
    }, []);

    return (
        <div className="p-6">
            <div className="bg-white shadow-xl rounded-xl p-6">
                <h2 className="text-2xl font-bold text-blue-800 text-center mb-6">
                    Student Health Check Records
                </h2>
                <div className="overflow-x-auto">
                    <table className="table-auto w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="px-3 py-2">Student</th>
                                <th className="px-3 py-2">Height</th>
                                <th className="px-3 py-2">Weight</th>
                                <th className="px-3 py-2">Vision (L/R)</th>
                                <th className="px-3 py-2">Hearing (L/R)</th>
                                <th className="px-3 py-2">Spine</th>
                                <th className="px-3 py-2">Skin</th>
                                <th className="px-3 py-2">Oral</th>
                                <th className="px-3 py-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((r, i) => (
                                <tr key={i} className="border-t hover:bg-gray-50">
                                    <td className="px-3 py-2">{r.studentName}</td>
                                    <td className="px-3 py-2">{r.heightCm} cm</td>
                                    <td className="px-3 py-2">{r.weightKg} kg</td>
                                    <td className="px-3 py-2">{r.leftEyeVision} / {r.rightEyeVision}</td>
                                    <td className="px-3 py-2">{r.leftEarHearing} / {r.rightEarHearing}</td>
                                    <td className="px-3 py-2">{r.spineStatus}</td>
                                    <td className="px-3 py-2">{r.skinStatus}</td>
                                    <td className="px-3 py-2">{r.oralHealth}</td>
                                    <td className="px-3 py-2">
                                        {new Date(r.checkDate).toLocaleDateString("vi-VN")}
                                    </td>
                                </tr>
                            ))}
                            {records.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="text-center py-4 text-gray-500">
                                        No health check records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ParentHealthCheck;
