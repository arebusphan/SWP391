// import { useState, type ChangeEvent, type FormEvent } from "react";
// import { adduser } from "../../service/serviceauth";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";

// export type Account = {
//     fullName: string;
//     email: string;
//     phoneNumber?: string;
//     role?: string;
//     isActive: boolean;
// };

// type AddUserFormProps = {
//     onSubmit: (user: Account) => void;
// };

// export default function AddUserForm({ onSubmit }: AddUserFormProps) {
//     const [formData, setFormData] = useState<Account>({
//         fullName: "",
//         email: "",
//         phoneNumber: "",
//         role: "",
//         isActive: true,
//     });

//     const [studentFunName, setStudentFunName] = useState("");
//     const [studentDob, setStudentDob] = useState("");
//     const [studentGender, setStudentGender] = useState("");

//     const [loading, setLoading] = useState(false);

//     const handleChange = (
//         e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
//     ) => {
//         const { name, type, value } = e.target;

//         if (type === "checkbox") {
//             const checked = (e.target as HTMLInputElement).checked;
//             setFormData((prev) => ({
//                 ...prev,
//                 [name]: checked,
//             }));
//         } else {
//             setFormData((prev) => ({
//                 ...prev,
//                 [name]: value,
//             }));
//              if (name === "role" && value !== "Parent") {
//             setStudentFunName("");
//             setStudentDob("");
//             setStudentGender("");
//         }
//         }
//     };


//     const handleSubmit = async (e: FormEvent) => {
//         e.preventDefault();
//         setLoading(true);

//         const { fullName, email, phoneNumber, role, isActive } = formData;

//         const roleMap: Record<string, number> = {
//             Admin: 1,
//             Manager: 3,
//             Parent: 2,
//             MedicalStaff: 4,
//         };

//         const roleId = roleMap[role ?? ""] ?? 0;
//         const parent = {
//             fullName,
//             phoneNumber: phoneNumber ?? "",
//             email,
//             roleId,
//             isActive,
//             userId: 0,
//             role: role ?? "",
//         };
//         const student =
//             studentFunName.trim() || studentDob.trim() || studentGender
//                 ? {
//                     fullName: studentFunName,
//                     dateOfBirth: studentDob,
//                     gender: studentGender,
//                 }
//                 : null;


//         try {
//             console.log({
//                 parent,
//                 student,
//             });

//             await adduser(parent, student);
//             alert("Add user successful!");
//             onSubmit(formData);

//             // reset
//             setFormData({
//                 fullName: "",
//                 email: "",
//                 phoneNumber: "",
//                 role: "",
//                 isActive: true,
//             });
//             setStudentFunName("");
//             setStudentDob("");
//             setStudentGender("");
//         } catch (error: any) {
//             console.error("Add user failed:", error);
//             const message = error.response?.data?.message ?? "Add user failed!";
//             alert(message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//                 <Label htmlFor="fullName">Full Name</Label>
//                 <Input
//                     id="fullName"
//                     name="fullName"
//                     value={formData.fullName}
//                     onChange={handleChange}
//                     required
//                 />
//             </div>

//             <div>
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                     id="email"
//                     name="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                 />
//             </div>

//             <div>
//                 <Label htmlFor="phoneNumber">Phone Number</Label>
//                 <Input
//                     id="phoneNumber"
//                     name="phoneNumber"
//                     value={formData.phoneNumber}
//                     onChange={handleChange}
//                 />
//             </div>

//             <div>
//                 <Label htmlFor="role">Role</Label>
//                 <select
//                     id="role"
//                     name="role"
//                     value={formData.role}
//                     onChange={handleChange}
//                     required
//                     className="w-full border px-3 py-2 rounded text-sm"
//                 >
//                     <option value="">-- Select Role --</option>
//                     <option value="Admin">Admin</option>
//                     <option value="Manager">Manager</option>
//                     <option value="Parent">Parent</option>
//                     <option value="MedicalStaff">Medical Staff</option>
//                 </select>
//             </div>

