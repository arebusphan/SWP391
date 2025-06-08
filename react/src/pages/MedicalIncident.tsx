import React, { useEffect, useState } from "react";
import axios from "axios";

type HealthEventDto = {
    eventId?: number;
    studentId: number;
    eventType: string;
    description: string;
    execution: string;
    date: string;
};

const API_BASE = "/api/HealthEvent";

const MedicalIncident: React.FC = () => {
    const [events, setEvents] = useState<HealthEventDto[]>([]);
    const [form, setForm] = useState<HealthEventDto>({
        studentId: 0,
        eventType: "",
        description: "",
        execution: "",
        date: "",
    });

    const fetchEvents = async () => {
        try {
            const res = await axios.get(`${API_BASE}/all`);
            setEvents(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Lỗi tải danh sách:", err);
            setEvents([]);
        }
    };

    const handleSubmit = async () => {
        const payload = {
            studentId: form.studentId,
            eventType: form.eventType,
            description: form.description,
            execution: form.execution,
            eventDate: form.date,
        };

        try {
            if (form.eventId) {
                await axios.put(`${API_BASE}/${form.eventId}`, { ...payload, eventId: form.eventId });
            } else {
                await axios.post(API_BASE, payload);
            }

            alert("Lưu thành công!");
            setForm({
                studentId: 0,
                eventType: "",
                description: "",
                execution: "",
                date: "",
            });
            fetchEvents();
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.error("Lỗi khi lưu:", err.response?.data);
                alert(err.response?.data || "Đã xảy ra lỗi khi lưu.");
            } else {
                console.error("Lỗi không xác định:", err);
                alert("Lỗi không xác định khi lưu.");
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
            date: e.date?.slice(0, 10),
        });
    };

    const handleDelete = async (id?: number) => {
        if (!id) return;
        if (!confirm("Bạn có chắc chắn muốn xoá?")) return;

        try {
            await axios.delete(`${API_BASE}/${id}`);
            fetchEvents();
        } catch (err) {
            console.error("Xoá thất bại:", err);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Medical Incidents</h2>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
                <input
                    type="number"
                    placeholder="Student ID"
                    className="border border-gray-300 rounded p-2"
                    value={form.studentId}
                    onChange={(e) => setForm({ ...form, studentId: Number(e.target.value) })}
                />
                <input
                    type="text"
                    placeholder="Event Type"
                    className="border border-gray-300 rounded p-2"
                    value={form.eventType}
                    onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Description"
                    className="border border-gray-300 rounded p-2"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Execution"
                    className="border border-gray-300 rounded p-2"
                    value={form.execution}
                    onChange={(e) => setForm({ ...form, execution: e.target.value })}
                />
                <input
                    type="date"
                    className="border border-gray-300 rounded p-2"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white rounded px-4 py-2"
                >
                    Save
                </button>
            </div>

            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2">Student ID</th>
                        <th className="border px-4 py-2">Event Type</th>
                        <th className="border px-4 py-2">Description</th>
                        <th className="border px-4 py-2">Execution</th>
                        <th className="border px-4 py-2">Date</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((e) => (
                        <tr key={e.eventId}>
                            <td className="border px-4 py-2">{e.studentId}</td>
                            <td className="border px-4 py-2">{e.eventType}</td>
                            <td className="border px-4 py-2">{e.description}</td>
                            <td className="border px-4 py-2">{e.execution}</td>
                            <td className="border px-4 py-2">{e.date?.slice(0, 10)}</td>
                            <td className="border px-4 py-2">
                                <button onClick={() => handleEdit(e)} className="mr-2 text-blue-500">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(e.eventId)} className="text-red-500">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MedicalIncident;
