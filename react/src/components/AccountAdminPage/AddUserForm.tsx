import { useState, type ChangeEvent, type FormEvent } from "react";
import { adduser } from "../../service/serviceauth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export type Account = {
    fullName: string;
    email: string;
    phoneNumber?: string;
    role?: string;
    isActive: boolean;
};

type AddUserFormProps = {
    onSubmit: (user: Account) => void;
};

export default function AddUserForm({ onSubmit }: AddUserFormProps) {
    const [formData, setFormData] = useState<Account>({
        fullName: "",
        email: "",
        phoneNumber: "",
        role: "",
        isActive: true,
    });

    const [loading, setLoading] = useState(false);
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, type, value } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({
                ...prev,
                [name]: checked,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { fullName, email, phoneNumber, role, isActive } = formData;

        const roleMap: Record<string, number> = {
            Admin: 1,
            Manager: 2,
            Parent: 3,
            MedicalStaff: 4,
        };

        const roleId = roleMap[role ?? ""] ?? 0;

        try {
            console.log({ fullName, phoneNumber, email, roleId, role, isActive });
            await adduser(fullName, phoneNumber ?? "", email, roleId, role ?? "", isActive);
            alert("Add user successful!");

            onSubmit(formData); 

            setFormData({
                fullName: "",
                email: "",
                phoneNumber: "",
                role: "",
                isActive: true,
            });
        } catch (error) {
            console.error("Add user failed:", error);
            alert("Add user failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                />
            </div>

            <div>
                <Label htmlFor="role">Role</Label>
                <select
                    id="role"
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
                    <option value="MedicalStaff">Medical Staff</option>
                </select>
            </div>

            <div className="flex items-center space-x-2">
                <input
                    id="isActive"
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                />
                <Label htmlFor="isActive">Active</Label>
            </div>

            <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Add"}
            </Button>
        </form>
    );
}
