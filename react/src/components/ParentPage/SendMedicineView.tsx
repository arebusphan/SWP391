// src/components/SendMedicine/SendMedicineView.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import SendMedicineForm from "./SendMedicineForm";
import ViewMedicationHistory from "./ViewMedicationHistory";
import { getMedicationRequestHistory } from "../../service/serviceauth";

interface MedicationRequest {
  requestId: number;
  studentId: number;
  studentName: string;
  medicineName: string;
  prescriptionImage: string;
  healthStatus: string;
  note: string;
  status: string;
  declineReason?: string;
  createdAt: string;
}

export default function SendMedicineView() {
  const [openSendMedicineDialog, setOpenSendMedicineDialog] = useState(false);
  const [requests, setRequests] = useState<MedicationRequest[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [openLogDialog, setOpenLogDialog] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<number>(0);
  const [hasPreviewImage, setHasPreviewImage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [openDeclineDialog, setOpenDeclineDialog] = useState(false);
  const [declineReason, setDeclineReason] = useState<string>("");

  const refreshRequests = () => {
    getMedicationRequestHistory().then((res) => {
      const sorted = res.data.sort(
        (a: MedicationRequest, b: MedicationRequest) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRequests(sorted);
    });
  };

  useEffect(() => {
    refreshRequests();
  }, []);

  const handleViewHistory = (requestId: number, studentId: number) => {
    setSelectedRequestId(requestId);
    setSelectedStudentId(studentId);
    setOpenLogDialog(true);
  };

  const handleViewDeclineReason = (reason: string) => {
    setDeclineReason(reason);
    setOpenDeclineDialog(true);
  };

  return (
    <div className="p-5">
      <div className="flex justify-end mb-10">
        <Button
          className="flex items-center"
          onClick={() => setOpenSendMedicineDialog(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Send Medicine
        </Button>
      </div>

      <Dialog open={openSendMedicineDialog} onOpenChange={setOpenSendMedicineDialog}>
        <DialogContent className="!p-6 !max-w-fit">
          <div className="flex flex-row items-start gap-6">
            <div className="flex flex-col gap-2 w-[400px]">
              <DialogTitle>Send Medicine</DialogTitle>
              <DialogDescription>Send medicine to user</DialogDescription>
              <SendMedicineForm
                onSuccess={() => {
                  setOpenSendMedicineDialog(false);
                  refreshRequests();
                }}
                onPreviewChange={(preview, url) => {
                  setHasPreviewImage(preview);
                  setPreviewUrl(url || "");
                }}
              />
            </div>

            {hasPreviewImage && previewUrl && (
              <div className="w-[300px] min-h-[420px] flex items-center justify-center border border-gray-300 rounded overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="object-contain max-h-[400px] w-full"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <h2 className="text-xl font-bold mb-4">Medication Request History</h2>

      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Medicine</th>
              <th className="p-3">Image</th>
              <th className="p-3">Initial Health</th>
              <th className="p-3">Note</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created At</th>
              <th className="p-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-5">
                  No requests found.
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req.requestId} className="border-t hover:bg-gray-50">
                  <td className="p-3">{req.medicineName}</td>
                  <td className="p-3">
                    <img
                      src={req.prescriptionImage}
                      alt="prescription"
                      className="w-20 h-20 object-cover rounded cursor-pointer transition-transform duration-200 hover:scale-105"
                      onClick={() => setSelectedImage(req.prescriptionImage)}
                    />
                  </td>
                  <td className="p-3">{req.healthStatus}</td>
                  <td className="p-3">{req.note}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        req.status === "Pending"
                          ? "bg-yellow-500"
                          : req.status === "Approved"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {new Date(req.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3">
                    {req.status === "Approved" ? (
                      <Button
                        variant="outline"
                        onClick={() => handleViewHistory(req.requestId, req.studentId)}
                      >
                        View History
                      </Button>
                    ) : req.status === "Rejected" && req.declineReason ? (
                      <Button
                        variant="destructive"
                        onClick={() => handleViewDeclineReason(req.declineReason!)}
                      >
                        View Reason
                      </Button>
                    ) : (
                      <span className="text-gray-400 italic">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Dialog zoom ảnh */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="!max-w-[70vw] !max-h-[70vh] p-0 overflow-hidden">
          <div className="relative w-full h-full flex justify-center items-center bg-black">
            <img
              src={selectedImage ?? ""}
              alt="Zoomed Prescription"
              className="object-contain w-full h-full max-w-full max-h-full"
              style={{ maxHeight: "70vh", maxWidth: "70vw" }}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-white text-2xl font-bold bg-black bg-opacity-60 rounded-full px-3 py-1 hover:bg-opacity-90"
            >
              ×
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog xem lịch sử uống thuốc */}
      <ViewMedicationHistory
        open={openLogDialog}
        onClose={() => setOpenLogDialog(false)}
        requestId={selectedRequestId}
        studentId={selectedStudentId}
      />

      {/* Dialog lý do từ chối */}
      <Dialog open={openDeclineDialog} onOpenChange={setOpenDeclineDialog}>
        <DialogContent className="max-w-md">
          <DialogTitle>Reason for Rejection</DialogTitle>
          <p className="text-sm text-gray-700 whitespace-pre-line mt-2">
            {declineReason}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
