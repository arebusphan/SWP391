import { useEffect, useState } from "react";
import { getNotifications } from "@/service/serviceauth";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EventNotification {
    id: number;
    eventName: string;
    eventType: string;
    eventDate: string;
    className: string;
    eventImage: string;
}

export default function NotificationPage() {
    const [notifications, setNotifications] = useState<EventNotification[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selected, setSelected] = useState<EventNotification | null>(null);
    const itemsPerPage = 6;

    useEffect(() => {
        getNotifications()
            .then((res) => setNotifications(res.data))
            .catch((err) => console.error("Error loading notifications:", err));
    }, []);

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = notifications.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(notifications.length / itemsPerPage);

    const getPaginationRange = () => {
        const maxPagesToShow = 5;
        let start = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let end = start + maxPagesToShow - 1;
        if (end > totalPages) {
            end = totalPages;
            start = Math.max(1, end - maxPagesToShow + 1);
        }
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center text-blue-500">All Notifications</h1>

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <p className="text-gray-500">No notifications found.</p>
                ) : (
                    currentItems.map((note) => (
                        <div
                            key={note.id}
                            className="border rounded-md shadow-sm bg-white p-4 hover:shadow-md transition"
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                    <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded">
                                        {note.eventType}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {new Date(note.eventDate).toLocaleString()}
                                    </span>
                                </div>

                                <button
                                    onClick={() => setSelected(note)}
                                    className="text-blue-600 text-sm hover:underline"
                                >
                                    View
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>

                    {getPaginationRange().map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded ${currentPage === page
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 hover:bg-gray-300"
                                }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Dialog hiển thị thông tin chi tiết */}
            <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
                <DialogContent className="max-w-md sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Notification Details</DialogTitle>
                    </DialogHeader>

                    {selected && (
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded">
                                    {selected.eventType}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {new Date(selected.eventDate).toLocaleString()}
                                </span>
                            </div>

                            <p className="text-lg font-semibold">{selected.eventName}</p>
                            <p className="text-sm text-gray-700">Class: {selected.className}</p>

                            {selected.eventImage && (
                                <img
                                    src={selected.eventImage}
                                    alt="Event"
                                    className="mt-2 w-full max-h-60 object-contain rounded"
                                />
                            )}
                        </div>
                    )}

                    <DialogFooter>
                        <Button onClick={() => setSelected(null)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
