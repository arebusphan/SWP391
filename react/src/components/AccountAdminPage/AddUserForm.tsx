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

    const [studentFunName, setStudentFunName] = useState("");
    const [studentDob, setStudentDob] = useState("");
    const [studentGender, setStudentGender] = useState("");

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
             if (name === "role" && value !== "Parent") {
            setStudentFunName("");
            setStudentDob("");
            setStudentGender("");
        }
        }
    };


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { fullName, email, phoneNumber, role, isActive } = formData;

        const roleMap: Record<string, number> = {
            Admin: 1,
            Manager: 3,
            Parent: 2,
            MedicalStaff: 4,
        };

        const roleId = roleMap[role ?? ""] ?? 0;
        const parent = {
            fullName,
            phoneNumber: phoneNumber ?? "",
            email,
            roleId,
            isActive,
            userId: 0,
            role: role ?? "",
        };
        const student =
            studentFunName.trim() || studentDob.trim() || studentGender
                ? {
                    fullName: studentFunName,
                    dateOfBirth: studentDob,
                    gender: studentGender,
                }
                : null;


        try {
            console.log({
                parent,
                student,
            });

            await adduser(parent, student);
            alert("Add user successful!");
            onSubmit(formData);

            // reset
            setFormData({
                fullName: "",
                email: "",
                phoneNumber: "",
                role: "",
                isActive: true,
            });
            setStudentFunName("");
            setStudentDob("");
            setStudentGender("");
        } catch (error: any) {
            console.error("Add user failed:", error);
            const message = error.response?.data?.message ?? "Add user failed!";
            alert(message);
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

            {formData.role === "Parent" && (
                <div className="space-y-2 border p-3 rounded bg-gray-50">
                    <Label htmlFor="studentFunName">Student Full Name</Label>
                    <Input
                        id="studentFunName"
                        value={studentFunName}
                        onChange={(e) => setStudentFunName(e.target.value)}
                    />
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <Label htmlFor="studentDob">Date of Birth</Label>
                            <Input
                                id="studentDob"
                                type="date"
                                value={studentDob}
                                onChange={(e) => setStudentDob(e.target.value)}
                            />
                        </div>

                        <div className="w-1/2">
                            <Label htmlFor="studentGender">Gender</Label>
                            <select
                                id="studentGender"
                                value={studentGender}
                                onChange={(e) => setStudentGender(e.target.value)}
                                className="w-full border px-3 py-2 rounded text-sm"
                            >
                                <option value="">-- Select Gender --</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                </div>
            )}

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
