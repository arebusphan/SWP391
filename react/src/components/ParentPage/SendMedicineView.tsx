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
  status: string;
  createdAt: string;
}

export default function SendMedicineView() {
  const [openSendMedicineDialog, setOpenSendMedicineDialog] = useState(false);
  const [requests, setRequests] = useState<MedicationRequest[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [openLogDialog, setOpenLogDialog] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<number>(0);

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

  const handleViewLog = (requestId: number, studentId: number) => {
    setSelectedRequestId(requestId);
    setSelectedStudentId(studentId);
    setOpenLogDialog(true);
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
        <DialogContent>
          <DialogTitle>Send Medicine</DialogTitle>
          <DialogDescription>Send medicine to user</DialogDescription>
          <SendMedicineForm
            onSuccess={() => {
              setOpenSendMedicineDialog(false);
              refreshRequests();
            }}
          />
        </DialogContent>
      </Dialog>

      <h2 className="text-xl font-bold mb-4">Medication Request History</h2>

      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Medicine</th>
              <th className="p-3">Image</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created At</th>
              <th className="p-3">Log</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-5">
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
                    <Button
                      variant="outline"
                      onClick={() => handleViewLog(req.requestId, req.studentId)}
                    >
                      View History
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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

      <ViewMedicationHistory
        open={openLogDialog}
        onClose={() => setOpenLogDialog(false)}
        requestId={selectedRequestId}
        studentId={selectedStudentId}
      />
    </div>
  );
}
