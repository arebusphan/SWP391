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
    const [searchEventId, setSearchEventId] = useState<number | "">("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const fetchSupplies = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/Get_All`);
            setSupplies(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Lỗi tải dữ liệu:", err);
            setMessage({ type: "error", text: "Không thể tải danh sách vật tư." });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (searchEventId === "") {
            fetchSupplies();
            return;
        }
        try {
            const res = await axios.get(`${API_BASE}/Get_By_Event_Id`, {
                params: { eventId: searchEventId },
            });
            setSupplies(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Lỗi lọc theo EventId:", err);
            setMessage({ type: "error", text: "Không thể lọc dữ liệu theo EventId." });
        }
    };

    const handleSubmit = async () => {
        try {
            if (form.eventId === 0 || form.supplyId === 0 || form.quantityUsed <= 0) {
                setMessage({ type: "error", text: "Vui lòng nhập đầy đủ và hợp lệ." });
                return;
            }

            if (form.eventSupplyId) {
                await axios.put(`${API_BASE}/Update`, form);
                setMessage({ type: "success", text: "Cập nhật thành công." });
            } else {
                await axios.post(`${API_BASE}`, form);
                setMessage({ type: "success", text: "Thêm mới thành công." });
            }

            setForm({ eventId: 0, supplyId: 0, quantityUsed: 1 });
            fetchSupplies();
        } catch (err) {
            console.error("Lỗi khi lưu:", err);
            setMessage({ type: "error", text: "Không thể lưu dữ liệu." });
        }
    };

    const handleEdit = (item: HealthEventSupplyDTO) => {
        setForm({ ...item });
    };

    const handleDelete = async (id?: number) => {
        if (!id) return;
        const confirm = window.confirm("Bạn có chắc chắn muốn xoá mục này?");
        if (!confirm) return;

        try {
            await axios.put(`${API_BASE}/Delete`, { eventSupplyId: id });
            setMessage({ type: "success", text: "Xoá thành công." });
            fetchSupplies();
        } catch (err) {
            console.error("Xoá thất bại:", err);
            setMessage({ type: "error", text: "Không thể xoá dữ liệu." });
        }
    };

    useEffect(() => {
        fetchSupplies();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Quản lý Vật tư Y tế</h2>

            {message && (
                <div className={`mb-4 p-3 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {message.text}
                </div>
            )}

            <div className="flex items-center gap-4 mb-4">
                <input
                    type="number"
                    placeholder="Tìm theo Event ID"
                    className="border border-gray-300 rounded p-2"
                    value={searchEventId}
                    onChange={(e) => setSearchEventId(e.target.value === "" ? "" : Number(e.target.value))}
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Tìm kiếm
                </button>
                <button
                    onClick={() => {
                        setSearchEventId("");
                        fetchSupplies();
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Đặt lại
                </button>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-6">
                <input
                    type="number"
                    placeholder="ID sự kiện"
                    className="border border-gray-300 rounded p-2"
                    value={form.eventId}
                    onChange={(e) => setForm({ ...form, eventId: Number(e.target.value) })}
                />
                <input
                    type="number"
                    placeholder="ID vật tư"
                    className="border border-gray-300 rounded p-2"
                    value={form.supplyId}
                    onChange={(e) => setForm({ ...form, supplyId: Number(e.target.value) })}
                />
                <input
                    type="number"
                    placeholder="Số lượng sử dụng"
                    className="border border-gray-300 rounded p-2"
                    value={form.quantityUsed}
                    onChange={(e) => setForm({ ...form, quantityUsed: Number(e.target.value) })}
                />
                <button onClick={handleSubmit} className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700">
                    {form.eventSupplyId ? "Cập nhật" : "Thêm mới"}
                </button>
            </div>

            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : (
                <>
                    <p className="mb-2">Tổng số bản ghi: {supplies.length}</p>
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2">ID Sự kiện</th>
                                <th className="border px-4 py-2">ID Vật tư</th>
                                <th className="border px-4 py-2">Số lượng dùng</th>
                                <th className="border px-4 py-2">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {supplies.map((item) => (
                                <tr key={item.eventSupplyId}>
                                    <td className="border px-4 py-2">{item.eventId}</td>
                                    <td className="border px-4 py-2">{item.supplyId}</td>
                                    <td className="border px-4 py-2">{item.quantityUsed}</td>
                                    <td className="border px-4 py-2">
                                        <button onClick={() => handleEdit(item)} className="mr-2 text-blue-500 hover:underline">Sửa</button>
                                        <button onClick={() => handleDelete(item.eventSupplyId)} className="text-red-500 hover:underline">Xoá</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default MaterialManagement;
