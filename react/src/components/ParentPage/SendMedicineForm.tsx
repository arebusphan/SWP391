import { useState, useEffect } from "react";
import { sendingmedicine, uploadToCloudinary, getstudentid } from "../../service/serviceauth";

export default function AddMedicineFileForm({ onSuccess }: { onSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [students, setStudents] = useState<{ studentId: number; fullName: string }[]>([]);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [medicineName, setMedicineName] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Load danh sách học sinh từ API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await getstudentid();
        const studentList = res.data || [];
        setStudents(studentList);
        if (studentList.length > 0) {
          setStudentId(studentList[0].studentId); // chọn mặc định
        }
      } catch (err) {
        console.error("Lỗi khi lấy học sinh:", err);
        alert("Không thể tải danh sách học sinh.");
      }
    };

    fetchStudents();
  }, []);

  // Load ảnh xem trước
  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return alert("Chưa chọn file");
    if (!studentId) return alert("Chưa chọn học sinh");
    if (!medicineName.trim()) return alert("Chưa nhập tên thuốc");

    try {
      setLoading(true);

      const imageUrl = await uploadToCloudinary(file);
      console.log("✅ URL ảnh từ Cloudinary:", imageUrl);
      console.log("🔹 Dữ liệu sẽ gửi đi:", { studentId, medicineName, imageUrl });

      await sendingmedicine(studentId, medicineName, imageUrl);

      alert("Gửi thành công");
      onSuccess();

      // Reset form
      setFile(null);
      setPreviewUrl("");
      setMedicineName("");
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Gửi thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Select học sinh */}
      <select
        value={studentId ?? ""}
        onChange={(e) => setStudentId(Number(e.target.value))}
        className="select select-bordered w-full"
      >
        {students.map((s) => (
          <option key={s.studentId} value={s.studentId}>
            {s.fullName}
          </option>
        ))}
      </select>

      {/* Nhập tên thuốc */}
      <input
        type="text"
        placeholder="Medicine Name"
        value={medicineName}
        onChange={(e) => setMedicineName(e.target.value)}
        className="input input-bordered w-full"
      />

      {/* Chọn file ảnh */}
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
        {file && <span className="text-gray-700 text-sm truncate max-w-xs">{file.name}</span>}
      </div>

      {/* Xem trước ảnh */}
      {previewUrl && (
        <div className="w-full max-h-[400px] overflow-hidden border border-gray-300 rounded">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-auto object-contain"
            style={{ maxHeight: "400px" }}
          />
        </div>
      )}

      {/* Nút gửi */}
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? "Đang gửi..." : "Send"}
      </button>
    </form>
  );
}
