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

const IncidentHistory = () => {
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
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Lịch sử sự cố của học sinh</h2>
            {incidents.length === 0 ? (
                <p>Chưa có sự cố nào.</p>
            ) : (
                <div className="space-y-4">
                    {incidents.map((incident, index) => (
                        <div
                            key={index}
                            className="p-4 border rounded shadow flex justify-between items-center bg-white"
                        >
                            <div>
                                <p><strong>Sự cố:</strong> {incident.incidentName}</p>
                                <p><strong>Ngày:</strong> {formatDate(incident.occurredAt)}</p>
                            </div>
                            <Button onClick={() => setSelectedIncident(incident)}>Chi tiết</Button>
                        </div>
                    ))}
                </div>
            )}

            <Dialog open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
                <DialogContent className="!max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Chi tiết sự cố</DialogTitle>
                    </DialogHeader>
                    {selectedIncident && (
                        <div className="space-y-2">
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

export default IncidentHistory;
