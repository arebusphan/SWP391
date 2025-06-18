import { useState, type ChangeEvent, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import { findUserByEmailOrPhone,addStudents } from "@/service/serviceauth";

type Student = {
  fullName: string;
  dob: string;
  gender: string;
  classId: string;
};

type Class = {
  id: number;
  name: string;
};

type StudentFormProps = {
  classList: Class[];
  onSubmit: (data: {
    students: Student[];
    guardianId: number;
    guardianName: string;
    guardianPhone: string;
  }) => void;
};

export default function StudentForm({ classList, onSubmit }: StudentFormProps) {
  const [students, setStudents] = useState<Student[]>([
    { fullName: "", dob: "", gender: "", classId: "" },
  ]);

  const [guardianInput, setGuardianInput] = useState("");
  const [guardianInfo, setGuardianInfo] = useState<{
    userId: number;
    fullName: string;
    email: string;
    phoneNumber: string;
  } | null>(null);

  const [hasSearched, setHasSearched] = useState(false);

  const handleStudentChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updated = [...students];
    updated[index] = { ...updated[index], [name]: value };
    setStudents(updated);
  };

  const handleAddStudent = () => {
    setStudents([...students, { fullName: "", dob: "", gender: "", classId: "" }]);
  };

  const handleRemoveStudent = (index: number) => {
    setStudents(students.filter((_, i) => i !== index));
  };

  const handleSearchGuardian = async () => {
    setHasSearched(true);
    try {
      const user = await findUserByEmailOrPhone(guardianInput);
      setGuardianInfo({
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      });
    } catch (error) {
      setGuardianInfo(null);
    }
  };

  const handleClearGuardian = () => {
    setGuardianInfo(null);
    setGuardianInput("");
    setHasSearched(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!guardianInfo) {
      alert("Please search and select a guardian.");
      return;
    }

    const payloadToAPI = {
      guardianId: guardianInfo.userId,
      students: students.map((s) => ({
        fullName: s.fullName,
        dateOfBirth: s.dob,
        gender: s.gender,
        classId: parseInt(s.classId),
      })),
    };

    try {
      await addStudents(payloadToAPI); // 👈 Gọi API
      alert("Students added successfully!");
    } catch (err) {
      console.error(err);
      alert("Error adding students.");
    }

    onSubmit({
      students,
      guardianId: guardianInfo.userId,
      guardianName: guardianInfo.fullName,
      guardianPhone: guardianInfo.phoneNumber,
    });

    setStudents([{ fullName: "", dob: "", gender: "", classId: "" }]);
    handleClearGuardian();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* STUDENT LEFT */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Student Information</h3>
          <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
            {students.map((student, index) => (
              <div
                key={index}
                className="border p-4 rounded-md bg-muted/20 space-y-4 relative"
              >
                <div>
                  <Label>Full Name</Label>
                  <Input
                    name="fullName"
                    value={student.fullName}
                    onChange={(e) => handleStudentChange(index, e)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      name="dob"
                      value={student.dob}
                      onChange={(e) => handleStudentChange(index, e)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <select
                      name="gender"
                      value={student.gender}
                      onChange={(e) => handleStudentChange(index, e)}
                      className="w-full border rounded px-2 py-1"
                      required
                    >
                      <option value="">--Select--</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <Label>Class</Label>
                    <select
                      name="classId"
                      value={student.classId}
                      onChange={(e) => handleStudentChange(index, e)}
                      className="w-full border rounded px-2 py-1"
                      required
                    >
                      <option value="">--Select Class--</option>
                      {classList.map((cls) => (
                        <option key={cls.id} value={cls.id.toString()}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {students.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => handleRemoveStudent(index)}
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button
            type="button"
            onClick={handleAddStudent}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Student
          </Button>
        </div>

        {/* GUARDIAN RIGHT */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Guardian Information</h3>
          <div>
            <Label>Email or Phone</Label>
            <div className="flex gap-2">
              <Input
                value={guardianInput}
                onChange={(e) => setGuardianInput(e.target.value)}
                placeholder="Enter email or phone"
                required
              />
              <Button type="button" variant="outline" onClick={handleSearchGuardian}>
                Search
              </Button>
              {guardianInfo && (
                <Button type="button" variant="ghost" onClick={handleClearGuardian}>
                  X
                </Button>
              )}
            </div>

            {guardianInfo && hasSearched ? (
              <div className="mt-2 border rounded-md p-3 bg-gray-50 text-sm space-y-1">
                <p>
                  <span className="font-medium">Name:</span> {guardianInfo.fullName}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {guardianInfo.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {guardianInfo.phoneNumber}
                </p>
              </div>
            ) : (
              hasSearched &&
              !guardianInfo && (
                <p className="text-sm text-red-500 mt-1">User not found</p>
              )
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
