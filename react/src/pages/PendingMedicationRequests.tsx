import { useEffect, useState } from "react";
import {
    getMedicationRequestsForNurse,
    updateMedicationStatus,
} from "../service/serviceauth";
import { jwtDecode } from "jwt-decode";

type MedicationRequest = {
    requestId: number;
    studentId: number;
    studentName: string;
    medicineName: string;
    prescriptionImage: string;
    createdAt: string;
    status: "Pending" | "Approved" | "Rejected";
};

const PendingMedicationRequests = () => {
    const [requests, setRequests] = useState<MedicationRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [rejectingId, setRejectingId] = useState<number | null>(null);
    const [rejectReason, setRejectReason] = useState("");

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
        setRejectReason("");
    };

    const confirmReject = async () => {
        if (!rejectReason.trim()) {
            alert("Please provide a reason for rejection.");
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

            // TODO: truyền thêm rejectReason vào API khi backend hỗ trợ
            await updateMedicationStatus(rejectingId!, "Rejected", reviewedBy);

            alert("Request rejected successfully.");
            setRequests((prev) => prev.filter((r) => r.requestId !== rejectingId));
            setRejectingId(null);
        } catch (error) {
            console.error("Failed to reject:", error);
            alert("Failed to reject request.");
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
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
                                    <td className="p-3 border-b">
                                        {r.prescriptionImage ? (
                                            <img
                                                src={r.prescriptionImage}
                                                alt="Prescription"
                                                className="h-12 w-12 object-cover rounded"
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

            {/* Rejection Reason Dialog */}
            {rejectingId !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow max-w-sm w-full space-y-4">
                        <h3 className="text-lg font-semibold text-red-600">Reason for Rejection</h3>
                        <textarea
                            className="w-full border rounded p-2 text-sm"
                            rows={4}
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Enter reason..."
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                className="px-4 py-1 bg-gray-300 rounded"
                                onClick={() => setRejectingId(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-1 bg-red-600 text-white rounded"
                                onClick={confirmReject}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingMedicationRequests;
