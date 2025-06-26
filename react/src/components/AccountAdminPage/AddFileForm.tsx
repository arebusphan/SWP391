import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { uploadExcelFile } from "../../service/serviceauth";

export default function AddFileForm({ onSuccess }: { onSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Chưa chọn file");

    try {
      const response = await uploadExcelFile(file);
      const result = response.data;

      if (result.errorFileUrl) {
        const confirmed = window.confirm(
          "⚠️ Một số dòng bị lỗi.\nBạn có muốn tải file lỗi về không?"
        );
        if (confirmed) {
          const link = document.createElement("a");
          link.href = `${window.location.origin}${result.errorFileUrl}`;
          link.download = "import_errors.xlsx";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
        alert("✅ Upload thành công!");
      }

      onSuccess();
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (error) {
      console.error(error);
      alert("❌ Upload thất bại");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-xl mx-auto">
      {/* Header + Download link */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Upload file to add multiple users</h2>
        <a href="/template/import_users_example.xlsx" download>
          <Button type="button" variant="outline" className="text-sm">
            📥 Tải file mẫu
          </Button>
        </a>
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Button chọn file */}
      <div className="flex gap-2 items-center">
        <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()}>
          Chọn file Excel
        </Button>

        {file && (
          <div className="flex items-center gap-2 text-sm text-gray-700 border px-3 py-1 rounded-md">
            📄 {file.name}
            <button
              type="button"
              onClick={handleRemoveFile}
              className="text-red-500 hover:underline"
            >
              ❌ Xoá
            </button>
          </div>
        )}
      </div>

      {/* Upload button */}
      <Button type="submit" disabled={!file}>
        Upload
      </Button>
    </form>
  );
}
