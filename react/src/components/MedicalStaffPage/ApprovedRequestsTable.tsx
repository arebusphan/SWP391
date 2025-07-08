import { Button } from "@/components/ui/button";

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
  onImageClick: (url: string) => void;
  onHistory?: (r: MedicationRequest) => void;
  onGive?: (r: MedicationRequest) => void;
  onDone?: (r: MedicationRequest) => void;
  title?: string;
  hideActions?: boolean;
};

export default function ApprovedRequestsTable({
  requests,
  onImageClick,
  onHistory,
  onGive,
  onDone,
  title = "✅ Approved Requests",
  hideActions = false,
}: Props) {
  return (
    <section className="bg-white p-6 rounded-xl shadow border border-green-100 mb-10">
      <h3 className="text-xl font-semibold text-green-600 mb-4">{title}</h3>
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
            {requests.map((r) => (
              <tr key={r.requestId} className="border-t hover:bg-green-50 transition">
                <td className="p-4">{r.studentName}</td>
                <td className="p-4">{r.medicineName}</td>
                <td className="p-4">{r.note || "—"}</td>
                <td className="p-4">
                  {r.prescriptionImage ? (
                    <img
                      src={r.prescriptionImage}
                      className="w-16 h-16 object-cover rounded-lg ring-2 ring-green-300 hover:scale-105 cursor-pointer"
                      onClick={() => onImageClick(r.prescriptionImage)}
                    />
                  ) : "—"}
                </td>

                <td className="p-4">
                  {hideActions ? (
                    // 👉 Tab "History"
                    r.status === "Administered" && onHistory ? (
                      <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1"
                        onClick={() => onHistory(r)}
                      >
                        History
                      </Button>
                    ) : r.status === "Rejected" ? (
                      <span className="text-red-600 text-sm">{r.rejectReason || "No reason"}</span>
                    ) : (
                      "—"
                    )
                  ) : (
                    // 👉 Tab "Approved"
                    <>
                      {onHistory && (
                        <Button
                          className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 mr-2"
                          onClick={() => onHistory(r)}
                        >
                          History
                        </Button>
                      )}
                      {onGive && r.status === "Approved" && (
                        <Button
                          className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 mr-2"
                          onClick={() => onGive(r)}
                        >
                          Give
                        </Button>
                      )}
                      {onDone && r.status === "Approved" && (
                        <Button
                          className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-3 py-1"
                          onClick={() => onDone(r)}
                        >
                          Done
                        </Button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
