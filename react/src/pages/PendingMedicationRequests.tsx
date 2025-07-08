import { useEffect, useState } from "react";
import {
  getMedicationRequestsForNurse,
  getApprovedMedicationRequests,
  updateMedicationStatus,
  createMedicationIntakeLog,
} from "../service/serviceauth";
import { jwtDecode } from "jwt-decode";
import ViewMedicationHistory from "@/components/ParentPage/ViewMedicationHistory";

import AlertNotification from "@/components/MedicalStaffPage/AlertNotification";
import type { AlertItem } from "@/components/MedicalStaffPage/AlertNotification";
import ConfirmActionDialog from "@/components/MedicalStaffPage/ConfirmActionDialog";
import RejectDialog from "@/components/MedicalStaffPage/RejectDialog";
import LogIntakeDialog from "@/components/MedicalStaffPage/LogIntakeDialog";
import PendingRequestsTable from "@/components/MedicalStaffPage/PendingRequestsTable";
import ApprovedRequestsTable from "@/components/MedicalStaffPage/ApprovedRequestsTable";

// Type nội bộ
type MedicationRequest = {
  requestId: number;
  studentId: number;
  studentName: string;
  medicineName: string;
  prescriptionImage: string;
  healthStatus: string;
  note: string;
  createdAt: string;
  status: "Pending" | "Approved" | "Rejected" | "Administered";
  rejectReason: string;
};

