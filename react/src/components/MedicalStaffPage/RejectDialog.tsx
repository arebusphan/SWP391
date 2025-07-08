// components/NursePage/RejectDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  selectedReasons: string[];
  customReason: string;
  onChangeReason: (reason: string, checked: boolean) => void;
  onChangeCustomReason: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

const REJECTION_REASONS = [
  "Medication does not match prescription",
  "Invalid prescription",
  "Prescription has expired",
  "Dosage not specified",
];

export default function RejectDialog({
  open,
  selectedReasons,
  customReason,
  onChangeReason,
  onChangeCustomReason,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-500 text-lg font-semibold">
            ❌ Select Rejection Reasons
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2 text-sm text-gray-700">
          {REJECTION_REASONS.map((reason) => (
            <label key={reason} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedReasons.includes(reason)}
                onChange={(e) => onChangeReason(reason, e.target.checked)}
              />
              {reason}
            </label>
          ))}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedReasons.includes("Other")}
              onChange={(e) => {
                onChangeReason("Other", e.target.checked);
                if (!e.target.checked) onChangeCustomReason("");
              }}
            />
            Other
          </label>
          {selectedReasons.includes("Other") && (
            <textarea
              value={customReason}
              onChange={(e) => onChangeCustomReason(e.target.value)}
              className="w-full p-3 border rounded-lg resize-none bg-gray-50"
              rows={4}
            />
          )}
        </div>
        <DialogFooter className="mt-5 flex justify-between">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={onConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
