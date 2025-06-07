import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadExcelFile } from "../../service/serviceauth";

export default function AddFileForm({ onSuccess }: { onSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Chưa chọn file");

    try {
      await uploadExcelFile(file);
      alert("Upload thành công");
      onSuccess(); // gọi hàm để update UI nếu cần
    } catch (error) {
      console.error(error);
      alert("Upload thất bại");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Drag and drop zone */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-400 p-6 text-center rounded-md cursor-pointer hover:bg-gray-100"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Thả file vào đây...</p>
        ) : (
          <p>Kéo & thả file Excel vào đây, hoặc click để chọn</p>
        )}
      </div>

      {/* Optional: Show selected file name */}
      {file && (
        <div className="text-sm text-gray-600 text-center">
          📄 Đã chọn: <strong>{file.name}</strong>
        </div>
      )}

      {/* Upload button */}
      <button type="submit" className="btn btn-primary">
        Upload
      </button>
    </form>
  );
}