export default function PendingMedicationRequests() {
  const [pendingRequests, setPendingRequests] = useState<MedicationRequest[]>([]);
  const [approvedRequests, setApprovedRequests] = useState<MedicationRequest[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [, setLoading] = useState(true);
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

  const [viewMode, setViewMode] = useState<"approved" | "history">("approved");

  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const showAlert = (type: "success" | "error", title: string, description: string) => {
    setAlerts((prev) => {
      const newAlert: AlertItem = {
        id: Date.now(),
        type,
        title,
        description,
      };
      const updated = [...prev, newAlert];
      return updated.length > 3 ? updated.slice(1) : updated;
    });
  };

  useEffect(() => {
    async function fetchRequests() {
      try {
        const pendingRes = await getMedicationRequestsForNurse();
        setPendingRequests(pendingRes.data.filter((r: MedicationRequest) => r.status === "Pending"));

        const approvedRes = await getApprovedMedicationRequests();
        setApprovedRequests(approvedRes.data);
      } catch {
        showAlert("error", "Load Failed", "⚠️ Failed to load medication requests.");
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

    const status = confirmDialog.type === "approve" ? "Approved" : "Administered";

    updateMedicationStatus(request.requestId, status, reviewedBy)
      .then((res) => {
        if (res.status === 200) {
          if (status === "Approved") {
            setPendingRequests((prev) => prev.filter((r) => r.requestId !== request.requestId));
            setApprovedRequests((prev) => [...prev, { ...request, status }]);
          } else {
            setApprovedRequests((prev) =>
              prev.map((r) =>
                r.requestId === request.requestId ? { ...r, status: "Administered" } : r
              )
            );
          }
          showAlert(
            "success",
            status === "Approved" ? "Request Approved" : "Medication Administered",
            status === "Approved"
              ? `${request.studentName}'s request has been approved.`
              : `${request.studentName}'s request marked as completed.`
          );
        } else throw new Error();
      })
      .catch((err) =>
        showAlert("error", "Update Failed", err.message)
      );

    setConfirmDialog({ type: null, request: null });
  };

  const confirmReject = () => {
    const finalReason = [...selectedReasons.filter((r) => r !== "Other"), customReason.trim()]
      .filter(Boolean)
      .join(", ");
    if (!finalReason) {
      showAlert("error", "Rejection Error", "Please enter at least one reason.");
      return;
    }

    const reviewedBy = getReviewerId();
    updateMedicationStatus(rejectingId!, "Rejected", reviewedBy, finalReason)
      .then((res) => {
        if (res.status === 200) {
          setPendingRequests((prev) => prev.filter((r) => r.requestId !== rejectingId));
          const rejectedReq = pendingRequests.find((r) => r.requestId === rejectingId);
          if (rejectedReq)
            setApprovedRequests((prev) => [
              ...prev,
              { ...rejectedReq, status: "Rejected", rejectReason: finalReason },
            ]);
          setRejectingId(null);
          showAlert("success", "Request Rejected", "The request was rejected successfully.");
        } else throw new Error();
      })
      .catch((err) => {
        showAlert("error", "Rejection Failed", err?.response?.data || err.message);
      });
  };

  const confirmLog = async () => {
    if (!logDialogRequest || !logNotes.trim() || !givenByName.trim()) {
      showAlert("error", "Missing Info", "Please fill in all fields.");
      return;
    }

    try {
      await createMedicationIntakeLog({
        requestId: logDialogRequest.requestId,
        studentId: logDialogRequest.studentId,
        givenBy: givenByName,
        notes: logNotes,
      });
      showAlert("success", "Intake Logged", "Medication intake recorded successfully.");
      setLogDialogRequest(null);
    } catch {
      showAlert("error", "Logging Failed", "Failed to log medication intake.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10 pt-6 animate-fade-in">
      <div className="mb-4">
        <AlertNotification alerts={alerts} onRemove={(id) => setAlerts((prev) => prev.filter((a) => a.id !== id))} />
      </div>

      <ConfirmActionDialog
        open={!!confirmDialog.type}
        type={confirmDialog.type}
        request={confirmDialog.request}
        onCancel={() => setConfirmDialog({ type: null, request: null })}
        onConfirm={confirmAction}
      />

      <RejectDialog
        open={rejectingId !== null}
        selectedReasons={selectedReasons}
        customReason={customReason}
        onChangeReason={(reason, checked) =>
          setSelectedReasons((prev) =>
            checked ? [...prev, reason] : prev.filter((r) => r !== reason)
          )
        }
        onChangeCustomReason={setCustomReason}
        onCancel={() => setRejectingId(null)}
        onConfirm={confirmReject}
      />

      <LogIntakeDialog
        open={!!logDialogRequest}
        request={logDialogRequest}
        givenByName={givenByName}
        logNotes={logNotes}
        onChangeName={setGivenByName}
        onChangeNotes={setLogNotes}
        onCancel={() => setLogDialogRequest(null)}
        onConfirm={confirmLog}
      />

      <ViewMedicationHistory
        open={!!historyDialogRequest}
        onClose={() => setHistoryDialogRequest(null)}
        requestId={historyDialogRequest?.requestId ?? null}
        studentId={historyDialogRequest?.studentId ?? 0}
      />

      <PendingRequestsTable
        requests={pendingRequests}
        onApprove={(r) => setConfirmDialog({ type: "approve", request: r })}
        onReject={(id) => setRejectingId(id)}
        onImageClick={(img) => setSelectedImage(img)}
      />

      <div className="flex justify-end gap-2">
        <button
          className={`px-3 py-1 text-sm rounded border ${
            viewMode === "approved"
              ? "bg-green-500 text-white"
              : "bg-white text-green-600 border-green-500"
          }`}
          onClick={() => setViewMode("approved")}
        >
          Approved (To Administer)
        </button>
        <button
          className={`px-3 py-1 text-sm rounded border ${
            viewMode === "history"
              ? "bg-gray-600 text-white"
              : "bg-white text-gray-600 border-gray-500"
          }`}
          onClick={() => setViewMode("history")}
        >
          History (Done + Rejected)
        </button>
      </div>

      <ApprovedRequestsTable
        requests={
          viewMode === "approved"
            ? approvedRequests.filter((r) => r.status === "Approved")
            : approvedRequests.filter((r) => r.status === "Administered" || r.status === "Rejected")
        }
        onImageClick={(img) => setSelectedImage(img)}
        onHistory={(r) => setHistoryDialogRequest(r)}
        onGive={viewMode === "approved" ? (r) => setLogDialogRequest(r) : undefined}
        onDone={viewMode === "approved" ? (r) => setConfirmDialog({ type: "done", request: r }) : undefined}
        title={viewMode === "approved" ? "✅ Approved Requests" : "📜 Medication History"}
      />

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} className="max-h-[90%] rounded-xl shadow-xl" />
        </div>
      )}
    </div>
  );
}
