import { useEffect, useState } from "react";
import { getIncidentHistoryByGuardian } from "../service/serviceauth";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

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
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
    const [,setLoading] = useState(true);

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
        <div className="p-6 bg-gray-50 rounded-2xl shadow-md space-y-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-blue-700">📘 Lịch sử sự cố của học sinh</h2>

            {incidents.length === 0 ? (
                <div className="text-gray-500 italic">Chưa có sự cố nào được ghi nhận.</div>
            ) : (
                <>
                    <div className="space-y-4">
                        {currentIncidents.map((incident, index) => (
                            <div
                                key={index}
                                className="p-4 bg-white rounded-xl shadow border border-gray-200 flex justify-between items-start hover:bg-blue-50 transition"
                            >
                                <div>
                                    <p className="font-semibold text-gray-800">🔹 {incident.incidentName}</p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        <strong>📅 Ngày:</strong> {formatDate(incident.occurredAt)}
                                    </p>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => setSelectedIncident(incident)}>
                                    Chi tiết
                                </Button>
                            </div>
                        ))}
                    </div>

                    {/* Pagination controls */}
                    <div className="flex justify-center items-center gap-4 mt-4">
                        <Button
                            variant="outline"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                        >
                            ⬅️ Trước
                        </Button>
                        <span className="text-gray-600">
                            Trang {currentPage} / {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                        >
                            Tiếp ➡️
                        </Button>
                    </div>
                </>
            )}

            {/* Dialog: Chi tiết sự cố */}
            <Dialog open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
                <DialogContent className="!max-w-[600px] bg-white rounded-xl p-6 shadow-xl space-y-4">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-blue-700">🔍 Chi tiết sự cố</DialogTitle>
                    </DialogHeader>

                    {selectedIncident && (
                        <div className="space-y-2 text-[15px] text-gray-700">
                            <p><strong>Lớp:</strong> {selectedIncident.className || "Không rõ"}</p>
                            <p><strong>Học sinh:</strong> {selectedIncident.studentName || "Không rõ"}</p>
                            <p><strong>Sự cố:</strong> {selectedIncident.incidentName}</p>
                            <p><strong>Người xử lý:</strong> {selectedIncident.handledBy}</p>
                            <p><strong>Mô tả:</strong> {selectedIncident.description}</p>
                            <p><strong>Ngày xảy ra:</strong> {formatDate(selectedIncident.occurredAt)}</p>
                        </div>
                    )}

                    <DialogFooter>
                        <Button onClick={() => setSelectedIncident(null)}>Đóng</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default IncidentHistoryParent;
