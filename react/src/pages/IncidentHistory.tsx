"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { GetIncidentHistory } from "../service/serviceauth";

interface Props {
    refresh: boolean;
    onRefreshed: () => void;
}

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
        .map(([incidentName, incidents]) => {
            const uniqueStudents = new Set(incidents.map(i => i.studentId || i.studentName));
            return {
                incidentName,
                incidents,
                latestTime: Math.max(...incidents.map(i => new Date(i.createdAt).getTime())),
                studentCount: uniqueStudents.size,
            };
        })
        .sort((a, b) => b.latestTime - a.latestTime);
}

function filterByDate(incidents: any[], from: string, to: string) {
    const fromTime = from ? new Date(from).getTime() : 0;
    const toTime = to ? new Date(to + "T23:59:59").getTime() : Infinity;
    return incidents.filter((i) => {
        const createdAt = new Date(i.createdAt).getTime();
        return createdAt >= fromTime && createdAt <= toTime;
    });
}

export default function IncidentHistoryGroup({ refresh, onRefreshed }: Props) {
    const [incidents, setIncidents] = useState<any[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<any | null>(null);

    const [currentGroupPage, setCurrentGroupPage] = useState(1);
    const groupsPerPage = 5;

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const [studentFilter, setStudentFilter] = useState("");
    const [classFilter, setClassFilter] = useState("");

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

    const filteredIncidents = filterByDate(incidents, startDate, endDate);
    const groupedIncidents = groupIncidentsByEvent(filteredIncidents);

    const totalGroupPages = Math.ceil(groupedIncidents.length / groupsPerPage);
    const paginatedGroups = groupedIncidents.slice(
        (currentGroupPage - 1) * groupsPerPage,
        currentGroupPage * groupsPerPage
    );

    const dialogFiltered = selectedGroup
        ? selectedGroup.incidents.filter(
            (i: any) =>
                i.studentName.toLowerCase().includes(studentFilter.toLowerCase()) &&
                i.className.toLowerCase().includes(classFilter.toLowerCase())
        )
        : [];

    const filteredTotalPages = Math.ceil(dialogFiltered.length / itemsPerPage);
    const paginatedFilteredIncidents = dialogFiltered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div>
            <h2 className="text-3xl font-bold text-blue-900 drop-shadow p-10">Incident History</h2>
            <div className="p-6 bg-white rounded-2xl space-y-4 flex flex-col justify-between min-h-120">

                {/* Tìm kiếm theo thời gian */}
                <div className="flex flex-wrap gap-4 items-center pb-4">
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">From:</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border rounded px-2 py-1"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">To:</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border rounded px-2 py-1"
                        />
                    </div>
                </div>

                {groupedIncidents.length === 0 && (
                    <div className="text-gray-500">No incident records available.</div>
                )}

                {/* Tiêu đề bảng */}
                <div className="space-y-1 h-50">
                    <div className="grid grid-cols-3 font-bold text-white bg-blue-900 px-3 py-2 rounded-t-xl">
                        <div>Incident Name</div>
                        <div className="text-center">Student Number</div>
                        <div className="text-right">Latest Time</div>
                    </div>

                    {/* Danh sách nhóm */}
                    {paginatedGroups.map((group, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                setSelectedGroup(group);
                                setCurrentPage(1);
                                setStudentFilter("");
                                setClassFilter("");
                            }}
                            className="grid grid-cols-3 px-3 py-2 border rounded-xl cursor-pointer hover:bg-blue-50 transition text-blue-900"
                        >
                            <div>{group.incidentName}</div>
                            <div className="text-center">{group.studentCount}</div>
                            <div className="text-right">{new Date(group.latestTime).toLocaleString()}</div>
                        </div>
                    ))}
                </div>

                {/* Phân trang danh sách nhóm */}
                {totalGroupPages > 1 && (
                    <div className="flex items-center justify-center pt-4 gap-4">
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

                {/* Dialog chi tiết */}
                {selectedGroup && (
                    <Dialog open={true} onOpenChange={() => setSelectedGroup(null)}>
                        <DialogContent className="rounded-2xl max-w-2xl">
                            <DialogTitle className="text-blue-900 text-2xl mb-4">
                                {selectedGroup.incidentName}
                            </DialogTitle>

                            {/* Tìm kiếm trong dialog */}
                            <div className="flex gap-4 pb-4">
                                <input
                                    type="text"
                                    placeholder="Search by student name"
                                    value={studentFilter}
                                    onChange={(e) => {
                                        setStudentFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="border px-3 py-1 rounded w-1/2"
                                />
                            </div>

                            {/* Danh sách sự cố đã lọc */}
                            <div className="space-y-4 text-blue-900 max-h-[400px] overflow-y-auto">
                                {paginatedFilteredIncidents.map((item: any, index: number) => (
                                    <div key={index} className="p-3 border rounded-xl">
                                        <div><strong>Student:</strong> {item.studentName}</div>
                                        <div><strong>Class:</strong> {item.className}</div>
                                        <div><strong>Description:</strong> {item.description}</div>
                                        <div><strong>Handled By:</strong> {item.handledBy}</div>
                                        <div><strong>Time:</strong> {new Date(item.createdAt).toLocaleString()}</div>
                                    </div>
                                ))}

                                {dialogFiltered.length === 0 && (
                                    <div className="text-gray-500">No matching records.</div>
                                )}
                            </div>

                            {/* Phân trang trong dialog */}
                            {filteredTotalPages > 1 && (
                                <div className="flex justify-between items-center pt-4">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                        className="px-4 py-1 rounded-xl border hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-sm text-gray-700">
                                        Page {currentPage} of {filteredTotalPages}
                                    </span>
                                    <button
                                        disabled={currentPage === filteredTotalPages}
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
