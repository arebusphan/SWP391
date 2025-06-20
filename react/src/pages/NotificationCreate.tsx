﻿import { useEffect, useState } from "react";
import axios from "axios";

interface Class {
    classId: number;
    className: string;
}

interface NotificationHistory {
    id: number;
    eventType: string;
    eventName: string;
    eventDate: string;
    className: string;
    eventImage?: string;
}

const NotificationCreate = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<number>(0);
    const [eventType, setEventType] = useState<string>("Vaccination");
    const [eventName, setEventName] = useState<string>("");
    const [eventDate, setEventDate] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [history, setHistory] = useState<NotificationHistory[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchClasses();
        fetchHistory();
    }, []);

    const fetchClasses = async () => {
        try {
            const res = await axios.get("https://localhost:7195/api/classes");
            setClasses(res.data);
            if (res.data.length > 0) setSelectedClassId(res.data[0].classId);
        } catch (error) {
            console.error("Error loading classes:", error);
            alert("Failed to load class list");
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await axios.get("https://localhost:7195/api/notifications");
            setHistory(res.data);
        } catch (error) {
            console.error("Error loading history:", error);
            alert("Failed to load notification history");
        }
    };

    const uploadToCloudinary = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "school_upload"); // your Cloudinary preset
        const response = await fetch(
            "https://api.cloudinary.com/v1_1/dmgaexsik/image/upload",
            {
                method: "POST",
                body: formData,
            }
        );

        if (!response.ok) throw new Error("Upload failed");
        const data = await response.json();
        return data.secure_url;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = "";

            if (imageFile) {
                imageUrl = await uploadToCloudinary(imageFile);
            }

            const payload = {
                eventName,
                eventType,
                eventDate,
                createdBy: "admin",
                classIds: [selectedClassId],
                eventImage: imageUrl || null,
            };

            await axios.post("https://localhost:7195/api/notifications", payload);
            alert("Notification sent!");
            fetchHistory();

            // Reset form
            setEventName("");
            setEventDate("");
            setImageFile(null);
        } catch (error) {
            alert("Failed to send notification!");
            console.error("Submit error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 mt-8 bg-white rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-blue-800">Send Health Notification</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="font-semibold">Event Type</label>
                        <select
                            value={eventType}
                            onChange={(e) => setEventType(e.target.value)}
                            className="w-full border px-4 py-2 rounded"
                        >
                            <option value="vaccine">Vaccination</option>
                            <option value="healthcheck">Health Check</option>
                        </select>
                    </div>

                    <div>
                        <label className="font-semibold">Select Class</label>
                        <select
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(Number(e.target.value))}
                            className="w-full border px-4 py-2 rounded"
                        >
                            <option key="default" value="">
                                -- Select Class --
                            </option>
                            {classes.map((cls) => (
                                <option key={cls.classId} value={cls.classId}>
                                    {cls.className}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="font-semibold">Event Name</label>
                        <input
                            type="text"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            className="w-full border px-4 py-2 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="font-semibold">Event Date</label>
                        <input
                            type="date"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            className="w-full border px-4 py-2 rounded"
                            required
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="font-semibold">Illustration Image (optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                            className="w-full"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`mt-4 w-full bg-blue-700 text-white font-semibold py-3 rounded hover:bg-blue-800 ${loading ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                >
                    {loading ? "Sending..." : "Send Notification"}
                </button>
            </form>

            <hr className="my-8" />

            <h3 className="text-xl font-bold mb-4">📜 Sent Notifications History</h3>
            <table className="w-full table-auto border">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 border">Event</th>
                        <th className="px-4 py-2 border">Type</th>
                        <th className="px-4 py-2 border">Date</th>
                        <th className="px-4 py-2 border">Class</th>
                        <th className="px-4 py-2 border">Illustration Image</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((item) => (
                        <tr key={item.id}>
                            <td className="px-4 py-2 border">{item.eventName}</td>
                            <td className="px-4 py-2 border">{item.eventType}</td>
                            <td className="px-4 py-2 border">{new Date(item.eventDate).toLocaleDateString()}</td>
                            <td className="px-4 py-2 border">{item.className}</td>
                            <td className="px-4 py-2 border">
                                {item.eventImage ? (
                                    <img
                                        src={item.eventImage}
                                        alt={item.eventName}
                                        className="w-20 h-20 object-cover rounded"
                                    />
                                ) : (
                                    <span>No Image</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default NotificationCreate;
