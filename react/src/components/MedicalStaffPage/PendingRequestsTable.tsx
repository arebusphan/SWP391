// components/NursePage/PendingRequestsTable.tsx
import { Button } from "@/components/ui/button";

// ✅ Đồng bộ với component cha (PendingMedicationRequests.tsx)
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
  requests: MedicationRequest[];
  onApprove: (request: MedicationRequest) => void;
  onReject: (requestId: number) => void;
  onImageClick: (imageUrl: string) => void;
};

export default function PendingRequestsTable({
  requests,
  onApprove,
  onReject,
  onImageClick,
}: Props) {
  return (
    <section className="bg-white p-6 rounded-xl shadow border border-blue-100">
      <h3 className="text-xl font-semibold text-blue-600 mb-4">⏳ Pending Requests</h3>
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
            {requests.map((r) => (
              <tr key={r.requestId} className="border-t hover:bg-blue-50 transition">
                <td className="p-3">{r.studentName}</td>
                <td className="p-3">{r.medicineName}</td>
                <td className="p-3">{r.note || "—"}</td>
                <td className="p-3">
                  {r.prescriptionImage ? (
                    <img
                      src={r.prescriptionImage}
                      className="w-12 h-12 object-cover rounded-lg ring-1 ring-blue-200 hover:scale-105 cursor-pointer"
                      onClick={() => onImageClick(r.prescriptionImage)}
                    />
                  ) : (
                    "—"
                  )}
                </td>
                <td className="p-3 space-x-2">
                  <Button
                    className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1"
                    onClick={() => onApprove(r)}
                  >
                    Approve
                  </Button>
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1"
                    onClick={() => onReject(r.requestId)}
                  >
                    Reject
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
