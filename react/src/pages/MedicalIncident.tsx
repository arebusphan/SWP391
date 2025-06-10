import React, { useEffect, useState } from "react";
import axios from "axios";

type HealthEventDto = {
    eventId?: number;
    studentId: number;
    eventType: string;
    description: string;
    execution: string;
    eventDate: string; // yyyy-mm-dd
};

const API_BASE = "/api/HealthEvent";

const MedicalIncident: React.FC = () => {
    const [events, setEvents] = useState<HealthEventDto[]>([]);
    const [form, setForm] = useState<HealthEventDto>({
        studentId: 0,
        eventType: "",
        description: "",
        execution: "",
        eventDate: "",
    });
    const [showForm, setShowForm] = useState(false);
    const [searchStudentId, setSearchStudentId] = useState<number | "">("");
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/all`);
            setEvents(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Lỗi tải danh sách:", err);
            setMessage({ type: "error", text: "Không thể tải danh sách sự kiện y tế." });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (searchStudentId === "") {
            fetchEvents();
            return;
        }
        try {
            const res = await axios.get(`${API_BASE}/student/${searchStudentId}`);
            setEvents(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Lỗi tìm kiếm:", err);
            setMessage({ type: "error", text: "Không thể tìm kiếm theo mã học sinh." });
        }
    };

    const handleSubmit = async () => {
        if (
            !form.studentId ||
            !form.eventType.trim() ||
            !form.description.trim() ||
            !form.execution.trim() ||
            !form.eventDate
        ) {
            setMessage({ type: "error", text: "Vui lòng nhập đầy đủ thông tin." });
            return;
        }

        const payload = {
            studentId: form.studentId,
            eventType: form.eventType,
            description: form.description,
            execution: form.execution,
            eventDate: new Date(form.eventDate).toISOString(),
        };

        try {
            if (form.eventId) {
                await axios.put(`${API_BASE}/${form.eventId}`, { ...payload, eventId: form.eventId });
                setMessage({ type: "success", text: "Cập nhật thành công." });
            } else {
                await axios.post(API_BASE, payload);
                setMessage({ type: "success", text: "Tạo mới sự kiện thành công." });
            }

            setForm({
                studentId: 0,
                eventType: "",
                description: "",
                execution: "",
                eventDate: "",
            });
            setShowForm(false);
            fetchEvents();
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.error("Lỗi khi lưu:", err.response?.data);
                setMessage({ type: "error", text: err.response?.data || "Đã xảy ra lỗi khi lưu." });
            } else {
                console.error("Lỗi không xác định:", err);
                setMessage({ type: "error", text: "Lỗi không xác định khi lưu." });
            }
        }
    };

    const handleEdit = (e: HealthEventDto) => {
        setForm({
            eventId: e.eventId,
            studentId: e.studentId,
            eventType: e.eventType,
            description: e.description,
            execution: e.execution,
            eventDate: e.eventDate?.slice(0, 10),
        });
        setShowForm(true);
    };

    const handleDelete = async (id?: number) => {
        if (!id) return;
        if (!confirm("Bạn có chắc chắn muốn xoá?")) return;

        try {
            await axios.delete(`${API_BASE}/${id}`);
            setMessage({ type: "success", text: "Xoá thành công." });
            fetchEvents();
        } catch (err) {
            console.error("Xoá thất bại:", err);
            setMessage({ type: "error", text: "Không thể xoá sự kiện." });
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Sự kiện Y tế</h2>

            {message && (
                <div className={`mb-4 p-3 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {message.text}
                </div>
            )}

            {/* Tìm kiếm */}
            <div className="flex gap-4 mb-6 items-center">
                <input
                    type="number"
                    placeholder="Tìm theo Student ID"
                    className="border border-gray-300 rounded p-2"
                    value={searchStudentId}
                    onChange={(e) => setSearchStudentId(e.target.value === "" ? "" : Number(e.target.value))}
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Tìm kiếm
                </button>
                <button
                    onClick={() => {
                        setSearchStudentId("");
                        fetchEvents();
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Đặt lại
                </button>
            </div>

            {/* Nút tạo mới */}
            <button
                onClick={() => {
                    setForm({
                        studentId: 0,
                        eventType: "",
                        description: "",
                        execution: "",
                        eventDate: "",
                    });
                    setShowForm(true);
                }}
                className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
                + Tạo mới
            </button>

            {/* Form nhập liệu */}
            {showForm && (
                <div className="grid md:grid-cols-3 gap-4 mb-6 border p-4 rounded bg-gray-50">
                    <input
                        type="number"
                        placeholder="Student ID"
                        className="border border-gray-300 rounded p-2"
                        value={form.studentId}
                        onChange={(e) => setForm({ ...form, studentId: Number(e.target.value) })}
                    />
                    <input
                        type="text"
                        placeholder="Loại sự kiện"
                        className="border border-gray-300 rounded p-2"
                        value={form.eventType}
                        onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Mô tả"
                        className="border border-gray-300 rounded p-2"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Cách xử lý"
                        className="border border-gray-300 rounded p-2"
                        value={form.execution}
                        onChange={(e) => setForm({ ...form, execution: e.target.value })}
                    />
                    <input
                        type="date"
                        className="border border-gray-300 rounded p-2"
                        value={form.eventDate}
                        onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleSubmit}
                            className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700"
                        >
                            {form.eventId ? "Cập nhật" : "Lưu mới"}
                        </button>
                        <button
                            onClick={() => setShowForm(false)}
                            className="bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600"
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            )}

            {/* Danh sách */}
            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : (
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">Student ID</th>
                            <th className="border px-4 py-2">Loại</th>
                            <th className="border px-4 py-2">Mô tả</th>
                            <th className="border px-4 py-2">Xử lý</th>
                            <th className="border px-4 py-2">Ngày</th>
                            <th className="border px-4 py-2">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((e) => (
                            <tr key={e.eventId}>
                                <td className="border px-4 py-2">{e.studentId}</td>
                                <td className="border px-4 py-2">{e.eventType}</td>
                                <td className="border px-4 py-2">{e.description}</td>
                                <td className="border px-4 py-2">{e.execution}</td>
                                <td className="border px-4 py-2">
                                    {e.eventDate ? new Date(e.eventDate).toLocaleDateString("vi-VN") : ""}
                                </td>
                                <td className="border px-4 py-2">
                                    <button onClick={() => handleEdit(e)} className="mr-2 text-blue-500 hover:underline">Sửa</button>
                                    <button onClick={() => handleDelete(e.eventId)} className="text-red-500 hover:underline">Xoá</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MedicalIncident;
