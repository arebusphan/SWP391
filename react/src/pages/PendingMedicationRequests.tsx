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
  const [confirmDialog, setConfirmDialog] = useState<{
    type: "approve" | "done" | null;
    request: MedicationRequest | null;
  }>({ type: null, request: null });

  useEffect(() => {
    async function fetchRequests() {
      try {
        const pendingRes = await getMedicationRequestsForNurse();
        setPendingRequests(pendingRes.data.filter((r: MedicationRequest) => r.status === "Pending"));

        const approvedRes = await getApprovedMedicationRequests();
        setApprovedRequests(approvedRes.data);
      } catch {
        alert("Failed to load medication requests.");
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, []);

  const getReviewerId = () => {
    const token = localStorage.getItem("token");
    const decoded: any = jwtDecode(token!);
    return parseInt(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);
  };

  const confirmAction = () => {
    if (!confirmDialog.request || !confirmDialog.type) return;
    const { request } = confirmDialog;
    const reviewedBy = getReviewerId();

    if (confirmDialog.type === "approve") {
      updateMedicationStatus(request.requestId, "Approved", reviewedBy)
        .then((res) => {
          if (res.status === 200) {
            setPendingRequests((prev) => prev.filter((r) => r.requestId !== request.requestId));
            setApprovedRequests((prev) => [...prev, { ...request, status: "Approved" }]);
          } else throw new Error();
        })
        .catch((err) => alert("Failed to approve. " + err.message));
    }

    if (confirmDialog.type === "done") {
      updateMedicationStatus(request.requestId, "Administered", reviewedBy)
        .then((res) => {
          if (res.status === 200) {
            setApprovedRequests((prev) => prev.filter((r) => r.requestId !== request.requestId));
          } else throw new Error();
        })
        .catch((err) => alert("Failed to mark done. " + err.message));
    }

    setConfirmDialog({ type: null, request: null });
  };

  const confirmReject = () => {
    const finalReason = [...selectedReasons.filter(r => r !== "Other"), customReason.trim()]
      .filter(Boolean)
      .join(", ");
    if (!finalReason) return alert("Please enter at least one reason.");

    const reviewedBy = getReviewerId();
    updateMedicationStatus(rejectingId!, "Rejected", reviewedBy, finalReason)
      .then((res) => {
        if (res.status === 200) {
          setPendingRequests((prev) => prev.filter((r) => r.requestId !== rejectingId));
          setRejectingId(null);
        } else {
          throw new Error("Unexpected response");
        }
      })
      .catch((err) => {
        alert("Failed to reject request. " + (err?.response?.data || err.message));
      });
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

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10 animate-fade-in">
      <h2 className="text-3xl font-extrabold text-blue-700 tracking-tight mb-6">
        📋 Medication Request List
      </h2>

      {/* Confirm Dialog (Approve / Done) */}
      <Dialog open={!!confirmDialog.type} onOpenChange={() => setConfirmDialog({ type: null, request: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-yellow-600">
              {confirmDialog.type === "approve" ? "✅ Confirm Approval" : "📝 Confirm Administration"}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-700 mb-4">
            Are you sure you want to{" "}
            <strong>
              {confirmDialog.type === "approve" ? "approve this medication request" : "mark it as administered"}
            </strong>{" "}
            for <strong>{confirmDialog.request?.studentName}</strong>?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog({ type: null, request: null })}>
              Cancel
            </Button>
            <Button className="bg-yellow-600 hover:bg-yellow-700 text-white" onClick={confirmAction}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogs: Image / Reject / Log / History */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="!max-w-4xl">
          <img src={selectedImage || ""} alt="Prescription" className="w-full rounded-lg shadow-md" />
        </DialogContent>
      </Dialog>

      <Dialog open={rejectingId !== null} onOpenChange={() => setRejectingId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-500 text-lg font-semibold">❌ Select Rejection Reasons</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 text-sm text-gray-700">
            {REJECTION_REASONS.map((reason) => (
              <label key={reason} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedReasons.includes(reason)}
                  onChange={(e) =>
                    setSelectedReasons((prev) =>
                      e.target.checked ? [...prev, reason] : prev.filter((r) => r !== reason)
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
                  setSelectedReasons((prev) =>
                    e.target.checked ? [...prev, "Other"] : prev.filter((r) => r !== "Other")
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
                className="w-full p-3 border rounded-lg resize-none bg-gray-50"
                rows={4}
              />
            )}
          </div>
          <DialogFooter className="mt-5 flex justify-between">
            <Button variant="outline" onClick={() => setRejectingId(null)}>Cancel</Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={confirmReject}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!logDialogRequest} onOpenChange={() => setLogDialogRequest(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-green-600 font-semibold">✅ Record Medication Intake</DialogTitle>
          </DialogHeader>
          <div className="text-gray-700 space-y-2 text-sm">
            <p><strong>Student:</strong> {logDialogRequest?.studentName}</p>
            <p><strong>Medicine:</strong> {logDialogRequest?.medicineName}</p>
            <input
              type="text"
              className="w-full mt-2 p-2 border rounded bg-gray-50"
              placeholder="Given by (name)"
              value={givenByName}
              onChange={(e) => setGivenByName(e.target.value)}
            />
            <textarea
              className="w-full mt-2 p-2 border rounded bg-gray-50"
              placeholder="Additional notes..."
              value={logNotes}
              onChange={(e) => setLogNotes(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setLogDialogRequest(null)}>Cancel</Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={confirmLog}>Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ViewMedicationHistory
        open={!!historyDialogRequest}
        onClose={() => setHistoryDialogRequest(null)}
        requestId={historyDialogRequest?.requestId ?? null}
        studentId={historyDialogRequest?.studentId ?? 0}
      />

      {/* Pending Table */}
      <section className="bg-white p-6 rounded-xl shadow border border-blue-100">
        <h3 className="text-xl font-semibold text-blue-600 mb-4">⏳ Pending Requests</h3>
        {loading ? (
          <p className="text-gray-500 italic">Loading...</p>
        ) : (
          <div className="overflow-x-auto rounded-md">
            <table className="w-full text-sm border border-gray-200">
              <thead className="bg-blue-50 text-blue-800">
                <tr>
                  {["Student", "Medicine", "Note", "Prescription", "Actions"].map((h) => (
                    <th key={h} className="p-3 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {pendingRequests.map((r) => (
                  <tr key={r.requestId} className="border-t hover:bg-blue-50 transition">
                    <td className="p-3">{r.studentName}</td>
                    <td className="p-3">{r.medicineName}</td>
                    <td className="p-3">{r.note || "—"}</td>
                    <td className="p-3">
                      {r.prescriptionImage ? (
                        <img
                          src={r.prescriptionImage}
                          className="w-12 h-12 object-cover rounded-lg ring-1 ring-blue-200 hover:scale-105 cursor-pointer"
                          onClick={() => setSelectedImage(r.prescriptionImage)}
                        />
                      ) : "—"}
                    </td>
                    <td className="p-3 space-x-2">
                      <Button className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1" onClick={() => setConfirmDialog({ type: "approve", request: r })}>Approve</Button>
                      <Button className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1" onClick={() => setRejectingId(r.requestId)}>Reject</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Approved Table */}
      <section className="bg-white p-6 rounded-xl shadow border border-green-100 mb-10">
        <h3 className="text-xl font-semibold text-green-600 mb-4">✅ Approved Requests</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200">
            <thead className="bg-green-50 text-green-800">
              <tr>
                {["Student", "Medicine", "Note", "Prescription", "Actions"].map((h) => (
                  <th key={h} className="p-4 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {approvedRequests.map((r) => (
                <tr key={r.requestId} className="border-t hover:bg-green-50 transition">
                  <td className="p-4">{r.studentName}</td>
                  <td className="p-4">{r.medicineName}</td>
                  <td className="p-4">{r.note || "—"}</td>
                  <td className="p-4">
                    {r.prescriptionImage ? (
                      <img
                        src={r.prescriptionImage}
                        className="w-16 h-16 object-cover rounded-lg ring-2 ring-green-300 hover:scale-105 cursor-pointer"
                        onClick={() => setSelectedImage(r.prescriptionImage)}
                      />
                    ) : "—"}
                  </td>
                  <td className="p-4 space-x-2">
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1" onClick={() => setHistoryDialogRequest(r)}>History</Button>
                    <Button className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1" onClick={() => setLogDialogRequest(r)}>Give</Button>
                    <Button className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-3 py-1" onClick={() => setConfirmDialog({ type: "done", request: r })}>Done</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
