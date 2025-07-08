import { useEffect, useState } from "react";
import { getstudentid } from "../service/serviceauth";
import { useAuth } from "../context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ViewHealthProfile from "../components/ParentPage/ViewHealthProfile";
import AlertNotification from "@/components/MedicalStaffPage/AlertNotification";
import type { AlertItem } from "@/components/MedicalStaffPage/AlertNotification";

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

  // ✅ Alert state moved here
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const handleAddAlert = (alert: Omit<AlertItem, "id">) => {
    setAlerts((prev) => [
      ...prev,
      {
        ...alert,
        id: Date.now() + Math.floor(Math.random() * 1000),
      },
    ]);
  };

  const handleRemoveAlert = (id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await getstudentid();
        setStudents(response.data || []);
      } catch (error) {
        handleAddAlert({
          type: "error",
          title: "Error",
          description: "Failed to fetch students.",
        });
      }
    }
    fetchStudents();
  }, []);

  const formatDate = (dateStr: string) => dateStr?.split("T")[0];

  return (
    <div className="p-6 max-w-6xl mx-auto relative">
      {/* 🔔 Global alert container (góc màn hình) */}
      <div className="fixed top-20 right-6 z-[9999]">
        <AlertNotification alerts={alerts} onRemove={handleRemoveAlert} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 border border-gray-200 rounded-2xl p-6 bg-white shadow-md">
        {/* Parent Info */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-xl font-bold text-blue-700 mb-4">
            👨‍👩‍👧 Parent Information
          </h2>
          <div className="space-y-3 text-gray-700">
            <p><strong>Name:</strong> {user?.Name || "—"}</p>
            <p><strong>Phone:</strong> {user?.Phone || "—"}</p>
            <p><strong>Email:</strong> {user?.Email || "—"}</p>
          </div>
        </div>

        {/* Connected Students */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-xl font-bold text-green-700 mb-4">
            🎓 Connected Students
          </h2>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
            {students.map((student) => (
              <div
                key={student.studentId}
                className="cursor-pointer border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition shadow-sm"
                onClick={() => {
                  setSelectedStudent(student);
                  setOpenDialog(true);
                }}
              >
                <div className="flex flex-wrap gap-4 mb-2 text-gray-800">
                  <p><strong>Name:</strong> {student.fullName}</p>
                  <p><strong>Gender:</strong> {student.gender}</p>
                </div>
                <div className="text-gray-700">
                  <p><strong>Date of Birth:</strong> {formatDate(student.dateOfBirth)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Health Info Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="!w-full !max-w-[800px]">
          <DialogTitle className="text-blue-700 text-xl font-semibold">
            Student Health Info
          </DialogTitle>
          <DialogDescription className="text-gray-600 mb-4">
            View and update yearly health declaration
          </DialogDescription>

          {selectedStudent && (
            <ViewHealthProfile
              student={selectedStudent}
              onSubmit={() => {
                handleAddAlert({
                  type: "success",
                  title: "Updated",
                  description: "Student health profile updated.",
                });
              }}
              onAlert={handleAddAlert} // ✅ truyền xuống
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
