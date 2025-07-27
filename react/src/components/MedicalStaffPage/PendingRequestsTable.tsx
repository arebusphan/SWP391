import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/Pagination";

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
  itemsPerPage?: number;
};

export default function PendingRequestsTable({
  requests,
  onApprove,
  onReject,
  onImageClick,
  itemsPerPage = 5,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(requests.length / itemsPerPage);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return requests.slice(start, start + itemsPerPage);
  }, [requests, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow border border-blue-100">
      <h3 className="text-xl font-semibold text-blue-600 mb-4">Pending Requests</h3>
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
            {currentData.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500 italic">
                  No pending requests.
                </td>
              </tr>
            ) : (
              currentData.map((r) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </section>
  );
}
