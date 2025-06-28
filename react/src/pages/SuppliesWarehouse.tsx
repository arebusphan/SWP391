    import React, { useState, useEffect } from 'react';
    import { AddSupplies, GetSupplies } from '../service/serviceauth';

    interface MedicalSupply {
        id: number;
        supplyName: string;
        quantity: number;
        notes: string;
        image: string;

    }

    const SuppliesWarehouse: React.FC = () => {

        interface MedicalSupplyInput {
            supplyName: string;
            quantity: number;
            notes: string;
            image: string;
        }

        const [formData, setFormData] = useState<MedicalSupplyInput>({
            supplyName: '',
            quantity: 0,
            notes: '',
            image: ''
        });

        const [supplies, setSupplies] = useState<MedicalSupply[]>([]);
        const [uploading, setUploading] = useState<boolean>(false);

        // Load danh sách khi vào trang
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
                [name]: name === 'quantity' ? Number(value) : value
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
                const res = await fetch('https://api.cloudinary.com/v1_1/demmylzob/image/upload', {
                    method: 'POST',
                    body: formDataUpload
                });
                const data = await res.json();
                setFormData((prev) => ({
                    ...prev,
                    image: data.secure_url // Lưu URL vào formData
                }));
                setUploading(false);
            } catch (error) {
                console.error('Lỗi upload ảnh:', error);
                setUploading(false);
            }
        };

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            try {
                await AddSupplies(formData.supplyName, formData.quantity, formData.notes, formData.image);
                alert("Thêm vật tư thành công!");
                setFormData({
                    supplyName: '',
                    quantity: 0,
                    notes: '',
                    image: ''
                });
                fetchSupplies();
            } catch (error) {
                console.error("Lỗi thêm vật tư:", error);
            }
        };
        console.log("Dữ liệu gửi:", {
            supplyName: formData.supplyName,
            quantity: formData.quantity,
            notes: formData.notes,
            image: formData.image
        });

        return (
            <div className="p-4">
                <h1 className="text-center text-3xl text-blue-700 p-5 mb-8 ">Supplies Management</h1>

                {/* Form thêm vật tư */}
                <form onSubmit={handleSubmit} className="mb-10 flex items-center space-x-2">
                    <input
                        type="text"
                        name="supplyName"
                        value={formData.supplyName}
                        onChange={handleChange}
                        placeholder="Tên vật tư"
                        className="w-full border p-2 rounded"
                        required
                    />
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="Số lượng"
                        className="w-full border p-2 rounded"
                        required
                    />
                    <input
                        type="text"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Ghi chú"
                        className="w-full border p-2 rounded"
                    />
                    <div className="flex items-center space-x-2">
                        {/* Input file ẩn */}
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            id="fileUpload"
                        
                            required
                        />
                        {/* Button custom */}
                        <label
                            htmlFor="fileUpload"
                            className="bg-gray-300 px-4 py-2 rounded cursor-pointer hover:bg-gray-400"
                        >
                            Img
                        </label>
                        {/* Hiển thị tên file nếu đã chọn */}
                        <span>{formData.image ? 'Đã chọn ảnh' : ''}</span>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        disabled={uploading}
                    >
                        {uploading ? "Đang tải ảnh..." : "Thêm"}
                    </button>
                </form>

                {/* Danh sách vật tư */}
                <h2 className="text-2xl font-bold mb-4">Danh sách vật tư</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {supplies.map((supply , index) => (
                        <div key={supply.id ?? index} className="border p-4 rounded shadow">
                            <h3 className="text-xl font-semibold mb-2">{supply.supplyName}</h3>
                            <img src={supply.image} alt={supply.supplyName} className="w-full h-40 object-cover mb-2" />
                            <p><strong>Số lượng:</strong> {supply.quantity}</p>
                            <p><strong>Ghi chú:</strong> {supply.notes}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    export default SuppliesWarehouse;
