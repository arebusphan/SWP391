import { useState, type ChangeEvent, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";

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
  onSubmit: (data: { students: Student[]; guardianPhone: string }) => void;
};

export default function StudentForm({ classList, onSubmit }: StudentFormProps) {
  const [students, setStudents] = useState<Student[]>([
    { fullName: "", dob: "", gender: "", classId: "" },
  ]);
  const [guardianPhone, setGuardianPhone] = useState("");
  const [guardianResult, setGuardianResult] = useState("");

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

  const handleSearchGuardian = () => {
    // Giả lập tìm kiếm
    if (guardianPhone === "0123456789") {
      setGuardianResult("Nguyễn Văn A (tìm thấy)");
    } else {
      setGuardianResult("Không tìm thấy");
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ students, guardianPhone });
    setStudents([{ fullName: "", dob: "", gender: "", classId: "" }]);
    setGuardianPhone("");
    setGuardianResult("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* STUDENT LEFT */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Thông tin học sinh</h3>
          <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
            {students.map((student, index) => (
              <div
                key={index}
                className="border p-4 rounded-md bg-muted/20 space-y-4 relative"
              >
                <div>
                  <Label>Họ và tên</Label>
                  <Input
                    name="fullName"
                    value={student.fullName}
                    onChange={(e) => handleStudentChange(index, e)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label>Ngày sinh</Label>
                    <Input
                      type="date"
                      name="dob"
                      value={student.dob}
                      onChange={(e) => handleStudentChange(index, e)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Giới tính</Label>
                    <select
                      name="gender"
                      value={student.gender}
                      onChange={(e) => handleStudentChange(index, e)}
                      className="w-full border rounded px-2 py-1"
                      required
                    >
                      <option value="">--Chọn--</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </div>
                  <div>
                    <Label>Lớp</Label>
                    <select
                      name="classId"
                      value={student.classId}
                      onChange={(e) => handleStudentChange(index, e)}
                      className="w-full border rounded px-2 py-1"
                      required
                    >
                      <option value="">--Chọn lớp--</option>
                      {classList.map((cls) => (
                        <option key={cls.id} value={cls.id}>
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
            Thêm học sinh
          </Button>
        </div>

        {/* GUARDIAN RIGHT */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Thông tin phụ huynh</h3>
          <div>
            <Label>Số điện thoại</Label>
            <div className="flex gap-2">
              <Input
                value={guardianPhone}
                onChange={(e) => setGuardianPhone(e.target.value)}
                placeholder="Nhập số điện thoại"
                required
              />
              <Button type="button" variant="outline" onClick={handleSearchGuardian}>
                Tìm
              </Button>
            </div>
            {guardianResult && (
              <p className="text-sm text-muted-foreground mt-1">
                Kết quả: <span className="font-medium">{guardianResult}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Lưu danh sách</Button>
      </div>
    </form>
  );
}
