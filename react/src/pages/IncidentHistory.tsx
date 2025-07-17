"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { GetIncidentHistory } from "../service/serviceauth";

interface Props {
    refresh: boolean;
    onRefreshed: () => void;
}

// ✅ Nhóm theo incidentName và sắp xếp giảm dần theo createdAt
function groupIncidentsByEvent(incidents: any[]) {
    const groups: { [key: string]: any[] } = {};

    incidents.forEach((incident) => {
        const key = incident.incidentName;
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(incident);
    });

    return Object.entries(groups)
        .map(([incidentName, incidents]) => ({
            incidentName,
            incidents,
            latestTime: Math.max(...incidents.map(i => new Date(i.createdAt).getTime())),
        }))
        .sort((a, b) => b.latestTime - a.latestTime);
}

export default function IncidentHistoryGroup({ refresh, onRefreshed }: Props) {
    const [incidents, setIncidents] = useState<any[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<any | null>(null);

    const [currentGroupPage, setCurrentGroupPage] = useState(1);
    const groupsPerPage = 5;

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchData = async () => {
        const data = await GetIncidentHistory();
        setIncidents(data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (refresh) {
            fetchData().then(() => onRefreshed());
        }
    }, [refresh]);

    const groupedIncidents = groupIncidentsByEvent(incidents);

    // ✅ Phân trang ngoài (danh sách nhóm)
    const totalGroupPages = Math.ceil(groupedIncidents.length / groupsPerPage);
    const paginatedGroups = groupedIncidents.slice(
        (currentGroupPage - 1) * groupsPerPage,
        currentGroupPage * groupsPerPage
    );

    // ✅ Phân trang bên trong dialog
    const totalPages = selectedGroup
        ? Math.ceil(selectedGroup.incidents.length / itemsPerPage)
        : 0;

    const paginatedIncidents = selectedGroup
        ? selectedGroup.incidents.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
          )
        : [];

    return (
        <div>
         <h2 className="text-3xl font-bold text-blue-900 drop-shadow p-10">Incident History</h2>
        <div className="p-6 bg-white rounded-2xl space-y-4 flex flex-col justify-between min-h-120">
           

            {groupedIncidents.length === 0 && (
                <div className="text-gray-500">No incident records available.</div>
            )}

            {/* ✅ Danh sách sự cố nhóm (phân trang) */}
            <div className="space-y-3">
                {paginatedGroups.map((group, index) => (
                    <div
                        key={index}
                        onClick={() => {
                            setSelectedGroup(group);
                            setCurrentPage(1); // reset trang trong dialog
                        }}
                        className="p-3 flex justify-between border rounded-xl cursor-pointer hover:bg-blue-50 transition text-blue-900 font-semibold"
                    >
                        <div>{group.incidentName}</div>
                        <div>{new Date(group.latestTime).toLocaleString()}</div>
                    </div>
                ))}
            </div>

            {/* ✅ Phân trang danh sách nhóm */}
            {totalGroupPages > 1 && (
                <div className="flex  items-center  justify-center pt-4">
                    <button
                        disabled={currentGroupPage === 1}
                        onClick={() => setCurrentGroupPage(prev => prev - 1)}
                        className="px-4 py-1 rounded-xl border hover:bg-gray-100 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-700">
                        Page {currentGroupPage} of {totalGroupPages}
                    </span>
                    <button
                        disabled={currentGroupPage === totalGroupPages}
                        onClick={() => setCurrentGroupPage(prev => prev + 1)}
                        className="px-4 py-1 rounded-xl border hover:bg-gray-100 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* ✅ Dialog chi tiết */}
            {selectedGroup && (
                <Dialog open={true} onOpenChange={() => setSelectedGroup(null)}>
                    <DialogContent className="rounded-2xl max-w-2xl">
                        <DialogTitle className="text-blue-900 text-2xl mb-4">
                            {selectedGroup.incidentName}
                        </DialogTitle>

                        <div className="space-y-4 text-blue-900 max-h-[400px] overflow-y-auto">
                            {paginatedIncidents.map((item: any, index: number) => (
                                <div key={index} className="p-3 border rounded-xl">
                                    <div><strong>Student:</strong> {item.studentName}</div>
                                    <div><strong>Class:</strong> {item.className}</div>
                                    <div><strong>Description:</strong> {item.description}</div>
                                    <div><strong>Handled By:</strong> {item.handledBy}</div>
                                    <div><strong>Time:</strong> {new Date(item.createdAt).toLocaleString()}</div>
                                    <div>
                                        <strong>Supplies Used:</strong>{" "}
                                        {item.suppliesUsed.length === 0 ? (
                                            <span className="text-gray-500">None</span>
                                        ) : (
                                            <ul className="list-disc ml-5">
                                                {item.suppliesUsed.map((sup: any, i: number) => (
                                                    <li key={i}>
                                                        {sup.supplyName} — {sup.quantity}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ✅ Phân trang trong dialog */}
                        {totalPages > 1 && (
                            <div className="flex justify-between items-center pt-4">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                    className="px-4 py-1 rounded-xl border hover:bg-gray-100 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-gray-700">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    className="px-4 py-1 rounded-xl border hover:bg-gray-100 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        <div className="flex justify-end pt-4">
                            <button
                                onClick={() => setSelectedGroup(null)}
                                className="px-4 py-2 bg-blue-900 text-white rounded-xl hover:bg-blue-800"
                            >
                                Close
                            </button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            </div>
        </div>
    );
}
