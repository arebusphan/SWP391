// components/NursePage/ConfirmActionDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// ⚠️ Phải dùng đúng kiểu MedicationRequest như ở PendingMedicationRequests.tsx
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

type Props = {
  open: boolean;
  type: "approve" | "done" | null;
  request: MedicationRequest | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmActionDialog({
  open,
  type,
  request,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-yellow-600">
            {type === "approve"
              ? "✅ Confirm Approval"
              : "📝 Confirm Administration"}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-700 mb-4">
          Are you sure you want to{" "}
          <strong>
            {type === "approve"
              ? "approve this medication request"
              : "mark it as administered"}
          </strong>{" "}
          for <strong>{request?.studentName}</strong>?
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
