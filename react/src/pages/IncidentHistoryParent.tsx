"use client";

import { useEffect, useState } from "react";
import { getIncidentHistoryByGuardian } from "../service/serviceauth";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    return isNaN(date.getTime()) ? "Unknown date" : date.toLocaleString("vi-VN");
};

const IncidentHistoryParent = () => {
    const { user } = useAuth();
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchDate, setSearchDate] = useState(""); // Lọc theo ngày

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Lọc theo ngày xảy ra (occurredAt)
    const filteredIncidents = searchDate
        ? incidents.filter((incident) => {
            const dateOnly = new Date(incident.occurredAt).toISOString().slice(0, 10);
            return dateOnly === searchDate;
        })
        : incidents;

    const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage);
    const currentIncidents = filteredIncidents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        if (!user?.UserId) return;

        getIncidentHistoryByGuardian(user.UserId)
            .then((res) => {
                const sorted = [...res.data].sort(
                    (a, b) =>
                        new Date(b.occurredAt).getTime() -
                        new Date(a.occurredAt).getTime()
                );
                setIncidents(sorted);
            })
            .catch((err) => console.error("Error fetching incident history:", err))
            .finally(() => setLoading(false));
    }, [user?.UserId]);

    useEffect(() => {
        setCurrentPage(1); // Reset về trang 1 nếu chọn ngày mới
    }, [searchDate]);

    return (
        <div>
            <h2 className="text-4xl font-bold text-blue-800 p-10">
                Incident History
            </h2>

            {/* Search by date */}
            <div className="flex justify-end items-center gap-2 px-4 pb-4">
                <label className="text-sm text-gray-600">Search by date:</label>
                <Input
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="max-w-xs"
                />
            </div>

            <div className="rounded-2xl shadow-md mx-auto drop-shadow">
                {filteredIncidents.length === 0 ? (
                    <div className="text-gray-500 italic text-center p-4">
                        No incidents recorded.
                    </div>
                ) : (
                    <table className="w-full border text-sm">
                        <thead className="bg-blue-100 text-blue-800 font-semibold">
                            <tr>
                                <th className="py-2 px-4 text-left">Student</th>
                                <th className="py-2 px-4 text-left">Class</th>
                                <th className="py-2 px-4 text-left">Incident</th>
                                <th className="py-2 px-4 text-left">Handler</th>
                                <th className="py-2 px-4 text-left">Description</th>
                                <th className="py-2 px-4 text-left">Date</th> {/* Sử dụng occurredAt */}
                            </tr>
                        </thead>
                        <tbody>
                            {currentIncidents.map((incident, index) => (
                                <tr key={index} className="border-t hover:bg-blue-50">
                                    <td className="py-2 px-4">{incident.studentName || "-"}</td>
                                    <td className="py-2 px-4">{incident.className || "-"}</td>
                                    <td className="py-2 px-4">{incident.incidentName}</td>
                                    <td className="py-2 px-4">{incident.handledBy}</td>
                                    <td className="py-2 px-4">{incident.description}</td>
                                    <td className="py-2 px-4">
                                        {formatDate(incident.occurredAt)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: totalPages }).map((_, idx) => {
                        const page = idx + 1;
                        return (
                            <Button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                variant={currentPage === page ? "default" : "outline"}
                                className="px-4"
                            >
                                {page}
                            </Button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default IncidentHistoryParent;
