import { useEffect, useState } from "react";
import { getIncidentHistoryByGuardian } from "../service/serviceauth";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";

interface Incident {
    incidentName: string;
    className?: string;
    studentName?: string;
    handledBy: string;
    description: string;
    occurredAt: string;
    suppliesUsed?: { supplyName: string; quantity: number }[];
}

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "Không rõ ngày" : date.toLocaleString("vi-VN");
};

const IncidentHistoryParent = () => {
    const { user } = useAuth();
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [, setLoading] = useState(true);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const totalPages = Math.ceil(incidents.length / itemsPerPage);
    const currentIncidents = incidents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        if (!user?.UserId) return;

        getIncidentHistoryByGuardian(user.UserId)
            .then((res) => {
                const sorted = [...res.data].sort(
                    (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
                );
                setIncidents(sorted);
            })
            .catch((err) => console.error("Lỗi lấy lịch sử sự cố:", err))
            .finally(() => setLoading(false));
    }, [user?.UserId]);

    return (
        <div>
            <h2 className="text-4xl font-bold  text-blue-800 p-10">
                Incident History
            </h2>
        <div className="  rounded-2xl shadow-md mx-auto drop-shadow">
           

            {incidents.length === 0 ? (
                <div className="text-gray-500 italic text-center">Chưa có sự cố nào được ghi nhận.</div>
            ) : (
                <>
                    <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-300">
                        <table className="w-full text-sm text-center">
                            <thead className="bg-blue-900 text-white">
                                <tr>
                                    <th className="border px-3 py-2">#</th>
                                    <th className="border px-3 py-2">Tên sự cố</th>
                                    <th className="border px-3 py-2">Ngày</th>
                                    <th className="border px-3 py-2">Lớp</th>
                                    <th className="border px-3 py-2">Học sinh</th>
                                    <th className="border px-3 py-2">Người xử lý</th>
                                    <th className="border px-3 py-2">Mô tả</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentIncidents.map((incident, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-blue-50 transition border-b text-gray-800"
                                    >
                                        <td className="border px-3 py-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <td className="border px-3 py-2">{incident.incidentName}</td>
                                        <td className="border px-3 py-2">{formatDate(incident.occurredAt)}</td>
                                        <td className="border px-3 py-2">{incident.className || "Không rõ"}</td>
                                        <td className="border px-3 py-2">{incident.studentName || "Không rõ"}</td>
                                        <td className="border px-3 py-2">{incident.handledBy}</td>
                                        <td className="border px-3 py-2 text-left">{incident.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center gap-4 mt-6">
                        <Button
                            variant="outline"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                            className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white"
                        >
                             Previous
                        </Button>
                        <span className="text-gray-700 font-medium">
                            Trang {currentPage} / {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white"
                        >
                            Next 
                        </Button>
                    </div>
                </>
            )}
            </div>
        </div>
    );
};

export default IncidentHistoryParent;
