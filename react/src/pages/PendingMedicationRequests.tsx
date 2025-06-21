import { useEffect, useState } from "react";
import {
    getMedicationRequestsForNurse,
    updateMedicationStatus,
} from "../service/serviceauth";
import { jwtDecode } from "jwt-decode";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

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
    "Thuốc gửi không đúng với đơn thuốc",
    "Đơn thuốc không hợp lệ",
    "Đơn thuốc đã quá hạn",
    "Đơn thuốc không ghi liều lượng cụ thể",
];

const PendingMedicationRequests = () => {
    const [requests, setRequests] = useState<MedicationRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [rejectingId, setRejectingId] = useState<number | null>(null);
    const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
    const [customReason, setCustomReason] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        async function fetchRequests() {
            try {
                const res = await getMedicationRequestsForNurse();
                setRequests(res.data);
            } catch (error) {
                console.error("Failed to fetch medication requests:", error);
                alert("Failed to load medication requests.");
            } finally {
                setLoading(false);
            }
        }

        fetchRequests();
    }, []);

    const handleApprove = async (id: number) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return alert("Not logged in.");

            const decoded: any = jwtDecode(token);
            const reviewedBy = parseInt(
                decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
            );

            if (isNaN(reviewedBy)) return alert("Invalid reviewer ID.");

            await updateMedicationStatus(id, "Approved", reviewedBy);
            alert("Request approved successfully.");
            setRequests((prev) => prev.filter((r) => r.requestId !== id));
        } catch (error) {
            console.error("Failed to approve:", error);
            alert("Failed to approve request.");
        }
    };

    const handleReject = (id: number) => {
        setRejectingId(id);
        setSelectedReasons([]);
        setCustomReason("");
    };

    const confirmReject = async () => {
        const finalReason = [
  ...selectedReasons.filter((r) => r !== "Other"),
  customReason.trim(),
]
  .filter(Boolean)
  .join(", ");


        if (!finalReason) {
            alert("Vui lòng chọn hoặc nhập ít nhất một lý do.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) return alert("Not logged in.");

            const decoded: any = jwtDecode(token);
            const reviewedBy = parseInt(
                decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
            );

            if (isNaN(reviewedBy)) return alert("Invalid reviewer ID.");

            // TODO: chưa truyền rejectReason vào API
           await updateMedicationStatus(rejectingId!, "Rejected", reviewedBy, finalReason);

            alert("Request rejected successfully.");
            setRequests((prev) => prev.filter((r) => r.requestId !== rejectingId));
            setRejectingId(null);
        } catch (error) {
            console.error("Failed to reject:", error);
            alert("Failed to reject request.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Pending Medication Requests</h2>

            {loading ? (
                <p>Loading...</p>
            ) : requests.length === 0 ? (
                <p>No pending requests.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border border-gray-300 text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 border-b">Student</th>
                                <th className="p-3 border-b">Medicine</th>
                                <th className="p-3 border-b">Health Status</th>
                                <th className="p-3 border-b">Note</th>
                                <th className="p-3 border-b">Image</th>
                                <th className="p-3 border-b">Submitted</th>
                                <th className="p-3 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((r) => (
                                <tr key={r.requestId} className="hover:bg-gray-50">
                                    <td className="p-3 border-b">{r.studentName}</td>
                                    <td className="p-3 border-b">{r.medicineName}</td>
                                    <td className="p-3 border-b">{r.healthStatus || "—"}</td>
                                    <td className="p-3 border-b">{r.note || "—"}</td>
                                    <td className="p-3 border-b">
                                        {r.prescriptionImage ? (
                                            <img
                                                src={r.prescriptionImage}
                                                alt="Prescription"
                                                className="h-12 w-12 object-cover rounded cursor-pointer"
                                                onClick={() => setSelectedImage(r.prescriptionImage)}
                                            />
                                        ) : (
                                            "—"
                                        )}
                                    </td>
                                    <td className="p-3 border-b">
                                        {new Date(r.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-3 border-b space-x-2">
                                        <button
                                            onClick={() => handleApprove(r.requestId)}
                                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(r.requestId)}
                                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Dialog xem ảnh */}
            <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                <DialogContent
                    className="!max-w-4xl !p-0 !bg-transparent !border-none !shadow-none flex justify-center items-center"
                >
                    <img
                        src={selectedImage || ""}
                        alt="Prescription Full"
                        className="w-full h-auto max-h-[90vh] object-contain rounded"
                    />
                </DialogContent>
            </Dialog>

            {/* Dialog lý do từ chối */}
            <Dialog open={rejectingId !== null} onOpenChange={() => setRejectingId(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Lý do từ chối</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-2">
                        {REJECTION_REASONS.map((reason, idx) => (
                            <label key={idx} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={selectedReasons.includes(reason)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedReasons((prev) => [...prev, reason]);
                                        } else {
                                            setSelectedReasons((prev) =>
                                                prev.filter((r) => r !== reason)
                                            );
                                        }
                                    }}
                                />
                                <span>{reason}</span>
                            </label>
                        ))}

                        <label className="flex items-center space-x-2 mt-2">
                            <input
                                type="checkbox"
                                checked={selectedReasons.includes("Other")}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedReasons((prev) => [...prev, "Other"]);
                                    } else {
                                        setSelectedReasons((prev) =>
                                            prev.filter((r) => r !== "Other")
                                        );
                                        setCustomReason("");
                                    }
                                }}
                            />
                            <span>Khác</span>
                        </label>

                        {selectedReasons.includes("Other") && (
                            <textarea
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                placeholder="Nhập lý do khác..."
                                className="w-full p-2 border rounded resize-none text-sm"
                                style={{ height: "96px" }} // 6rem fixed height
                            />
                        )}
                    </div>

                    <DialogFooter className="mt-4">
                        <button
                            onClick={() => setRejectingId(null)}
                            className="px-4 py-1 bg-gray-300 rounded"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={confirmReject}
                            className="px-4 py-1 bg-red-600 text-white rounded"
                        >
                            Xác nhận
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PendingMedicationRequests;
