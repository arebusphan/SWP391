"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { GetIncidentHistory } from "../service/serviceauth";

interface Props {
    refresh: boolean;
    onRefreshed: () => void;
}

// ✅ Hàm nhóm và sắp xếp giảm dần theo thời gian
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

    return (
        <div className="p-6 bg-white rounded-2xl space-y-4">
            <h2 className="text-3xl font-bold text-blue-900 drop-shadow">Incident History</h2>

            {groupedIncidents.length === 0 && (
                <div className="text-gray-500">No incident records available.</div>
            )}

            <div className="space-y-3">
                {groupedIncidents.map((group, index) => (
                    <div
                        key={index}
                        onClick={() => setSelectedGroup(group)}
                        className="p-3 border rounded-xl cursor-pointer hover:bg-blue-50 transition text-blue-900 font-semibold"
                    >
                        {group.incidentName}
                    </div>
                ))}
            </div>

            {selectedGroup && (
                <Dialog open={true} onOpenChange={() => setSelectedGroup(null)}>
                    <DialogContent className="rounded-2xl max-w-2xl">
                        <DialogTitle className="text-blue-900 text-2xl mb-4">
                            {selectedGroup.incidentName}
                        </DialogTitle>

                        <div className="space-y-4 text-blue-900 max-h-[400px] overflow-y-auto">
                            {selectedGroup.incidents.map((item: any, index: number) => (
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
    );
}
