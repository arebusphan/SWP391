import { useState, type ChangeEvent, type FormEvent,   } from "react";
import { adduser } from "../../service/serviceauth";


type UserFormData = {
    name: string;
    email: string;
    phone: string;
    role: string;
    isActive: boolean;
};

export default function AddUserForm() {
    const [formData, setFormData] = useState<UserFormData>({
        name: "",
        email: "",
        phone: "",
        role: "",
        isActive: true,
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checkbox = e.target as HTMLInputElement;
            setFormData((prev) => ({ ...prev, [name]: checkbox.checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { name, email, phone, role, isActive } = formData;

        const roleMap: Record<string, number> = {
            Admin: 1,
            Manager: 2,
            Parent: 3,
            MedicalStaff: 4,
        };

        const roleId = roleMap[role] || 0;

        try {
            await adduser(name, phone, email, roleId, role, isActive);
            alert("Add User Successful !");
            
            setFormData({
                name: "",
                email: "",
                phone: "",
                role: "",
                isActive: true,
            });
        } catch (error) {
            console.error("Add fail!:", error);
            alert("Add User fail!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md bg-white p-6 rounded-lg border shadow-sm space-y-4"
        >
            <h2 className="text-lg font-semibold">Add New User</h2>

            <div>
                <label className="block text-sm mb-1">Full Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border px-3 py-2 rounded text-sm"
                />
            </div>

            <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border px-3 py-2 rounded text-sm"
                />
            </div>

            <div>
                <label className="block text-sm mb-1">Phone</label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full border px-3 py-2 rounded text-sm"
                />
            </div>

            <div>
                <label className="block text-sm mb-1">Role</label>
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="w-full border px-3 py-2 rounded text-sm"
                >
                    <option value="">-- Select Role --</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Parent">Parent</option>
                    <option value="HealthStaff">Medical Staff</option>
                </select>
            </div>
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-4 h-4"
                />
                <label className="text-sm">Active</label>
            </div>
           

            <button
                type="submit"
                disabled={loading}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
            >
                {loading ? "Saving..." : "Add"}
            </button>
        </form>
    );
}
