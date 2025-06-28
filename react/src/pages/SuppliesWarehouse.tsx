import React, { useState, useEffect } from "react";
import { AddSupplies, GetSupplies } from "../service/serviceauth";

interface MedicalSupply {
    id: number;
    supplyName: string;
    quantity: number;
    notes: string;
    image: string;
}

interface MedicalSupplyInput {
    supplyName: string;
    quantity: number;
    notes: string;
    image: string;
}

const SuppliesWarehouse: React.FC = () => {
    const [formData, setFormData] = useState<MedicalSupplyInput>({
        supplyName: "",
        quantity: 0,
        notes: "",
        image: "",
    });

    const [supplies, setSupplies] = useState<MedicalSupply[]>([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchSupplies();
    }, []);

    const fetchSupplies = async () => {
        try {
            const response = await GetSupplies();
            setSupplies(response.data);
        } catch (error) {
            console.error("Lỗi tải danh sách vật tư:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "quantity" ? Number(value) : value,
        }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("upload_preset", "swp391");
        formDataUpload.append("cloud_name", "demmylzob");

        try {
            setUploading(true);
            const res = await fetch("https://api.cloudinary.com/v1_1/demmylzob/image/upload", {
                method: "POST",
                body: formDataUpload,
            });
            const data = await res.json();
            setFormData((prev) => ({ ...prev, image: data.secure_url }));
        } catch (error) {
            console.error("Lỗi upload ảnh:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await AddSupplies(formData.supplyName, formData.quantity, formData.notes, formData.image);
            alert("✅ Thêm vật tư thành công!");
            setFormData({ supplyName: "", quantity: 0, notes: "", image: "" });
            fetchSupplies();
        } catch (error) {
            console.error("Lỗi thêm vật tư:", error);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto space-y-10">
                <h1 className="text-4xl font-bold text-blue-700 text-center">📦 Supplies Management</h1>

                {/* Form thêm vật tư */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-lg p-6 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-6 items-end"
                >
                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">Tên vật tư</label>
                        <input
                            type="text"
                            name="supplyName"
                            value={formData.supplyName}
                            onChange={handleChange}
                            placeholder="Nhập tên vật tư"
                            required
                            className="w-full border px-4 py-2 rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Số lượng</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            placeholder="0"
                            required
                            className="w-full border px-4 py-2 rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Ghi chú</label>
                        <input
                            type="text"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="(Tùy chọn)"
                            className="w-full border px-4 py-2 rounded-lg"
                        />
                    </div>

                    <div className="md:col-span-3 flex items-center gap-4">
                        <input
                            type="file"
                            id="fileUpload"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <label
                            htmlFor="fileUpload"
                            className="bg-gray-200 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-300"
                        >
                            📷 Chọn ảnh
                        </label>
                        {formData.image && (
                            <span className="text-green-600 text-sm">✅ Đã chọn ảnh</span>
                        )}
                    </div>

                    <div className="md:col-span-1">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
                            disabled={uploading}
                        >
                            {uploading ? "Đang tải..." : "➕ Thêm"}
                        </button>
                    </div>
                </form>

                {/* Danh sách vật tư */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">📋 Danh sách vật tư</h2>
                    {supplies.length === 0 ? (
                        <p className="text-gray-500 italic">Chưa có vật tư nào.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {supplies.map((supply, index) => (
                                <div key={supply.id ?? index} className="bg-white rounded-xl shadow-md p-4">
                                    <img
                                        src={supply.image}
                                        alt={supply.supplyName}
                                        className="w-full h-40 object-cover rounded mb-3"
                                    />
                                    <h3 className="text-lg font-bold mb-1">{supply.supplyName}</h3>
                                    <p><strong>Số lượng:</strong> {supply.quantity}</p>
                                    <p className="text-sm text-gray-600">{supply.notes}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SuppliesWarehouse;
