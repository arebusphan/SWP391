import { useState, useEffect } from "react";
import {
  sendingmedicine,
  uploadToCloudinary,
  getstudentid,
} from "../../service/serviceauth";
import type { AlertItem } from "@/components/MedicalStaffPage/AlertNotification";

export default function SendMedicineForm({
  onSuccess,
  onPreviewChange,
  addAlert,
}: {
  onSuccess: () => void;
  onPreviewChange: (preview: boolean, url?: string) => void;
  addAlert: (alert: Omit<AlertItem, "id">) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [students, setStudents] = useState<
    { studentId: number; fullName: string; className: string }[]
  >([]);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [medicineName, setMedicineName] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [healthStatus, setHealthStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await getstudentid();
        const studentList = res.data || [];
        setStudents(studentList);
        if (studentList.length > 0) {
          setStudentId(studentList[0].studentId);
        }
      } catch (err) {
        console.error("Error fetching students:", err);
        addAlert({
          type: "error",
          title: "Load Failed",
          description: "Failed to load student list.",
        });
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    if (!file) {
      onPreviewChange(false, "");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    onPreviewChange(true, objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      addAlert({
        type: "error",
        title: "Missing File",
        description: "Please select an image file.",
      });
      return;
    }

    if (!studentId) {
      addAlert({
        type: "error",
        title: "Missing Student",
        description: "Please select a student.",
      });
      return;
    }

    if (!medicineName.trim()) {
      addAlert({
        type: "error",
        title: "Missing Medicine Name",
        description: "Please enter the medicine name.",
      });
      return;
    }

    try {
      setLoading(true);
      const imageUrl = await uploadToCloudinary(file);

      await sendingmedicine({
        studentId,
        medicineName,
        prescriptionImage: imageUrl,
        healthStatus,
        note,
      });

      addAlert({
        type: "success",
        title: "Submitted",
        description: "Medicine request sent successfully.",
      });

      onSuccess();

      setFile(null);
      setMedicineName("");
      setNote("");
      setHealthStatus("");
      onPreviewChange(false, "");
    } catch (error) {
      console.error("Error:", error);
      addAlert({
        type: "error",
        title: "Submission Failed",
        description: "Could not send medicine request. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-4"
    >
      <select
        value={studentId ?? ""}
        onChange={(e) => setStudentId(Number(e.target.value))}
        className="select select-bordered w-full"
      >
        {students.map((s) => (
          <option key={s.studentId} value={s.studentId}>
            {s.fullName} - {s.className}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Medicine Name"
        value={medicineName}
        onChange={(e) => setMedicineName(e.target.value)}
        className="input input-bordered w-full"
      />

      <input
        type="text"
        placeholder="Health Status"
        value={healthStatus}
        onChange={(e) => setHealthStatus(e.target.value)}
        className="input input-bordered w-full"
      />

      <textarea
        placeholder="Note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="textarea textarea-bordered w-full resize-none min-h-[100px] max-h-[200px]"
      />

      <div className="flex items-center gap-3">
        <label
          htmlFor="file-input"
          className="cursor-pointer rounded border border-gray-400 px-2 py-1 text-sm text-gray-700 hover:bg-gray-100"
        >
          Choose File
        </label>
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setFile(e.target.files[0]);
            }
          }}
          className="hidden"
        />
        {file && (
          <span className="text-gray-700 text-sm truncate max-w-xs">
            {file.name}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
