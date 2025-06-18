import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import StudentForm from "./AddStudentForm";
import {
  getAllStudents,
  getAllClass,
  getStudentsByClassId,
} from "@/service/serviceauth";

type User = {
  studentId: number;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  guardianName: string;
  guardianPhone: string;
};

type Class = {
  id: number;
  name: string;
};

export default function StudentView() {
  const [searchName, setSearchName] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [classList, setClassList] = useState<Class[]>([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classes = await getAllClass();
        const mapped = classes.map((cls: any) => ({
          id: cls.classId,
          name: cls.className,
        }));
        setClassList(mapped);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách lớp:", error);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        if (selectedClassId !== "") {
          const classIdNumber = Number(selectedClassId);
          const students = await getStudentsByClassId(classIdNumber);
          setUsers(students);
        } else {
          const allStudents = await getAllStudents();
          setUsers(allStudents);
        }
      } catch (error) {
        console.error("Lỗi khi lấy học sinh:", error);
      }
    };
    fetchStudents();
  }, [selectedClassId]);

  useEffect(() => {
    const result = users.filter((u) =>
      u.fullName.toLowerCase().includes(searchName.toLowerCase())
    );
    setFilteredUsers(result);
  }, [searchName, users]);

  const handleAddStudent = (data: {
    students: {
      fullName: string;
      dob: string;
      gender: string;
      classId: string;
    }[];
    guardianPhone: string;
    guardianName: string;
  }) => {
    const newStudents: User[] = data.students.map((s, index) => ({
      studentId: Date.now() + index,
      fullName: s.fullName,
      gender: s.gender,
      dateOfBirth: s.dob,
      guardianName: data.guardianName,
      guardianPhone: data.guardianPhone,
    }));
    setUsers((prev) => [...prev, ...newStudents]);
    setOpen(false);
  };

  return (
    <div className="p-5 space-y-4">
      <h2 className="text-xl font-bold">Danh sách học sinh</h2>

      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Tìm theo tên..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-[200px]"
          />
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">-- Tất cả lớp --</option>
            {classList.map((cls) => (
              <option key={cls.id} value={cls.id.toString()}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary">
              <Plus className="w-4 h-4 mr-1" /> Thêm học sinh
            </Button>
          </DialogTrigger>
          <DialogContent className="!max-w-5xl w-full">
            <h3 className="text-lg font-semibold mb-2">Thêm học sinh mới</h3>
            <StudentForm classList={classList} onSubmit={handleAddStudent} />
          </DialogContent>
        </Dialog>
      </div>

      <table className="w-full text-sm border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2 text-left">Tên học sinh</th>
            <th className="border px-3 py-2 text-left">Giới tính</th>
            <th className="border px-3 py-2 text-left">Ngày sinh</th>
            <th className="border px-3 py-2 text-left">Tên người giám hộ</th>
            <th className="border px-3 py-2 text-left">SĐT người giám hộ</th>
            <th className="border px-3 py-2 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((u) => (
              <tr key={u.studentId} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{u.fullName}</td>
                <td className="border px-3 py-2">{u.gender}</td>
                <td className="border px-3 py-2">
                  {new Date(u.dateOfBirth).toLocaleDateString("vi-VN")}
                </td>
                <td className="border px-3 py-2">{u.guardianName}</td>
                <td className="border px-3 py-2">{u.guardianPhone}</td>
                <td className="border px-3 py-2">
                  <button className="text-blue-500 hover:text-blue-700">
                    <Pencil className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center text-gray-500 py-3">
                Không có học sinh phù hợp.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
