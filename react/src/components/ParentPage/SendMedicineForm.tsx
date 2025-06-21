import { useState, useEffect } from "react";
import {
  sendingmedicine,
  uploadToCloudinary,
  getstudentid,
} from "../../service/serviceauth";

export default function SendMedicineForm({
  onSuccess,
  onPreviewChange,
}: {
  onSuccess: () => void;
  onPreviewChange: (preview: boolean, url?: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [students, setStudents] = useState<
    { studentId: number; fullName: string; className: string }[]
  >([]);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [medicineName, setMedicineName] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [healthStatus, setHealthStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Load học sinh
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
        console.error("Lỗi khi lấy học sinh:", err);
        alert("Không thể tải danh sách học sinh.");
      }
    };
    fetchStudents();
  }, []);

  // Xem trước ảnh
  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      onPreviewChange(false, "");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    onPreviewChange(true, objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Chưa chọn file");
    if (!studentId) return alert("Chưa chọn học sinh");
    if (!medicineName.trim()) return alert("Chưa nhập tên thuốc");

    try {
      setLoading(true);
      const imageUrl = await uploadToCloudinary(file);

      // Gửi API với đầy đủ dữ liệu
      await sendingmedicine({
        studentId,
        medicineName,
        prescriptionImage: imageUrl,
        healthStatus,
        note,
      });

      alert("Gửi thành công");
      onSuccess();

      // Reset form
      setFile(null);
      setPreviewUrl("");
      setMedicineName("");
      setNote("");
      setHealthStatus("");
      onPreviewChange(false, "");
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Gửi thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col lg:flex-row gap-6 w-full items-center min-h-[420px]"
    >
      {/* Form bên trái */}
      <div className="w-[400px] shrink-0 flex flex-col gap-4">
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
          className="textarea textarea-bordered w-full resize-none overflow-y-auto min-h-[100px] max-h-[200px]"
        />

        <div className="flex items-center gap-3">
          <label
            htmlFor="file-input"
            className="inline-block cursor-pointer rounded border border-gray-400 px-2 py-1 text-sm text-gray-700 hover:bg-gray-100"
          >
            Chọn file
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
          {loading ? "Đang gửi..." : "Send"}
        </button>
      </div>

      {/* Preview ảnh bên phải */}
      {previewUrl && (
        <div className="w-[300px] h-auto border border-gray-300 rounded overflow-hidden">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-auto object-contain"
            style={{ maxHeight: "400px" }}
          />
        </div>
      )}
    </form>
  );
}
