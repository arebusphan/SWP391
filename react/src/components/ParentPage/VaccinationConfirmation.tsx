import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { confirmVaccination, getPendingVaccinationConfirmations } from "@/service/serviceauth";
import { useAuth } from "@/context/AuthContext";

interface VaccinationEvent {
  notificationStudentId: number;
  notificationId: number;
  eventName: string;
  eventType: string;
  eventImage: string;
  eventDate: string;
  createdAt: string;
  createdBy: string;
  studentId: number;
  studentName: string;
  className: string;
}

export default function VaccinationList() {
  const [data, setData] = useState<VaccinationEvent[]>([]);
  const [selected, setSelected] = useState<VaccinationEvent | null>(null);
  const [reasonDialog, setReasonDialog] = useState<VaccinationEvent | null>(null);
  const [declineReason, setDeclineReason] = useState("");

  const { user } = useAuth();
  const parentPhone = user?.Phone || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPendingVaccinationConfirmations();
        setData(res);
      } catch (error) {
        console.error("Error fetching vaccination events:", error);
      }
    };
    fetchData();
  }, []);

  const handleAccept = async (item: VaccinationEvent) => {
    try {
      await confirmVaccination(item.notificationStudentId, "Confirmed", parentPhone);
      setData((prev) => prev.filter((d) => d.notificationStudentId !== item.notificationStudentId));
      alert(`✅ Đã xác nhận đồng ý tiêm cho học sinh ${item.studentName}`);
    } catch (error) {
      console.error("Lỗi khi xác nhận đồng ý:", error);
      alert("❌ Đã xảy ra lỗi khi xác nhận tiêm. Vui lòng thử lại.");
    }
  };

  const handleSubmitDecline = async () => {
    if (!reasonDialog) return;
    try {
      await confirmVaccination(
        reasonDialog.notificationStudentId,
        "Declined",
        parentPhone,
        declineReason
      );
      setData((prev) => prev.filter((d) => d.notificationStudentId !== reasonDialog.notificationStudentId));
      alert(`⚠️ Đã từ chối tiêm cho học sinh ${reasonDialog.studentName}`);
      setReasonDialog(null);
      setDeclineReason("");
    } catch (error) {
      console.error("Lỗi khi từ chối:", error);
      alert("❌ Đã xảy ra lỗi khi gửi lý do từ chối. Vui lòng thử lại.");
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-blue-700">Danh sách sự kiện tiêm chủng</h1>

        <div className="grid grid-cols-9 font-semibold text-sm text-gray-600 border-b pb-2">
          <div>Sự kiện</div>
          <div>Loại</div>
          <div>Ngày</div>
          <div>Tạo lúc</div>
          <div>Học sinh</div>
          <div>Lớp</div>
          <div className="text-center">Xem</div>
          <div className="text-center">Đồng ý</div>
          <div className="text-center">Từ chối</div>
        </div>

        {data.map((item, index) => (
          <div key={index} className="grid grid-cols-9 text-sm py-3 border-b items-center">
            <div>{item.eventName}</div>
            <div>{item.eventType}</div>
            <div>{new Date(item.eventDate).toLocaleDateString()}</div>
            <div>{new Date(item.createdAt).toLocaleDateString()}</div>
            <div>{item.studentName}</div>
            <div>{item.className}</div>
            <div className="flex justify-center">
              <Button variant="outline" size="sm" onClick={() => setSelected(item)}>
                Chi tiết
              </Button>
            </div>
            <div className="flex justify-center">
              <Button size="sm" onClick={() => handleAccept(item)}>
                Đồng ý
              </Button>
            </div>
            <div className="flex justify-center">
              <Button size="sm" variant="destructive" onClick={() => setReasonDialog(item)}>
                Từ chối
              </Button>
            </div>
          </div>
        ))}

        {/* View More Dialog */}
        <Dialog open={selected !== null} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-3xl w-full">
            <DialogTitle>Chi tiết sự kiện</DialogTitle>
            {selected && (
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-700 mt-4">
                <div>
                  <p className="font-semibold">Tên sự kiện:</p>
                  <p>{selected.eventName}</p>
                </div>
                <div>
                  <p className="font-semibold">Loại:</p>
                  <p>{selected.eventType}</p>
                </div>
                <div>
                  <p className="font-semibold">Ngày tổ chức:</p>
                  <p>{new Date(selected.eventDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-semibold">Ngày tạo:</p>
                  <p>{new Date(selected.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-semibold">Người tạo:</p>
                  <p>{selected.createdBy}</p>
                </div>
                <div>
                  <p className="font-semibold">Học sinh:</p>
                  <p>{selected.studentName}</p>
                </div>
                <div>
                  <p className="font-semibold">Lớp:</p>
                  <p>{selected.className}</p>
                </div>
                <div className="col-span-2 mt-4">
                  <img
                    src={selected.eventImage}
                    alt="Sự kiện"
                    className="w-full rounded-md border max-h-[400px] object-cover"
                  />
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Decline Reason Dialog */}
        <Dialog open={reasonDialog !== null} onOpenChange={() => setReasonDialog(null)}>
          <DialogContent className="max-w-xl w-full">
            <DialogTitle>Lý do từ chối</DialogTitle>
            <DialogDescription>
              Vui lòng nhập lý do bạn không đồng ý tiêm vaccine cho học sinh.
            </DialogDescription>
            <textarea
              placeholder="Nhập lý do..."
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              className="w-full h-40 mt-2 p-3 border rounded-md resize-none"
            />
            <div className="flex justify-end mt-4">
              <Button onClick={handleSubmitDecline}>Gửi lý do</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
