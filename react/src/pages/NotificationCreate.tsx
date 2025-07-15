import { useEffect, useState } from "react";

import { apiser } from "../service/apiser";

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
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [classes, setClasses] = useState<Class[]>([]);
    const [selectedClassIds, setSelectedClassIds] = useState<number[]>([]);
    const [eventType, setEventType] = useState<string>("Vaccination");
    const [eventName, setEventName] = useState<string>("");
    const [eventDate, setEventDate] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [history, setHistory] = useState<NotificationHistory[]>([]);
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchClasses();
        fetchHistory();
    }, []);

    const fetchClasses = async () => {
        try {
            const res = await apiser.get("/classes");
            setClasses(res.data);
            if (res.data.length > 0) setSelectedClassIds([res.data[0].classId]);

        } catch (error) {
            console.error("Error loading classes:", error);
            alert("Failed to load class list");
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await apiser.get<NotificationHistory[]>("/HealthNotification/get");
            const sorted = res.data.sort((a, b) => b.id - a.id);

            setHistory(sorted);
            setCurrentPage(1);
        } catch (error) {
            console.error("Error loading history:", error);
            alert("Failed to load notification history");
        }
    };

    const uploadToCloudinary = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "school_upload");
        const response = await fetch("https://api.cloudinary.com/v1_1/dmgaexsik/image/upload", {
            method: "POST",
            body: formData,
        });

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
                classIds: selectedClassIds,
                eventImage: imageUrl || null,
            };

            await apiser.post("/HealthNotification/post", payload);
            setHistory((prev) => [
                {
                    id: Date.now(), // ID tạm
                    eventType,
                    eventName,
                    eventDate: new Date(eventDate).toISOString(),
                    className: selectedClassIds
                        .map((id) => {
                            const found = classes.find((cls) => cls.classId === id);
                            return found ? found.className : `Class ${id}`;
                        })
                        .join(", "),
                    eventImage: imageUrl || undefined,
                },
                ...prev,
            ]);
            setCurrentPage(1);

            alert("Notification sent!");
            fetchHistory();

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

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = history.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(history.length / itemsPerPage);

    return (
        <div className=" mx-auto  ">
            {/* Header */}
            <h2 className="text-4xl p-10 font-bold text-blue-900 ">Send Health Notification</h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Event Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                        <select
                            value={eventType}
                            onChange={(e) => setEventType(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:ring-blue-300 focus:border-blue-400 bg-gray-50"
                        >
                            <option value="vaccine">Vaccination</option>
                            <option value="healthcheck">Health Check</option>
                        </select>
                    </div>

                    {/* Class Selector */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
                        <button
                            type="button"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-left shadow-sm bg-gray-50"
                        >
                            {selectedClassIds.length === 0
                                ? "Choose classes"
                                : `${selectedClassIds.length} class${selectedClassIds.length > 1 ? "es" : ""} selected`}
                        </button>

                        {dropdownOpen && (
                            <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                {classes.map((cls) => (
                                    <label
                                        key={cls.classId}
                                        className="flex items-center px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                                    >
                                        <input
                                            type="checkbox"
                                            value={cls.classId}
                                            checked={selectedClassIds.includes(cls.classId)}
                                            onChange={(e) => {
                                                const value = Number(e.target.value);
                                                setSelectedClassIds((prev) =>
                                                    e.target.checked
                                                        ? [...prev, value]
                                                        : prev.filter((id) => id !== value)
                                                );
                                            }}
                                            className="mr-2"
                                        />
                                        {cls.className}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Event Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Event Name</label>
                        <input
                            type="text"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:ring-blue-300 bg-gray-50"
                            required
                        />
                    </div>

                    {/* Event Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
                        <input
                            type="date"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:ring-blue-300 bg-gray-50"
                            required
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Illustration Image (optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                            className="w-full text-gray-700 bg-white"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition ${loading ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                >
                    {loading ? "Sending..." : "Send Notification"}
                </button>
            </form>

            <hr className="border-gray-200" />

            {/* History */}
            <div>
                <h3 className="text-2xl font-bold text-blue-800 p-10">Sent Notifications History</h3>

                <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-blue-100 text-blue-900">
                            <tr>
                                <th className="px-4 py-2">Event</th>
                                <th className="px-4 py-2">Type</th>
                                <th className="px-4 py-2">Date</th>
                                <th className="px-4 py-2">Class</th>
                                <th className="px-4 py-2 text-center">Image</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {currentItems.map((item) => (
                                <tr key={item.id} className="hover:bg-blue-50 transition">
                                    <td className="px-4 py-2 border-t">{item.eventName}</td>
                                    <td className="px-4 py-2 border-t capitalize">{item.eventType}</td>
                                    <td className="px-4 py-2 border-t">{new Date(item.eventDate).toLocaleDateString()}</td>
                                    <td className="px-4 py-2 border-t">{item.className}</td>
                                    <td className="px-4 py-2 border-t text-center">
                                        {item.eventImage ? (
                                            <img
                                                src={item.eventImage}
                                                alt={item.eventName}
                                                className="w-14 h-14 object-cover mx-auto rounded-md shadow"
                                            />
                                        ) : (
                                            <span className="text-gray-400 italic">No Image</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-6 gap-2">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`px-3 py-1 rounded-lg font-medium text-sm transition ${currentPage === index + 1
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>


    );
};

export default NotificationCreate;