import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import type { IncidentHistoryItem } from "../pages/IncidentManagement";


interface Props {
    incidentHistory: IncidentHistoryItem[];
}
const IncidentHistory: React.FC<Props> = ({ incidentHistory }) => {
    const [historyPage, setHistoryPage] = useState(1);
    const [selectedIncidentGroup, setSelectedIncidentGroup] = useState<IncidentHistoryItem[] | null>(null);
    const [expandedClass, setExpandedClass] = useState<string | null>(null);

    // Gom nhóm theo tên sự cố
    const groupedIncidents = Object.entries(
        incidentHistory.reduce((groups, item) => {
            const key = item.incidentName;
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
            return groups;
        }, {} as Record<string, IncidentHistoryItem[]>)
    );

    const itemsPerPageHistory = 5;
    const totalHistoryPages = Math.ceil(groupedIncidents.length / itemsPerPageHistory);
    const paginatedGroupedIncidents = groupedIncidents.slice(
        (historyPage - 1) * itemsPerPageHistory,
        historyPage * itemsPerPageHistory
    );

    // Group theo lớp cho dialog detail
    const groupedByClass = (selectedIncidentGroup || []).reduce((acc, item) => {
        if (!acc[item.className]) acc[item.className] = [];
        acc[item.className].push(item);
        return acc;
    }, {} as Record<string, IncidentHistoryItem[]>);

    return (
        <div className="mt-10">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Incident History</h2>
            {paginatedGroupedIncidents.map(([incidentName, items]) => (
                <div key={incidentName} className="border rounded p-4 mb-4 bg-gray-50 shadow flex justify-between items-center">
                    <span className="font-medium text-lg text-blue-600">
                        {incidentName} ({items.length} học sinh)
                    </span>
                    <Button
                        onClick={() => setSelectedIncidentGroup(items)}
                        className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1"
                    >
                        Detail
                    </Button>
                </div>
            ))}

            {/* Phân trang */}
            <div className="flex justify-center gap-2 mt-4">
                <Button
                    className="bg-blue-500 text-white"
                    variant="outline"
                    disabled={historyPage === 1}
                    onClick={() => setHistoryPage(p => p - 1)}
                >
                    Trang trước
                </Button>
                <span className="px-2 py-1 ">Trang {historyPage} / {totalHistoryPages}</span>
                <Button
                    className="bg-blue-500 text-white"
                    variant="outline"
                    disabled={historyPage === totalHistoryPages}
                    onClick={() => setHistoryPage(p => p + 1)}
                >
                    Trang sau
                </Button>
            </div>

            {/* Dialog chi tiết */}
            <Dialog open={!!selectedIncidentGroup} onOpenChange={() => {
                setSelectedIncidentGroup(null);
                setExpandedClass(null);
            }}>
                <DialogContent className="max-w-3xl backdrop:bg-transparent">
                    <DialogHeader>
                        <DialogTitle className="text-blue-500">
                            Chi tiết sự cố: {selectedIncidentGroup?.[0]?.incidentName}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 max-h-[500px] overflow-y-auto">
                        {Object.entries(groupedByClass).map(([className, students]) => (
                            <div key={className} className="border rounded p-3 bg-gray-100">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-blue-600">{className} ({students.length} học sinh)</span>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setExpandedClass(expandedClass === className ? null : className)}
                                    >
                                        {expandedClass === className ? "Ẩn" : "Xem học sinh"}
                                    </Button>
                                </div>
                                {expandedClass === className && (
                                    <div className="mt-2 space-y-2">
                                        {students.map((item, idx) => (
                                            <div key={idx} className="border p-2 rounded bg-white">
                                                <div><strong>Học sinh:</strong> {item.studentName}</div>
                                                <div><strong>Mô tả:</strong> {item.description}</div>
                                                <div><strong>Xử lý bởi:</strong> {item.handledBy}</div>
                                                <div><strong>Thời gian:</strong> {new Date(item.createdAt).toLocaleString()}</div>
                                                {/* Nếu muốn show supply, bổ sung thêm dòng dưới */}
                                                {/* <div><strong>Vật tư:</strong> {(item.supplies || []).map(s => `${s.supplyName} (${s.quantity})`).join(', ')}</div> */}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button onClick={() => {
                            setSelectedIncidentGroup(null);
                            setExpandedClass(null);
                        }} className="bg-blue-500 text-white">
                            Đóng
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default IncidentHistory;
