// components/NursePage/LogIntakeDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type MedicationRequest = {
  requestId: number;
  studentId: number;
  studentName: string;
  medicineName: string;
};

type Props = {
  open: boolean;
  request: MedicationRequest | null;
  givenByName: string;
  logNotes: string;
  onChangeName: (val: string) => void;
  onChangeNotes: (val: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function LogIntakeDialog({
  open,
  request,
  givenByName,
  logNotes,
  onChangeName,
  onChangeNotes,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-green-600 font-semibold">✅ Record Medication Intake</DialogTitle>
        </DialogHeader>
        <div className="text-gray-700 space-y-2 text-sm">
          <p><strong>Student:</strong> {request?.studentName}</p>
          <p><strong>Medicine:</strong> {request?.medicineName}</p>
          <input
            type="text"
            className="w-full mt-2 p-2 border rounded bg-gray-50"
            placeholder="Given by (name)"
            value={givenByName}
            onChange={(e) => onChangeName(e.target.value)}
          />
          <textarea
            className="w-full mt-2 p-2 border rounded bg-gray-50"
            placeholder="Additional notes..."
            value={logNotes}
            onChange={(e) => onChangeNotes(e.target.value)}
            rows={4}
          />
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={onConfirm}>Record</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
