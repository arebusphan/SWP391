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

    const handleUpdateStatus = async (id: number, status: "Approved" | "Rejected") => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return alert("Not logged in.");

            // ✅ Decode with proper claim key
            const decoded: any = jwtDecode(token);
            const reviewedBy = parseInt(
                decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
            );

            if (isNaN(reviewedBy)) {
                console.error("reviewedBy is NaN. Check decoded token:", decoded);
                return alert("Invalid reviewer ID. Cannot update status.");
            }

            await updateMedicationStatus(id, status, reviewedBy);
            alert(`Request ${status === "Approved" ? "approved" : "rejected"} successfully.`);

            setRequests((prev) => prev.filter((r) => r.requestId !== id));
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Failed to update status.");
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
                                            onClick={() => handleUpdateStatus(r.requestId, "Approved")}
                                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(r.requestId, "Rejected")}
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
        </div>
    );
};

export default PendingMedicationRequests;
