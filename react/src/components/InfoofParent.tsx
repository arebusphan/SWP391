import { useEffect, useState } from "react";
import { getstudentid } from "../service/serviceauth";
import { useAuth } from "../context/AuthContext";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ViewHealthProfile from "../components/ParentPage/ViewHealthProfile";

export type ParentofStudent = {
  studentId: number;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  guardianId: number;
  guardianName: string;
  guardianPhone: string;
};

export default function InfoofParent() {
  const { user } = useAuth();
  const [students, setStudents] = useState<ParentofStudent[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<ParentofStudent | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await getstudentid();
        setStudents(response.data || []);
      } catch (error) {
        console.error("Failed to fetch students", error);
      }
    }
    fetchStudents();
  }, []);

  const formatDate = (dateStr: string) => dateStr?.split("T")[0];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6 border rounded p-6 bg-white shadow">
        {/* Bên trái: thông tin phụ huynh */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">👨‍👩‍👧 Parent Information</h2>
          <div className="space-y-3">
            <div><strong>Name:</strong> {user?.Name || ""}</div>
            <div><strong>Phone:</strong> {user?.Phone}</div>
            <div><strong>Email:</strong> {user?.Email}</div>
          </div>
        </div>

        {/* Bên phải: danh sách học sinh */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">🎓 Connected Students</h2>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
            {students.map((student) => (
              <div
                key={student.studentId}
                className="cursor-pointer border rounded p-4 shadow-sm hover:bg-gray-50"
                onClick={() => {
                  setSelectedStudent(student);
                  setOpenDialog(true);
                }}
              >
                {/* Hàng 1: Name + Gender */}
                <div className="flex flex-wrap gap-4 mb-2">
                  <div><strong>Name:</strong> {student.fullName}</div>
                  <div><strong>Gender:</strong> {student.gender}</div>
                </div>

                {/* Hàng 2: DOB */}
                <div className="flex flex-wrap gap-4">
                  <div><strong>Date of Birth:</strong> {formatDate(student.dateOfBirth)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dialog hiển thị chi tiết học sinh */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="!w-full !max-w-[800px]">
          <DialogTitle>Student Health Info</DialogTitle>
          <DialogDescription>View and update yearly health declaration</DialogDescription>
          {selectedStudent && (
            <ViewHealthProfile
              student={selectedStudent}
              onSubmit={(updatedData) => {
                console.log("Updated:", updatedData);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
