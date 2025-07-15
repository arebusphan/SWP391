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
            setSupplies(Array.isArray(response) ? response : []);
        } catch (error) {
            console.error("Failed to fetch supplies list:", error);
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
            console.error("Failed to upload image:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await AddSupplies(formData.supplyName, formData.quantity, formData.notes, formData.image);
            alert("✅ Supply added successfully!");
            setFormData({ supplyName: "", quantity: 0, notes: "", image: "" });
            fetchSupplies();
        } catch (error) {
            console.error("Failed to add supply:", error);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="mx-auto">
                <h1 className="text-4xl font-bold text-blue-800 p-10">Supplies Management</h1>

                {/* Add supply form */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-lg p-6 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-6 items-end"
                >
                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">Supply Name</label>
                        <input
                            type="text"
                            name="supplyName"
                            value={formData.supplyName}
                            onChange={handleChange}
                            placeholder="Enter supply name"
                            required
                            className="w-full border px-4 py-2 rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Quantity</label>
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
                        <label className="block text-sm font-medium mb-1">Notes</label>
                        <input
                            type="text"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="(Optional)"
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
                            📷 Upload image
                        </label>
                        {formData.image && (
                            <span className="text-green-600 text-sm">✅ Image selected</span>
                        )}
                    </div>

                    <div className="md:col-span-1">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
                            disabled={uploading}
                        >
                            {uploading ? "Uploading..." : "➕ Add"}
                        </button>
                    </div>
                </form>

                {/* Supplies list */}
                <div>
                    <h2 className="text-2xl font-semibold text-blue-800 p-5">Supplies List</h2>
                    {supplies.length === 0 ? (
                        <p className="text-gray-500 italic">No supplies available.</p>
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
                                    <p><strong>Quantity:</strong> {supply.quantity}</p>
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
