// src/components/SendMedicine/ViewMedicationHistory.tsx
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getMedicationIntakeLogs } from "@/service/serviceauth"; // 👈 nhập hàm bạn vừa tạo

type MedicationLog = {
  logId: number;
  requestId: number;
  studentId: number;
  intakeTime: string;
  givenBy: string;
  notes: string | null;
};

export default function ViewMedicationHistory({
  open,
  onClose,
  requestId,
  studentId,
}: {
  open: boolean;
  onClose: () => void;
  requestId: number | null;
  studentId: number;
}) {
  const [logs, setLogs] = useState<MedicationLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open || !studentId) return;

    const fetchLogs = async () => {
      setLoading(true);
      try {
        const data = await getMedicationIntakeLogs(studentId);
        const filtered = requestId
          ? data.filter((log: MedicationLog) => log.requestId === requestId)
          : data;
        setLogs(filtered);
      } catch (error) {
        console.error("Lỗi khi lấy medication logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [studentId, requestId, open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Medication History</DialogTitle>

        {loading ? (
          <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
        ) : logs.length === 0 ? (
          <p className="text-sm text-gray-500">Chưa có log nào.</p>
        ) : (
          <ul className="mt-4 space-y-2 max-h-[300px] overflow-auto text-sm">
            {logs.map((log) => (
              <li
                key={log.logId}
                className="border p-2 rounded bg-gray-50"
              >
                <p>
                  <strong>Time:</strong>{" "}
                  {new Date(log.intakeTime).toLocaleString()}
                </p>
                <p>
                  <strong>Given By:</strong> {log.givenBy}
                </p>
                <p>
                  <strong>Note:</strong> {log.notes || "(Không có ghi chú)"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
