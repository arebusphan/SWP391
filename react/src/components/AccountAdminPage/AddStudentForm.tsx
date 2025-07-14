import { useState, type ChangeEvent, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import { findUserByEmailOrPhone, addStudents, updateStudent } from "@/service/serviceauth";

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
    guardianName: string;
    guardianPhone: string;
  }) => void;
  defaultData?: any;
  isEditing?: boolean;
};

export default function StudentForm({
  classList,
  onSubmit,
  defaultData,
  isEditing = false,
}: StudentFormProps) {
  const [students, setStudents] = useState<Student[]>(
    isEditing && defaultData
      ? [
          {
            fullName: defaultData.fullName,
            dob: defaultData.dateOfBirth?.slice(0, 10),
            gender: defaultData.gender,
            classId: defaultData.classId.toString(),
          },
        ]
      : [{ fullName: "", dob: "", gender: "", classId: "" }]
  );

  const [guardianInput, setGuardianInput] = useState("");
  const [guardianInfo, setGuardianInfo] = useState<{
    userId?: number;
    fullName: string;
    phoneNumber: string;
  } | null>(
    isEditing && defaultData
      ? {
          userId: defaultData.guardianId,
          fullName: defaultData.guardianName,
          phoneNumber: defaultData.guardianPhone,
        }
      : null
  );

  const [hasSearched, setHasSearched] = useState(isEditing);

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

    if (!isEditing && (!guardianInfo || !guardianInfo.userId)) {
      alert("Please search and select a guardian.");
      return;
    }

    try {
      if (isEditing) {
        const updatedStudent = {
          fullName: students[0].fullName,
          dateOfBirth: students[0].dob,
          gender: students[0].gender,
          classId: parseInt(students[0].classId),
        };

        await updateStudent(defaultData.studentId, updatedStudent);
        alert("Student updated successfully!");
      } else {
        const payloadToAPI = {
          guardianId: guardianInfo!.userId!,
          students: students.map((s) => ({
            fullName: s.fullName,
            dateOfBirth: s.dob,
            gender: s.gender,
            classId: parseInt(s.classId),
          })),
        };

        await addStudents(payloadToAPI);
        alert("Students added successfully!");
      }

      onSubmit({
        students,
        guardianName: guardianInfo?.fullName || "",
        guardianPhone: guardianInfo?.phoneNumber || "",
      });

      if (!isEditing) {
        setStudents([{ fullName: "", dob: "", gender: "", classId: "" }]);
        handleClearGuardian();
      }
    } catch (err) {
      console.error(err);
      alert(isEditing ? "Error updating student." : "Error adding students.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* STUDENT SECTION */}
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
          {!isEditing && (
            <Button
              type="button"
              onClick={handleAddStudent}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Student
            </Button>
          )}
        </div>

        {/* GUARDIAN SECTION */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Guardian Information</h3>
          {!isEditing && (
            <>
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
            </>
          )}

          {guardianInfo && hasSearched ? (
            <div className="mt-2 border rounded-md p-3 bg-gray-50 text-sm space-y-1">
              <p>
                <span className="font-medium">Name:</span> {guardianInfo.fullName}
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

      <div className="flex justify-end">
        <Button type="submit">{isEditing ? "Update" : "Save"}</Button>
      </div>
    </form>
  );
}
