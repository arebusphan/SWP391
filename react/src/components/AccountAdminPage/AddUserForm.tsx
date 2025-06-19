import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, PlusCircle } from "lucide-react";
import { getAllClass, addUserAPI } from "@/service/serviceauth";

export type Account = {
  fullName: string;
  email: string;
  phoneNumber?: string;
  role?: string;
  isActive: boolean;
};

type Student = {
  fullName: string;
  dob: string;
  gender: string;
  classId: string;
};

type AddUserFormProps = {
  onSubmit?: (user: Account) => void;
  onExpandDialog: (expand: boolean) => void;
};

const ROLES = [
  { id: 1, name: "Admin" },
  { id: 2, name: "Parent" },
  { id: 3, name: "MedicalStaff" },
  { id: 4, name: "Manager" },
];

export default function AddUserForm({ onExpandDialog }: AddUserFormProps) {
  const [formData, setFormData] = useState<Account>({
    fullName: "",
    email: "",
    phoneNumber: "",
    role: "",
    isActive: true,
  });

  const [students, setStudents] = useState<Student[]>([
    { fullName: "", dob: "", gender: "", classId: "" },
  ]);

  const [classList, setClassList] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await getAllClass();
        const mapped = data.map((cls: any) => ({
          id: cls.classId.toString(),
          name: cls.className,
        }));
        setClassList(mapped);
      } catch (err) {
        console.error("❌ Lỗi khi load lớp học:", err);
      }
    };
    fetchClasses();
  }, []);

  const handleUserChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type, value } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      if (name === "role") {
        if (value === "Parent") {
          onExpandDialog(true);
        } else {
          onExpandDialog(false);
          setStudents([{ fullName: "", dob: "", gender: "", classId: "" }]);
        }
      }
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleStudentChange = (index: number, field: keyof Student, value: string) => {
    const updated = [...students];
    updated[index][field] = value;
    setStudents(updated);
  };

  const addStudent = () => {
    setStudents([...students, { fullName: "", dob: "", gender: "", classId: "" }]);
  };

  const removeStudent = (index: number) => {
    const updated = [...students];
    updated.splice(index, 1);
    setStudents(updated);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const roleObj = ROLES.find((r) => r.name === formData.role);
      const userPayload = {
        ...formData,
        roleId: roleObj?.id ?? 0,
      };
      delete userPayload.role;

      const cleanedStudents = students.map((s) => ({
        ...s,
        classId: parseInt(s.classId),
        dateOfBirth: s.dob, // rename nếu cần
      }));

      const result = await addUserAPI(
        userPayload,
        roleObj?.name === "Parent" ? cleanedStudents : undefined
      );

      console.log("✅ Add User Success:", result);
      alert("Thêm người dùng thành công!");

      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        role: "",
        isActive: true,
      });
      setStudents([{ fullName: "", dob: "", gender: "", classId: "" }]);
      onExpandDialog(false);
    } catch (error) {
      console.error("❌ Lỗi khi thêm người dùng:", error);
      alert("Đã xảy ra lỗi khi thêm người dùng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6 w-full">
      <div className={`space-y-4 ${formData.role === "Parent" ? "md:w-1/2" : "md:w-full"} w-full`}>
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleUserChange} required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleUserChange} required />
        </div>
        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleUserChange} />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleUserChange}
            required
            className="w-full border px-3 py-2 rounded text-sm"
          >
            <option value="">-- Select Role --</option>
            {ROLES.map((r) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <input
            id="isActive"
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleUserChange}
          />
          <Label htmlFor="isActive">Active</Label>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add"}
        </Button>
      </div>

      {formData.role === "Parent" && (
        <div className="w-full md:w-1/2 max-h-[400px] overflow-y-auto space-y-4 border p-4 rounded bg-gray-50">
          {students.map((student, index) => (
            <div key={index} className="border p-3 rounded-md bg-white space-y-2">
              <div className="flex justify-between items-center">
                <Label>Student Full Name</Label>
                {index > 0 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeStudent(index)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
              <Input
                value={student.fullName}
                onChange={(e) => handleStudentChange(index, "fullName", e.target.value)}
              />
              <div className="flex gap-2">
                <div className="w-1/3">
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={student.dob}
                    onChange={(e) => handleStudentChange(index, "dob", e.target.value)}
                  />
                </div>
                <div className="w-1/3">
                  <Label>Gender</Label>
                  <select
                    value={student.gender}
                    onChange={(e) => handleStudentChange(index, "gender", e.target.value)}
                    className="w-full border px-3 py-2 rounded text-sm"
                  >
                    <option value="">-- Select Gender --</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="w-1/3">
                  <Label>Class</Label>
                  <select
                    value={student.classId}
                    onChange={(e) => handleStudentChange(index, "classId", e.target.value)}
                    className="w-full border px-3 py-2 rounded text-sm"
                  >
                    <option value="">-- Select Class --</option>
                    {classList.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addStudent} className="w-full">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add More Student
          </Button>
        </div>
      )}
    </form>
  );
}