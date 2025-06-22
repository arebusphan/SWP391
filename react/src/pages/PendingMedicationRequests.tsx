// src/pages/PendingMedicationRequests.tsx
import { useEffect, useState } from "react";
import {
  getMedicationRequestsForNurse,
  getApprovedMedicationRequests,
  updateMedicationStatus,
  createMedicationIntakeLog,
} from "../service/serviceauth";
import { jwtDecode } from "jwt-decode";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ViewMedicationHistory from "@/components/ParentPage/ViewMedicationHistory";

// Types

type MedicationRequest = {
  requestId: number;
  studentId: number;
  studentName: string;
  medicineName: string;
  prescriptionImage: string;
  healthStatus: string;
  note: string;
  createdAt: string;
  status: "Pending" | "Approved" | "Rejected";
  rejectReason: string;
};

const REJECTION_REASONS = [
  "Medication does not match prescription",
  "Invalid prescription",
  "Prescription has expired",
  "Dosage not specified",
];

export default function PendingMedicationRequests() {
  const [pendingRequests, setPendingRequests] = useState<MedicationRequest[]>([]);
  const [approvedRequests, setApprovedRequests] = useState<MedicationRequest[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [customReason, setCustomReason] = useState("");
  const [logDialogRequest, setLogDialogRequest] = useState<MedicationRequest | null>(null);
  const [logNotes, setLogNotes] = useState("");
  const [givenByName, setGivenByName] = useState("");
  const [historyDialogRequest, setHistoryDialogRequest] = useState<MedicationRequest | null>(null);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const pendingRes = await getMedicationRequestsForNurse();
        setPendingRequests(pendingRes.data.filter((r: MedicationRequest) => r.status === "Pending"));

        const approvedRes = await getApprovedMedicationRequests();
        setApprovedRequests(approvedRes.data);
      } catch (error) {
        alert("Failed to load medication requests.");
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, []);

  const handleApprove = async (request: MedicationRequest) => {
    try {
      const token = localStorage.getItem("token");
      const decoded: any = jwtDecode(token!);
      const reviewedBy = parseInt(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);
      const res = await updateMedicationStatus(request.requestId, "Approved", reviewedBy);
      if (res.status === 200) {
        setPendingRequests(prev => prev.filter(r => r.requestId !== request.requestId));
        setApprovedRequests(prev => [...prev, { ...request, status: "Approved" }]);
      } else {
        throw new Error("Unexpected response");
      }
    } catch (err: any) {
      alert("Failed to approve request. " + (err?.response?.data || err.message));
    }
  };

  const confirmReject = async () => {
    const finalReason = [...selectedReasons.filter(r => r !== "Other"), customReason.trim()]
      .filter(Boolean)
      .join(", ");
    if (!finalReason) return alert("Please enter at least one reason.");

    try {
      const token = localStorage.getItem("token");
      const decoded: any = jwtDecode(token!);
      const reviewedBy = parseInt(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);
      const res = await updateMedicationStatus(rejectingId!, "Rejected", reviewedBy, finalReason);
      if (res.status === 200) {
        setPendingRequests(prev => prev.filter(r => r.requestId !== rejectingId));
        setRejectingId(null);
      } else {
        throw new Error("Unexpected response");
      }
    } catch (err: any) {
      alert("Failed to reject request. " + (err?.response?.data || err.message));
    }
  };

  const confirmLog = async () => {
    if (!logDialogRequest || !logNotes.trim() || !givenByName.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await createMedicationIntakeLog({
        requestId: logDialogRequest.requestId,
        studentId: logDialogRequest.studentId,
        givenBy: givenByName,
        notes: logNotes,
      });
      alert("Medication intake recorded.");
      setLogDialogRequest(null);
    } catch {
      alert("Failed to log intake.");
    }
  };

  const markAsAdministered = async (requestId: number) => {
    try {
      const token = localStorage.getItem("token");
      const decoded: any = jwtDecode(token!);
      const reviewedBy = parseInt(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);
      const res = await updateMedicationStatus(requestId, "Administered", reviewedBy);
      if (res.status === 200) {
        setApprovedRequests(prev => prev.filter(r => r.requestId !== requestId));
      } else {
        throw new Error("Unexpected response");
      }
    } catch (err: any) {
      alert("Failed to update status. " + (err?.response?.data || err.message));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">Medication Request List</h2>

      {/* Dialog: Prescription */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="!max-w-4xl">
          <img src={selectedImage || ""} className="w-full rounded" />
        </DialogContent>
      </Dialog>

      {/* Dialog: Rejection */}
      <Dialog open={rejectingId !== null} onOpenChange={() => setRejectingId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rejection Reasons</DialogTitle>
          </DialogHeader>
          {REJECTION_REASONS.map(reason => (
            <label key={reason} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedReasons.includes(reason)}
                onChange={(e) =>
                  setSelectedReasons(prev =>
                    e.target.checked ? [...prev, reason] : prev.filter(r => r !== reason)
                  )
                }
              />
              {reason}
            </label>
          ))}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedReasons.includes("Other")}
              onChange={(e) => {
                setSelectedReasons(prev =>
                  e.target.checked ? [...prev, "Other"] : prev.filter(r => r !== "Other")
                );
                if (!e.target.checked) setCustomReason("");
              }}
            />
            Other
          </label>
          {selectedReasons.includes("Other") && (
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="w-full p-2 border rounded resize-none"
              rows={4}
            />
          )}
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setRejectingId(null)}>Cancel</Button>
            <Button className="bg-red-600 text-white" onClick={confirmReject}>Confirm Rejection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Intake Log */}
      <Dialog open={!!logDialogRequest} onOpenChange={() => setLogDialogRequest(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record Medication Intake</DialogTitle>
          </DialogHeader>
          <p>Student: {logDialogRequest?.studentName}</p>
          <p>Medicine: {logDialogRequest?.medicineName}</p>
          <input
            type="text"
            value={givenByName}
            onChange={(e) => setGivenByName(e.target.value)}
            placeholder="Given by (name)"
            className="w-full p-2 border rounded mb-2"
          />
          <textarea
            value={logNotes}
            onChange={(e) => setLogNotes(e.target.value)}
            placeholder="Notes..."
            className="w-full p-2 border rounded resize-none"
            rows={4}
          />
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setLogDialogRequest(null)}>Cancel</Button>
            <Button className="bg-green-600 text-white" onClick={confirmLog}>Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: History */}
      <ViewMedicationHistory
        open={!!historyDialogRequest}
        onClose={() => setHistoryDialogRequest(null)}
        requestId={historyDialogRequest?.requestId ?? null}
        studentId={historyDialogRequest?.studentId ?? 0}
      />

      {/* Pending Table */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold text-blue-600 mb-2">Pending Requests</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Student</th>
                <th className="p-2 border">Medicine</th>
                <th className="p-2 border">Note</th>
                <th className="p-2 border">Prescription</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map((r) => (
                <tr key={r.requestId}>
                  <td className="p-2 border">{r.studentName}</td>
                  <td className="p-2 border">{r.medicineName}</td>
                  <td className="p-2 border">{r.note || "—"}</td>
                  <td className="p-2 border">
                    {r.prescriptionImage ? (
                      <img
                        src={r.prescriptionImage}
                        className="w-10 h-10 object-cover rounded cursor-pointer"
                        onClick={() => setSelectedImage(r.prescriptionImage)}
                      />
                    ) : "—"}
                  </td>
                  <td className="p-2 border space-x-2">
                    <Button onClick={() => handleApprove(r)} className="bg-green-600 text-white text-xs rounded-full">Approve</Button>
                    <Button onClick={() => setRejectingId(r.requestId)} className="bg-red-600 text-white text-xs rounded-full">Reject</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Approved Table */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold text-green-600 mb-2">Approved Requests</h3>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Student</th>
              <th className="p-2 border">Medicine</th>
              <th className="p-2 border">Note</th>
              <th className="p-2 border">Prescription</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {approvedRequests.map((r) => (
              <tr key={r.requestId}>
                <td className="p-2 border">{r.studentName}</td>
                <td className="p-2 border">{r.medicineName}</td>
                <td className="p-2 border">{r.note || "—"}</td>
                <td className="p-2 border">
                  {r.prescriptionImage ? (
                    <img
                      src={r.prescriptionImage}
                      className="w-10 h-10 object-cover rounded cursor-pointer"
                      onClick={() => setSelectedImage(r.prescriptionImage)}
                    />
                  ) : "—"}
                </td>
                <td className="p-2 border space-x-2">
                  <Button onClick={() => setHistoryDialogRequest(r)} className="bg-blue-600 text-white text-xs rounded-full">History</Button>
                  <Button onClick={() => setLogDialogRequest(r)} className="bg-green-600 text-white text-xs rounded-full">Give</Button>
                  <Button onClick={() => markAsAdministered(r.requestId)} className="bg-gray-700 text-white text-xs rounded-full">Done</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}