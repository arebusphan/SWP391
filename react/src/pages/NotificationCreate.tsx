import { useEffect, useState } from "react";
import axios from "axios";

interface Class {
    id: number;
    name: string;
    grade: string;
}

interface NotificationHistory {
    id: number;
    eventType: string;
    eventName: string;
    eventDate: string;
    className: string;
}

const NotificationCreate = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<number>(0);
    const [eventType, setEventType] = useState<string>("vaccine");
    const [eventName, setEventName] = useState<string>("");
    const [eventDate, setEventDate] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [history, setHistory] = useState<NotificationHistory[]>([]);

    const fetchClasses = async () => {
        const res = await axios.get("https://localhost:7195/api/classes");
        setClasses(res.data);
        if (res.data.length > 0) setSelectedClassId(res.data[0].id);
    };

    const fetchHistory = async () => {
        const res = await axios.get("https://localhost:7195/api/notifications");
        setHistory(res.data);
    };

    useEffect(() => {
        fetchClasses();
        fetchHistory();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("eventType", eventType);
            formData.append("eventName", eventName);
            formData.append("eventDate", eventDate);
            formData.append("classId", selectedClassId.toString());
            if (imageFile) formData.append("image", imageFile);

            await axios.post("https://localhost:7195/api/notifications", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert("Đã gửi thông báo!");
            fetchHistory();
        } catch (error) {
            alert("Lỗi gửi thông báo!");
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 mt-8 bg-white rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-blue-800">Gửi Thông Báo Y Tế</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="font-semibold">Loại sự kiện</label>
                        <select
                            value={eventType}
                            onChange={(e) => setEventType(e.target.value)}
                            className="w-full border px-4 py-2 rounded"
                        >
                            <option value="vaccine">Tiêm chủng</option>
                            <option value="healthcheck">Khám sức khỏe</option>
                        </select>
                    </div>

                    <div>
                        <label className="font-semibold">Chọn lớp</label>
                        <select
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(Number(e.target.value))}
                            className="w-full border px-4 py-2 rounded"
                        >
                            {classes.map((cls) => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.name} ({cls.grade})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="font-semibold">Tên sự kiện</label>
                        <input
                            type="text"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            className="w-full border px-4 py-2 rounded"
                            placeholder="Ví dụ: Tiêm vắc xin phòng cúm"
                            required
                        />
                    </div>

                    <div>
                        <label className="font-semibold">Ngày tham gia</label>
                        <input
                            type="date"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            className="w-full border px-4 py-2 rounded"
                            required
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="font-semibold">Ảnh minh hoạ (tùy chọn)</label>
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
                    className="mt-4 w-full bg-blue-700 text-white font-semibold py-3 rounded hover:bg-blue-800"
                >
                    Gửi thông báo
                </button>
            </form>

            <hr className="my-8" />

            <h3 className="text-xl font-bold mb-4">📜 Lịch sử thông báo đã gửi</h3>
            <table className="w-full table-auto border">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 border">Sự kiện</th>
                        <th className="px-4 py-2 border">Loại</th>
                        <th className="px-4 py-2 border">Ngày</th>
                        <th className="px-4 py-2 border">Lớp</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((item) => (
                        <tr key={item.id}>
                            <td className="px-4 py-2 border">{item.eventName}</td>
                            <td className="px-4 py-2 border">{item.eventType}</td>
                            <td className="px-4 py-2 border">{new Date(item.eventDate).toLocaleDateString()}</td>
                            <td className="px-4 py-2 border">{item.className}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default NotificationCreate;
