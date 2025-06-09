import { useState, useEffect } from "react";
import { sendingmedicine, getstudentid, uploadToCloudinary } from "../../service/serviceauth";

export default function AddMedicineFileForm({ onSuccess }: { onSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [studentId, setStudentId] = useState<number | null>(null);
  const [medicineName, setMedicineName] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchStudentId() {
      try {
        const response = await getstudentid();
        if (response.data && response.data.length > 0) {
          setStudentId(response.data[0].studentId);
        }
      } catch (error) {
        console.error("Lỗi lấy studentId:", error);
      }
    }
    fetchStudentId();
  }, []);

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
    if (!studentId) return alert("Chưa có studentId");
    if (!medicineName.trim()) return alert("Chưa nhập medicineName");

    try {
      setLoading(true);

      const imageUrl = await uploadToCloudinary(file);
      console.log("✅ URL ảnh từ Cloudinary:", imageUrl);
console.log("🔹 Dữ liệu sẽ gửi đi:");
    console.log("studentId:", studentId);
    console.log("medicineName:", medicineName);
    console.log("imageUrl:", imageUrl);
    
      const res = await sendingmedicine(studentId, medicineName, imageUrl);

      console.log("Phản hồi từ backend:", res);
      alert("Gửi thành công");
      onSuccess();

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
      <input
        type="text"
        placeholder="Medicine Name"
        value={medicineName}
        onChange={(e) => setMedicineName(e.target.value)}
        className="input input-bordered"
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
        {file && <span className="text-gray-700 text-sm truncate max-w-xs">{file.name}</span>}
      </div>

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

      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? "Đang gửi..." : "Send"}
      </button>
    </form>
  );
}
