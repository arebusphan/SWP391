import React, { useEffect, useState } from "react";
import axios from "axios";

type HealthEventDto = {
    eventId?: number;
    studentId: number;
    eventType: string;
    description: string;
    execution: string;
    eventDate: string;
    supplyId?: number;
    quantityUsed?: number;
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
            console.error("Failed to fetch events:", err);
            setMessage({ type: "error", text: "Failed to load medical incidents." });
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
            console.error("Search error:", err);
            setMessage({ type: "error", text: "Could not search by Student ID." });
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
            setMessage({ type: "error", text: "Please fill in all required fields." });
            return;
        }

        const payload = {
            studentId: form.studentId,
            eventType: form.eventType,
            description: form.description,
            execution: form.execution,
            eventDate: new Date(form.eventDate).toISOString(),
            supplyId: form.supplyId,
            quantityUsed: form.quantityUsed,
        };

        try {
            if (form.eventId) {
                await axios.put(`${API_BASE}/${form.eventId}`, { ...payload, eventId: form.eventId });
                setMessage({ type: "success", text: "Incident updated successfully." });
            } else {
                await axios.post(API_BASE, payload);
                setMessage({ type: "success", text: "New incident created successfully." });
            }

            setForm({
                studentId: 0,
                eventType: "",
                description: "",
                execution: "",
                eventDate: "",
                supplyId: undefined,
                quantityUsed: undefined,
            });
            setShowForm(false);
            fetchEvents();
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.error("Save error:", err.response?.data);
                setMessage({ type: "error", text: err.response?.data || "An error occurred while saving." });
            } else {
                console.error("Unknown error:", err);
                setMessage({ type: "error", text: "Unknown error occurred." });
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
            supplyId: e.supplyId,
            quantityUsed: e.quantityUsed,
        });
        setShowForm(true);
    };

    const handleDelete = async (id?: number) => {
        if (!id) return;
        if (!confirm("Are you sure you want to delete this incident?")) return;

        try {
            await axios.delete(`${API_BASE}/${id}`);
            setMessage({ type: "success", text: "Incident deleted successfully." });
            fetchEvents();
        } catch (err) {
            console.error("Delete error:", err);
            setMessage({ type: "error", text: "Failed to delete incident." });
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Medical Incidents</h2>

            {message && (
                <div className={`mb-4 p-3 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {message.text}
                </div>
            )}

            {/* Search */}
            <div className="flex gap-4 mb-6 items-center">
                <input
                    type="number"
                    placeholder="Search by Student ID"
                    className="border border-gray-300 rounded p-2"
                    value={searchStudentId}
                    onChange={(e) => setSearchStudentId(e.target.value === "" ? "" : Number(e.target.value))}
                />
                <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Search
                </button>
                <button
                    onClick={() => {
                        setSearchStudentId("");
                        fetchEvents();
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Reset
                </button>
            </div>

            {/* Create Button */}
            <button
                onClick={() => {
                    setForm({
                        studentId: 0,
                        eventType: "",
                        description: "",
                        execution: "",
                        eventDate: "",
                        supplyId: undefined,
                        quantityUsed: undefined,
                    });
                    setShowForm(true);
                }}
                className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
                + Create New
            </button>

            {/* Form */}
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
                        value={form.eventDate}
                        onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Supply ID"
                        className="border border-gray-300 rounded p-2"
                        value={form.supplyId}
                        onChange={(e) => setForm({ ...form, supplyId: Number(e.target.value) })}
                    />
                    <input
                        type="number"
                        placeholder="Quantity Used"
                        className="border border-gray-300 rounded p-2"
                        value={form.quantityUsed}
                        onChange={(e) => setForm({ ...form, quantityUsed: Number(e.target.value) })}
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleSubmit}
                            className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700"
                        >
                            {form.eventId ? "Update" : "Save"}
                        </button>
                        <button
                            onClick={() => setShowForm(false)}
                            className="bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            {loading ? (
                <p>Loading data...</p>
            ) : (
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">Student ID</th>
                            <th className="border px-4 py-2">Type</th>
                            <th className="border px-4 py-2">Description</th>
                            <th className="border px-4 py-2">Execution</th>
                            <th className="border px-4 py-2">Date</th>
                            <th className="border px-4 py-2">Supply ID</th>
                            <th className="border px-4 py-2">Quantity Used</th>
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
                                <td className="border px-4 py-2">
                                    {e.eventDate ? new Date(e.eventDate).toLocaleDateString("en-GB") : ""}
                                </td>
                                <td className="border px-4 py-2">{e.supplyId}</td>
                                <td className="border px-4 py-2">{e.quantityUsed}</td>
                                <td className="border px-4 py-2">
                                    <button onClick={() => handleEdit(e)} className="mr-2 text-blue-500 hover:underline">Edit</button>
                                    <button onClick={() => handleDelete(e.eventId)} className="text-red-500 hover:underline">Delete</button>
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