//             {formData.role === "Parent" && (
//                 <div className="space-y-2 border p-3 rounded bg-gray-50">
//                     <Label htmlFor="studentFunName">Student Full Name</Label>
//                     <Input
//                         id="studentFunName"
//                         value={studentFunName}
//                         onChange={(e) => setStudentFunName(e.target.value)}
//                     />
//                     <div className="flex gap-4">
//                         <div className="w-1/2">
//                             <Label htmlFor="studentDob">Date of Birth</Label>
//                             <Input
//                                 id="studentDob"
//                                 type="date"
//                                 value={studentDob}
//                                 onChange={(e) => setStudentDob(e.target.value)}
//                             />
//                         </div>

//                         <div className="w-1/2">
//                             <Label htmlFor="studentGender">Gender</Label>
//                             <select
//                                 id="studentGender"
//                                 value={studentGender}
//                                 onChange={(e) => setStudentGender(e.target.value)}
//                                 className="w-full border px-3 py-2 rounded text-sm"
//                             >
//                                 <option value="">-- Select Gender --</option>
//                                 <option value="Male">Male</option>
//                                 <option value="Female">Female</option>
//                                 <option value="Other">Other</option>
//                             </select>
//                         </div>
//                     </div>

//                 </div>
//             )}

//             <div className="flex items-center space-x-2">
//                 <input
//                     id="isActive"
//                     type="checkbox"
//                     name="isActive"
//                     checked={formData.isActive}
//                     onChange={handleChange}
//                 />
//                 <Label htmlFor="isActive">Active</Label>
//             </div>

//             <Button type="submit" disabled={loading}>
//                 {loading ? "Saving..." : "Add"}
//             </Button>
//         </form>
//     );
// }
//
import { useState, type ChangeEvent, type FormEvent } from "react";
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

type Student = {
  fullName: string;
  dateOfBirth: string;
  gender: string;
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

  const [students, setStudents] = useState<Student[]>([]);

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.target;

    if (name === "role") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (value === "Parent") {
        setStudents([{ fullName: "", dateOfBirth: "", gender: "" }]);
      } else {
        setStudents([]);
      }
      return;
    }

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

  const handleStudentChange = (
    index: number,
    field: keyof Student,
    value: string
  ) => {
    const updated = [...students];
    updated[index][field] = value;
    setStudents(updated);
  };

  const handleRemoveStudent = (index: number) => {
    if (index === 0) return; // không cho xóa student đầu tiên
    const updated = [...students];
    updated.splice(index, 1);
    setStudents(updated);
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

    const studentList =
      role === "Parent"
        ? students.filter((s) => s.fullName || s.dateOfBirth || s.gender)
        : null;

    try {
      console.log("Submitted data:", { parent, studentList });
      alert("Submitted (no API)");
      onSubmit(formData);

      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        role: "",
        isActive: true,
      });
      setStudents([]);
    } catch (error) {
      console.error("Submit error:", error);
      alert("Submit failed!");
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
          <div className="flex justify-between items-center mb-2">
            <Label className="text-base">Students</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setStudents((prev) => [
                  ...prev,
                  { fullName: "", dateOfBirth: "", gender: "" },
                ])
              }
            >
              + Add Student
            </Button>
          </div>

          <div className="max-h-64 overflow-y-auto pr-2 space-y-4">
            {students.map((student, index) => (
              <div
                key={index}
                className="border p-3 rounded bg-white relative space-y-2"
              >
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveStudent(index)}
                    className="absolute top-2 right-2 text-sm text-red-500"
                  >
                    ✕
                  </button>
                )}
                <Input
                  placeholder="Full Name"
                  value={student.fullName}
                  onChange={(e) =>
                    handleStudentChange(index, "fullName", e.target.value)
                  }
                />
                <div className="flex gap-3">
                  <Input
                    type="date"
                    className="w-1/2"
                    value={student.dateOfBirth}
                    onChange={(e) =>
                      handleStudentChange(index, "dateOfBirth", e.target.value)
                    }
                  />
                  <select
                    className="w-1/2 border px-3 py-2 rounded text-sm"
                    value={student.gender}
                    onChange={(e) =>
                      handleStudentChange(index, "gender", e.target.value)
                    }
                  >
                    <option value="">-- Gender --</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
            ))}
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
