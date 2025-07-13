// src/pages/parent/ParentVaccineResult.tsx
import { useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { apiser } from "../../service/apiser";

interface VaccineResult {
    studentId: number;
    studentName: string;
    className: string;
    vaccinated: boolean;
    vaccinatedDate?: string;
    observationStatus?: string;
    confirmStatus: string;
}

export default function ParentVaccineResult() {
    const { user } = useAuth();
    const [data, setData] = useState<VaccineResult[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await apiser.get("/vaccinations/by-guardian", {
                    params: { guardianId: user?.UserId },
                });
                setData(res.data || []);
                setCurrentPage(1); // Reset về trang đầu mỗi khi load mới
            } catch (err) {
                console.error("Error fetching vaccine result", err);
            }
        };

        if (user?.UserId) fetchData();
    }, [user]);

    // Tính toán danh sách hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-blue-700 mb-6">
                💉 Vaccine Results for Your Children
            </h1>

            <div className="overflow-x-auto bg-white shadow-md rounded-xl">
                <table className="w-full text-sm text-center border">
                    <thead className="bg-blue-100 text-gray-700">
                        <tr>
                            <th className="px-4 py-2 border">Student</th>
                            <th className="px-4 py-2 border">Class</th>
                            <th className="px-4 py-2 border">Confirmed</th>
                            <th className="px-4 py-2 border">Vaccinated</th>
                            <th className="px-4 py-2 border">Date</th>
                            <th className="px-4 py-2 border">Observation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((stu, index) => (
                            <tr
                                key={`${stu.studentId}-${index}`} // Đảm bảo key duy nhất
                                className="border hover:bg-blue-50"
                            >
                                <td className="border px-4 py-2">{stu.studentName}</td>
                                <td className="border px-4 py-2">{stu.className}</td>
                                <td className="border px-4 py-2">{stu.confirmStatus}</td>
                                <td className="border px-4 py-2">
                                    {stu.vaccinated ? "✅ Yes" : "❌ No"}
                                </td>
                                <td className="border px-4 py-2">
                                    {stu.vaccinatedDate
                                        ? new Date(stu.vaccinatedDate).toLocaleDateString()
                                        : "-"}
                                </td>
                                <td className="border px-4 py-2">
                                    {stu.observationStatus || "-"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-center gap-2 flex-wrap">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={`page-${i + 1}`}
                        className={`px-3 py-1 border rounded-md ${currentPage === i + 1
                                ? "bg-blue-600 text-white"
                                : "bg-white text-blue-600"
                            } hover:bg-blue-100`}
                        onClick={() => handlePageChange(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}
