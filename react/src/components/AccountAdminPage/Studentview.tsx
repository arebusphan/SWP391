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
import { Pagination } from "@/components/ui/Pagination"; // Component giống AccountManager

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
        console.error("Failed to fetch classes:", error);
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
        console.error("Failed to fetch students:", error);
      }
    };
    fetchStudents();
  }, [selectedClassId]);

  useEffect(() => {
    const result = users.filter((u) =>
      u.fullName.toLowerCase().includes(searchName.toLowerCase())
    );
    setFilteredUsers(result);
    setCurrentPage(1);
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

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-5">
      <h2 className="text-3xl font-bold text-blue-800 mb-6">Student Management</h2>

      <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
        <div className="flex gap-2 items-center flex-wrap">
          <Input
            placeholder="Search by name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-[200px]"
          />
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">-- All Classes --</option>
            {classList.map((cls) => (
              <option key={cls.id} value={cls.id.toString()}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="!max-w-5xl w-full">
            <h3 className="text-lg font-semibold mb-2">Add New Student</h3>
            <StudentForm classList={classList} onSubmit={handleAddStudent} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded overflow-hidden shadow">
        <table className="w-full text-sm">
          <thead className="bg-blue-100 text-blue-800">
            <tr>
              <th className="p-3 text-left">Full Name</th>
              <th className="p-3 text-left">Gender</th>
              <th className="p-3 text-left">Date of Birth</th>
              <th className="p-3 text-left">Guardian Name</th>
              <th className="p-3 text-left">Guardian Phone</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((u) => (
                <tr key={u.studentId} className="hover:bg-blue-50 border-t">
                  <td className="p-3">{u.fullName}</td>
                  <td className="p-3">{u.gender}</td>
                  <td className="p-3">
                    {new Date(u.dateOfBirth).toLocaleDateString("en-GB")}
                  </td>
                  <td className="p-3">{u.guardianName}</td>
                  <td className="p-3">{u.guardianPhone}</td>
                  <td className="p-3 text-right">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Pencil className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-5">
                  No matching students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
