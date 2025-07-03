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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.UserId) return;

        getIncidentHistoryByGuardian(user.UserId)
            .then((res) => setIncidents(res.data))
            .catch((err) => console.error("Lỗi lấy lịch sử sự cố:", err))
            .finally(() => setLoading(false));
    }, [user?.UserId]);

    if (!user?.UserId || loading) {
        return <p className="text-gray-500">Đang tải thông tin người dùng...</p>;
    }

    return (
        <div className="p-6 bg-gray-50 rounded-2xl shadow-inner space-y-6">
            <h2 className="text-2xl font-bold text-blue-700">📘 Lịch sử sự cố của học sinh</h2>

            {incidents.length === 0 ? (
                <div className="text-gray-500 italic">Chưa có sự cố nào được ghi nhận.</div>
            ) : (
                <div className="space-y-4">
                    {incidents.map((incident, index) => (
                        <div
                            key={index}
                            className="p-4 bg-white rounded-xl shadow-md border border-gray-200 flex justify-between items-start hover:bg-blue-50 transition duration-200"
                        >
                            <div>
                                <p className="font-semibold text-gray-800">🔹 {incident.incidentName}</p>
                                <p className="text-sm text-gray-600 mt-1"><strong>📅 Ngày:</strong> {formatDate(incident.occurredAt)}</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setSelectedIncident(incident)}>
                                Chi tiết
                            </Button>
                        </div>
                    ))}
                </div>
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
