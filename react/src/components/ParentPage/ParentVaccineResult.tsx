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
                setCurrentPage(1);
            } catch (err) {
                console.error("Error fetching vaccine result", err);
            }
        };

        if (user?.UserId) fetchData();
    }, [user]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="  mx-auto ">
            <h1 className="text-4xl font-bold text-blue-800  p-10">
                Vaccine Results for Your Children
            </h1>

            <div className="overflow-x-auto bg-white shadow-lg rounded-2xl border border-gray-300">
                <table className="w-full text-sm text-center border-collapse">
                    <thead className="bg-blue-900 text-white drop-shadow text-[15px]">
                        <tr>
                            <th className="px-4 py-3 border border-gray-300">Student</th>
                            <th className="px-4 py-3 border border-gray-300">Class</th>
                            <th className="px-4 py-3 border border-gray-300">Confirmed</th>
                            <th className="px-4 py-3 border border-gray-300">Vaccinated</th>
                            <th className="px-4 py-3 border border-gray-300">Date</th>
                            <th className="px-4 py-3 border border-gray-300">Observation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((stu, index) => (
                            <tr
                                key={`${stu.studentId}-${index}`}
                                className="border border-gray-300  transition"
                            >
                                <td className="border border-gray-300 px-4 py-2">{stu.studentName}</td>
                                <td className="border border-gray-300 px-4 py-2">{stu.className}</td>
                                <td className="border border-gray-300 px-4 py-2">{stu.confirmStatus}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {stu.vaccinated ? "✅ Yes" : "❌ No"}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {stu.vaccinatedDate
                                        ? new Date(stu.vaccinatedDate).toLocaleDateString()
                                        : "-"}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {stu.observationStatus || "-"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-center gap-2 flex-wrap">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={`page-${i + 1}`}
                        className={`px-4 py-2 border rounded-lg font-semibold drop-shadow transition ${currentPage === i + 1
                                ? "bg-blue-900 text-white"
                                : "bg-white text-blue-900 border-blue-900"
                            } hover:bg-blue-800 hover:text-white`}
                        onClick={() => handlePageChange(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}
