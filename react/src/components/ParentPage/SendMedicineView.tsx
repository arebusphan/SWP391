import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription } from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import SendMedicineForm from "./SendMedicineForm";
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

  useEffect(() => {
    getMedicationRequestHistory().then((res) => setRequests(res.data));
  }, []);

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
          <SendMedicineForm onSuccess={() => setOpenSendMedicineDialog(false)} />
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
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-5">
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Zoomed Image Overlay */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center transition-opacity duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-[60vw] max-h-[60vh] scale-100 transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Zoomed Prescription"
              className="w-full h-full object-contain rounded shadow-2xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-white text-xl font-bold bg-black bg-opacity-50 rounded-full px-3 py-1 hover:bg-opacity-80"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
