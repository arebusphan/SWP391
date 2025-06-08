import React, { useEffect, useState } from "react";
import axios from "axios";

type HealthEventSupplyDTO = {
    eventSupplyId?: number;
    eventId: number;
    supplyId: number;
    quantityUsed: number;
};

const API_BASE = "/api/HealthEventSupplies";

const MaterialManagement: React.FC = () => {
    const [supplies, setSupplies] = useState<HealthEventSupplyDTO[]>([]);
    const [form, setForm] = useState<HealthEventSupplyDTO>({
        eventId: 0,
        supplyId: 0,
        quantityUsed: 1,
    });

    const fetchSupplies = async () => {
        try {
            const res = await axios.get(`${API_BASE}/Get_All`);
            setSupplies(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Lỗi tải dữ liệu:", err);
            setSupplies([]);
        }
    };

    const handleSubmit = async () => {
        try {
            if (form.eventSupplyId) {
                await axios.put(`${API_BASE}/Update`, form);
            } else {
                await axios.post(`${API_BASE}`, form);
            }
            setForm({ eventId: 0, supplyId: 0, quantityUsed: 1 });
            fetchSupplies();
        } catch (err) {
            console.error("Lỗi khi lưu:", err);
        }
    };

    const handleEdit = (item: HealthEventSupplyDTO) => {
        setForm({ ...item });
    };

    const handleDelete = async (id?: number) => {
        if (!id) return;
        try {
            await axios.put(`${API_BASE}/Delete`, { eventSupplyId: id });
            fetchSupplies();
        } catch (err) {
            console.error("Xoá thất bại:", err);
        }
    };

    useEffect(() => {
        fetchSupplies();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Material Management</h2>

            <div className="grid md:grid-cols-4 gap-4 mb-6">
                <input
                    type="number"
                    placeholder="Event ID"
                    className="border border-gray-300 rounded p-2"
                    value={form.eventId}
                    onChange={(e) => setForm({ ...form, eventId: Number(e.target.value) })}
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
                <button onClick={handleSubmit} className="bg-green-600 text-white rounded px-4 py-2">Save</button>
            </div>

            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2">Event ID</th>
                        <th className="border px-4 py-2">Supply ID</th>
                        <th className="border px-4 py-2">Quantity Used</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {supplies.map((item) => (
                        <tr key={item.eventSupplyId}>
                            <td className="border px-4 py-2">{item.eventId}</td>
                            <td className="border px-4 py-2">{item.supplyId}</td>
                            <td className="border px-4 py-2">{item.quantityUsed}</td>
                            <td className="border px-4 py-2">
                                <button onClick={() => handleEdit(item)} className="mr-2 text-blue-500">Edit</button>
                                <button onClick={() => handleDelete(item.eventSupplyId)} className="text-red-500">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MaterialManagement;
