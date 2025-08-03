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

interface GroupedHistory {
    id: number;
    eventType: string;
    eventName: string;
    eventDate: string;
    eventImage?: string;
    classList: string[];
}

const NotificationCreate = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [classes, setClasses] = useState<Class[]>([]);
    const [selectedClassIds, setSelectedClassIds] = useState<number[]>([]);
    const [eventType, setEventType] = useState<string>("Vaccination");
    const [eventName, setEventName] = useState<string>("");
    const [eventDate, setEventDate] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [history, setHistory] = useState<GroupedHistory[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedRows, setExpandedRows] = useState<number[]>([]);
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

    const groupHistory = (data: NotificationHistory[]) => {
        const groupedMap = new Map<string, GroupedHistory>();
        data.forEach((item) => {
            const key = `${item.eventName}-${item.eventType}-${item.eventDate}-${item.eventImage ?? "noimg"}`;
            if (!groupedMap.has(key)) {
                groupedMap.set(key, {
                    id: item.id,
                    eventType: item.eventType,
                    eventName: item.eventName,
                    eventDate: item.eventDate,
                    eventImage: item.eventImage,
                    classList: [item.className],
                });
            } else {
                groupedMap.get(key)!.classList.push(item.className);
            }
        });
        return Array.from(groupedMap.values());
    };

    const fetchHistory = async () => {
        try {
            const res = await apiser.get<NotificationHistory[]>("/HealthNotification/get");
            const sorted = res.data.sort((a, b) => b.id - a.id);
            const grouped = groupHistory(sorted);
            setHistory(grouped);
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
        <div className=" mx-auto p-8 rounded-2xl  space-y-10">
            <h2 className="text-4xl font-bold text-blue-800">Send Health Notification</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                        <select value={eventType} onChange={(e) => setEventType(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-gray-50">
                            <option value="vaccine">Vaccination</option>
                            <option value="healthcheck">Health Check</option>
                        </select>
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
                        <button type="button" onClick={() => setDropdownOpen(!dropdownOpen)} className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-gray-50">
                            {selectedClassIds.length === 0 ? "Choose classes" : `${selectedClassIds.length} class(es) selected`}
                        </button>
                        {dropdownOpen && (
                            <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                {classes.map((cls) => (
                                    <label key={cls.classId} className="flex items-center px-4 py-2 text-sm">
                                        <input type="checkbox" value={cls.classId} checked={selectedClassIds.includes(cls.classId)} onChange={(e) => {
                                            const value = Number(e.target.value);
                                            setSelectedClassIds((prev) => e.target.checked ? [...prev, value] : prev.filter((id) => id !== value));
                                        }} className="mr-2" />
                                        {cls.className}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Event Name</label>
                        <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-gray-50" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
                        <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-gray-50" required />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Illustration Image (optional)</label>
                        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full text-gray-700 bg-white" />
                    </div>
                </div>
                <button type="submit" disabled={loading} className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition ${loading ? "opacity-60 cursor-not-allowed" : ""}`}>
                    {loading ? "Sending..." : "Send Notification"}
                </button>
            </form>
            <hr className="border-gray-200" />
            <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">📜 Sent Notifications History</h3>
                <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-4 py-2">Event</th>
                                <th className="px-4 py-2">Type</th>
                                <th className="px-4 py-2">Date</th>
                                <th className="px-4 py-2">Class</th>
                                <th className="px-4 py-2 text-center">Image</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {currentItems.map((item, idx) => {
                                const isExpanded = expandedRows.includes(idx);
                                return (
                                    <>
                                        <tr key={idx} onClick={() => setExpandedRows((prev) => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx])} className="hover:bg-blue-50 cursor-pointer">
                                            <td className="px-4 py-2 border-t">{item.eventName}</td>
                                            <td className="px-4 py-2 border-t capitalize">{item.eventType}</td>
                                            <td className="px-4 py-2 border-t">{new Date(item.eventDate).toLocaleDateString()}</td>
                                            <td className="px-4 py-2 border-t">{isExpanded ? item.classList.join(", ") : `${item.classList.length} class(es)`}</td>
                                            <td className="px-4 py-2 border-t text-center">
                                                {item.eventImage ? <img src={item.eventImage} alt={item.eventName} className="w-14 h-14 object-cover mx-auto rounded-md shadow" /> : <span className="text-gray-400 italic">No Image</span>}
                                            </td>
                                        </tr>
                                        {isExpanded && (
                                            <tr className="bg-gray-50 text-sm text-gray-600">
                                                <td colSpan={5} className="px-4 py-2 border-t">
                                                    <strong>Sent to:</strong> {item.classList.join(", ")}
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center mt-6 gap-2">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button key={index + 1} onClick={() => setCurrentPage(index + 1)} className={`px-3 py-1 rounded-lg font-medium text-sm transition ${currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}>
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NotificationCreate;
