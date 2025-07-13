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
import AlertNotification from "../MedicalStaffPage/AlertNotification";
import type { AlertItem } from "@/components/MedicalStaffPage/AlertNotification";
let nextId = 1;

interface MedicationRequest {
  requestId: number;
  studentId: number;
  studentName: string;
  medicineName: string;
  prescriptionImage: string;
  healthStatus: string;
  note: string;
  status: string;
  rejectReason?: string;
  createdAt: string;
}

export default function SendMedicineView() {
  const [openSendMedicineDialog, setOpenSendMedicineDialog] = useState(false);
  const [requests, setRequests] = useState<MedicationRequest[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
    null
  );
  const [selectedStudentId, setSelectedStudentId] = useState<number>(0);
  const [hasPreviewImage, setHasPreviewImage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const addAlert = (alert: Omit<AlertItem, "id">) => {
    const newAlert = { ...alert, id: nextId++ };
    setAlerts((prev) => [...prev, newAlert]);
  };

  const removeAlert = (id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const pageSize = 5;

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
    setOpenHistoryDialog(true);
  };

  const filteredRequests = requests.filter((req) => {
    const lowerTerm = searchTerm.toLowerCase();
    const matchText =
      req.medicineName.toLowerCase().includes(lowerTerm) ||
      req.note.toLowerCase().includes(lowerTerm) ||
      req.healthStatus.toLowerCase().includes(lowerTerm) ||
      req.status.toLowerCase().includes(lowerTerm) ||
      new Date(req.createdAt).toLocaleString().toLowerCase().includes(lowerTerm);

    const matchStatus =
      statusFilter === "All" || req.status.toLowerCase() === statusFilter.toLowerCase();

    return matchText && matchStatus;
  });

  const totalPages = Math.ceil(filteredRequests.length / pageSize);
  const pagedRequests = filteredRequests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-[16px] md:text-[17px]">
          <h2 className="text-3xl font-bold text-blue-900 text-center drop-shadow-md mb-3">Medication Request History</h2>


      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div className="flex flex-row gap-3 w-full md:w-auto">
          <div className="flex flex-col w-[220px]"> 
                      <label className="text-sm text-blue-900 drop-shadow">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search..."
              className="border rounded px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col w-[180px]">
                      <label className="text-sm text-blue-900 drop-shadow">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
              <option value="Administered">Administered</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="invisible text-sm">Send</label>
          <Button
            className="flex items-center bg-blue-900 hover:bg-blue-900 text-white px-5 py-2.5 rounded-lg shadow-md transition-transform hover:scale-105"
            onClick={() => setOpenSendMedicineDialog(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Send Medicine
          </Button>
        </div>
      </div>

      <Dialog open={openSendMedicineDialog} onOpenChange={setOpenSendMedicineDialog}>
        <DialogContent className="!p-8 !max-w-4xl animate-fade-in">
          <div className="flex flex-row items-start gap-8">
            <div className="flex flex-col gap-4 w-[420px]">
              <DialogTitle className="text-2xl font-semibold text-blue-900">Send Medicine</DialogTitle>
              <DialogDescription className="text-gray-600">Provide medicine request details</DialogDescription>
              <SendMedicineForm
                onSuccess={() => {
                  setOpenSendMedicineDialog(false);
                  setCurrentPage(1);
                  refreshRequests();
                }}
                onPreviewChange={(preview, url) => {
                  setHasPreviewImage(preview);
                  setPreviewUrl(url || "");
                }}
                addAlert={addAlert}
              />
            </div>

            {hasPreviewImage && previewUrl && (
              <div className="w-[320px] min-h-[440px] flex items-center justify-center border border-gray-300 rounded-xl overflow-hidden shadow-md">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="object-contain max-h-[420px] w-full"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow border border-gray-200">
        <table className="w-full text-base text-left border-collapse">
                  <thead className="bg-blue-900 text-white text-[15px] drop-shadow">
                      <tr>
                          <th className="p-4">Student</th>
                          <th className="p-4">Medicine</th>
                          <th className="p-4">Image</th>
                          <th className="p-4">Health Status</th>
                          <th className="p-4">Note</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Created At</th>
                          <th className="p-4 w-[240px]">Details</th>
                      </tr>
                  </thead>

                  <tbody className="bg-white">
                      {pagedRequests.length === 0 ? (
                          <tr>
                              <td colSpan={8} className="text-center p-6 text-gray-500 text-lg">
                                  No requests found.
                              </td>
                          </tr>
                      ) : (
                          pagedRequests.map((req) => {
                              const canViewHistory = ["Approved", "Injected", "Administered"].includes(req.status);
                              return (
                                  <tr
                                      key={req.requestId}
                                      className="border-t hover:bg-blue-50 transition duration-200 ease-in-out"
                                  >
                                      <td className="p-4 align-top font-medium">{req.studentName}</td>
                                      <td className="p-4 align-top">{req.medicineName}</td>
                                      <td className="p-4 align-top">
                                          <img
                                              src={req.prescriptionImage}
                                              alt="prescription"
                                              className="w-16 h-16 object-cover rounded-lg cursor-pointer transition-transform duration-300 hover:scale-110 ring-2 ring-blue-400"
                                              onClick={() => setSelectedImage(req.prescriptionImage)}
                                          />
                                      </td>
                                      <td className="p-4 align-top">{req.healthStatus}</td>
                                      <td className="p-4 align-top">{req.note}</td>
                                      <td className="p-4 align-top">
                                          <span
                                              className={`px-3 py-1 rounded-full text-white text-sm font-semibold drop-shadow ${req.status === "Pending"
                                                      ? "bg-yellow-500"
                                                      : req.status === "Approved"
                                                          ? "bg-green-500"
                                                          : req.status === "Injected"
                                                              ? "bg-blue-900"
                                                              : req.status === "Administered"
                                                                  ? "bg-blue-900"
                                                                  : "bg-red-500"
                                                  }`}
                                          >
                                              {req.status}
                                          </span>
                                      </td>
                                      <td className="p-4 align-top text-gray-700">
                                          {new Date(req.createdAt).toLocaleString()}
                                      </td>
                                      <td className="p-4 w-[240px] align-top">
                                          {canViewHistory ? (
                                              <Button
                                                  variant="outline"
                                                  onClick={() => handleViewHistory(req.requestId, req.studentId)}
                                                  className="hover:scale-[1.03] transition-transform"
                                              >
                                                  View History
                                              </Button>
                                          ) : req.status === "Rejected" && req.rejectReason ? (
                                              <div className="text-sm whitespace-pre-line break-words">
                                                  <span className="font-semibold">Reason:</span> {req.rejectReason}
                                              </div>
                                          ) : (
                                              <span className="text-gray-400 italic">—</span>
                                          )}
                                      </td>
                                  </tr>
                              );
                          })
                      )}
                  </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="!max-w-[70vw] !max-h-[70vh] p-0 overflow-hidden">
          <div className="relative w-full h-full flex justify-center items-center bg-black">
            <img
              src={selectedImage ?? ""}
              alt="Zoomed Prescription"
              className="object-contain w-full h-full max-w-full max-h-full transition-opacity duration-300"
              style={{ maxHeight: "70vh", maxWidth: "70vw" }}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-white text-3xl font-bold bg-black bg-opacity-60 rounded-full px-3 py-1 hover:bg-opacity-90"
            >
              ×
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <ViewMedicationHistory
        open={openHistoryDialog}
        onClose={() => setOpenHistoryDialog(false)}
        requestId={selectedRequestId}
        studentId={selectedStudentId}
      />

      {/* ✅ Alert Notification */}
      <AlertNotification alerts={alerts} onRemove={removeAlert} />
    </div>
  );
}
