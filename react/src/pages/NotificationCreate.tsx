import { useEffect, useState } from "react";
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
            const res = await axios.get("https://localhost:7195/api/classes");
            setClasses(res.data);
            if (res.data.length > 0) setSelectedClassIds([res.data[0].classId]);

        } catch (error) {
            console.error("Error loading classes:", error);
            alert("Failed to load class list");
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await axios.get<NotificationHistory[]>("https://localhost:7195/api/notifications");
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

            await axios.post("https://localhost:7195/api/notifications", payload);
            setHistory((prev) => [
                {
                    id: Date.now(), // ID tạm
                    eventType,
                    eventName,
                    eventDate,
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
        <div className="max-w-5xl mx-auto p-6 mt-8 bg-white rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-blue-800">Send Health Notification</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="font-semibold">Event Type</label>
                        <select value={eventType} onChange={(e) => setEventType(e.target.value)} className="w-full border px-4 py-2 rounded">
                            <option value="vaccine">Vaccination</option>
                            <option value="healthcheck">Health Check</option>
                        </select>
                    </div>
                    <div className="relative dropdown-wrapper">
                        <label className="font-semibold">Select Class</label>

                        <button
                            type="button"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="w-full border px-4 py-2 rounded text-left bg-white"
                        >
                            {selectedClassIds.length === 0
                                ? "Choose classes"
                                : `${selectedClassIds.length} class${selectedClassIds.length > 1 ? "es" : ""} selected`}
                        </button>

                        {dropdownOpen && (
                            <div className="absolute z-10 w-full mt-1 max-h-48 overflow-y-auto bg-white border rounded shadow-md">
                                {classes.map((cls) => (
                                    <label key={cls.classId} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
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



                    <div>
                        <label className="font-semibold">Event Name</label>
                        <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} className="w-full border px-4 py-2 rounded" required />
                    </div>

                    <div>
                        <label className="font-semibold">Event Date</label>
                        <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full border px-4 py-2 rounded" required />
                    </div>

                    <div className="col-span-2">
                        <label className="font-semibold">Illustration Image (optional)</label>
                        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full" />
                    </div>
                </div>

                <button type="submit" disabled={loading} className={`mt-4 w-full bg-blue-700 text-white font-semibold py-3 rounded hover:bg-blue-800 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}>
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
                    {currentItems.map((item) => (
                        <tr key={item.id}>
                            <td className="px-4 py-2 border">{item.eventName}</td>
                            <td className="px-4 py-2 border">{item.eventType}</td>
                            <td className="px-4 py-2 border">{new Date(item.eventDate).toLocaleDateString()}</td>
                            <td className="px-4 py-2 border">{item.className}</td>
                            <td className="px-4 py-2 border">
                                {item.eventImage ? (
                                    <img src={item.eventImage} alt={item.eventName} className="w-20 h-20 object-cover rounded" />
                                ) : (
                                    <span>No Image</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-center mt-4 gap-2">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-3 py-1 rounded ${currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default NotificationCreate;