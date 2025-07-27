import { useEffect, useState } from "react";
import { getNotifications } from "@/service/serviceauth";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface EventNotification {
    id: number;
    eventName: string;
    eventType: string;
    eventDate: string;
    className: string;
    eventImage: string;
}

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleString("vi-VN");
};

export default function NotificationPage() {
    const [notifications, setNotifications] = useState<EventNotification[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const itemsPerPage = 6;

    useEffect(() => {
        getNotifications()
            .then((res) => setNotifications(res.data))
            .catch((err) => console.error("Error loading notifications:", err));
    }, []);

    const totalPages = Math.ceil(notifications.length / itemsPerPage);
    const currentItems = notifications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className=" mx-auto ">
            <h1 className="text-4xl font-bold  text-blue-900  p-10">
                Event Notifications
            </h1>

            <div className="rounded-2xl ">
                {notifications.length === 0 ? (
                    <div className="text-gray-500 italic text-center">
                        No notifications found.
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-300">
                            <table className="w-full text-sm text-center">
                                <thead className="bg-blue-900 text-white">
                                    <tr>
                                        <th className="border px-3 py-2">#</th>
                                        <th className="border px-3 py-2">Event Name</th>
                                        <th className="border px-3 py-2">Event Type</th>
                                        <th className="border px-3 py-2">Date</th>
                                        <th className="border px-3 py-2">Class</th>
                                        <th className="border px-3 py-2">Image</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((note, index) => (
                                        <tr
                                            key={note.id}
                                            className="hover:bg-blue-50 transition border-b text-gray-800"
                                        >
                                            <td className="border px-3 py-2">
                                                {(currentPage - 1) * itemsPerPage + index + 1}
                                            </td>
                                            <td className="border px-3 py-2">{note.eventName}</td>
                                            <td className="border px-3 py-2">{note.eventType}</td>
                                            <td className="border px-3 py-2">{formatDate(note.eventDate)}</td>
                                            <td className="border px-3 py-2">{note.className || "N/A"}</td>
                                            <td className="border px-3 py-2">
                                                {note.eventImage ? (
                                                    <img
                                                        src={note.eventImage}
                                                        alt="event"
                                                        className="h-16 object-contain rounded mx-auto cursor-pointer hover:opacity-80 transition"
                                                        onClick={() => setSelectedImage(note.eventImage)}
                                                    />
                                                ) : (
                                                    <span className="text-gray-400 italic">No image</span>
                                                )}
                                            </td>
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
                                Page {currentPage} / {totalPages}
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

            {/* Dialog xem ảnh lớn */}
            <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Preview Image</DialogTitle>
                    </DialogHeader>
                    {selectedImage && (
                        <img
                            src={selectedImage}
                            alt="Preview"
                            className="w-full h-auto rounded-lg shadow"
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
