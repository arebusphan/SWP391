import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type Account = {
  
    fullName: string;
    email: string;
    phoneNumber?: string;
    role?: string;
    isActive: boolean;
};

interface EditUserFormProps {
    user: Account;
    onSubmit: (updatedUser: Account) => void;
}

export default function EditUserForm({ user, onSubmit }: EditUserFormProps) {
    const [formData, setFormData] = useState<Account>({ ...user });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = e.target;
        setFormData(prev => ({ ...prev, isActive: checked }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
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
                />
            </div>

            <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>

            <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber || ""}
                    onChange={handleChange}
                />
            </div>

            <div>
                <Label htmlFor="role">Role</Label>
                <Input
                    id="role"
                    name="role"
                    value={formData.role || ""}
                    onChange={handleChange}
                />
            </div>

            <div className="flex items-center gap-2">
                <input
                    id="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4"
                />
                <Label htmlFor="isActive">Active</Label>
            </div>

            <Button type="submit">Save</Button>
        </form>
    );
}
