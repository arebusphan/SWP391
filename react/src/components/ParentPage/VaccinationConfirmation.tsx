import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    confirmVaccination,
    getPendingVaccinationConfirmations,
} from "@/service/serviceauth";
import { useAuth } from "@/context/AuthContext";
import AlertNotification from "@/components/MedicalStaffPage/AlertNotification";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { AlertItem } from "@/components/MedicalStaffPage/AlertNotification";

interface VaccinationEvent {
    notificationStudentId: number;
    notificationId: number;
    eventName: string;
    eventType: string;
    eventImage: string;
    eventDate: string;
    createdAt: string;
    createdBy: string;
    studentId: number;
    studentName: string;
    className: string;
}

export default function VaccinationList() {
    const [data, setData] = useState<VaccinationEvent[]>([]);
    const [alerts, setAlerts] = useState<AlertItem[]>([]);
    const [declineReasons, setDeclineReasons] = useState<Record<number, string>>({});
    const [imageDialog, setImageDialog] = useState<string | null>(null);
    const { user } = useAuth();
    const parentPhone = user?.Phone || "";

    useEffect(() => {
        (async () => {
            try {
                const res = await getPendingVaccinationConfirmations();
                setData(res);
            } catch (error) {
                console.error("Error fetching vaccination events:", error);
            }
        })();
    }, []);

    const showAlert = (item: Omit<AlertItem, "id">) => {
        setAlerts((prev) => [{ id: Date.now() + Math.random(), ...item }, ...prev]);
    };

    const handleAccept = async (item: VaccinationEvent) => {
        try {
            await confirmVaccination(item.notificationStudentId, "Confirmed", parentPhone);
            setData((prev) =>
                prev.filter((d) => d.notificationStudentId !== item.notificationStudentId)
            );
            showAlert({
                type: "success",
                title: "Vaccination Confirmed",
                description: `You have confirmed vaccination for ${item.studentName}.`,
            });
        } catch (error) {
            console.error("Error confirming:", error);
            showAlert({
                type: "error",
                title: "Confirmation Failed",
                description: "Something went wrong. Please try again.",
            });
        }
    };

    const handleDecline = async (item: VaccinationEvent) => {
        const reason = declineReasons[item.notificationStudentId];
        if (!reason || reason.trim() === "") {
            showAlert({
                type: "error",
                title: "Decline Failed",
                description: "Please enter a reason before declining.",
            });
            return;
        }
        try {
            await confirmVaccination(
                item.notificationStudentId,
                "Declined",
                parentPhone,
                reason
            );
            setData((prev) =>
                prev.filter((d) => d.notificationStudentId !== item.notificationStudentId)
            );
            showAlert({
                type: "success",
                title: "Vaccination Declined",
                description: `You have declined vaccination for ${item.studentName}.`,
            });
        } catch (error) {
            console.error("Error declining:", error);
            showAlert({
                type: "error",
                title: "Decline Failed",
                description: "Error sending decline reason. Please try again.",
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 drop-shadow">
            <AlertNotification
                alerts={alerts}
                onRemove={(id) => setAlerts((prev) => prev.filter((a) => a.id !== id))}
            />
            <h1 className="text-center text-3xl font-extrabold text-blue-900 mb-8 drop-shadow">
                Vaccination Event Confirmation
            </h1>

            <div className="overflow-x-auto border rounded-2xl bg-white shadow-xl p-6">
                <table className="table-auto w-full text-sm border-collapse">
                    <thead className="bg-blue-900 text-white">
                        <tr>
                            <th className="border px-3 py-2">Event</th>
                            <th className="border px-3 py-2">Type</th>
                            <th className="border px-3 py-2">Date</th>
                            <th className="border px-3 py-2">Created At</th>
                            <th className="border px-3 py-2">By</th>
                            <th className="border px-3 py-2">Student</th>
                            <th className="border px-3 py-2">Class</th>
                            <th className="border px-3 py-2">Image</th>
                            <th className="border px-3 py-2">Decline Reason</th>
                            <th className="border px-3 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="text-center py-6 text-gray-500">
                                    No pending vaccinations 🎉
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr
                                    key={item.notificationStudentId}
                                    className="border-t hover:bg-blue-50"
                                >
                                    <td className="border px-3 py-2">{item.eventName}</td>
                                    <td className="border px-3 py-2">{item.eventType}</td>
                                    <td className="border px-3 py-2">
                                        {new Date(item.eventDate).toLocaleDateString()}
                                    </td>
                                    <td className="border px-3 py-2">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="border px-3 py-2">{item.createdBy}</td>
                                    <td className="border px-3 py-2">{item.studentName}</td>
                                    <td className="border px-3 py-2">{item.className}</td>
                                    <td className="border px-3 py-2">
                                        <img
                                            src={item.eventImage}
                                            alt="Event"
                                            onClick={() => setImageDialog(item.eventImage)}
                                            className="h-16 w-24 object-cover rounded shadow cursor-pointer hover:opacity-80"
                                        />
                                    </td>
                                    <td className="border px-3 py-2">
                                        <textarea
                                            className="border rounded p-1 text-xs w-full"
                                            rows={2}
                                            placeholder="Enter reason..."
                                            value={declineReasons[item.notificationStudentId] || ""}
                                            onChange={(e) =>
                                                setDeclineReasons((prev) => ({
                                                    ...prev,
                                                    [item.notificationStudentId]: e.target.value,
                                                }))
                                            }
                                        />
                                    </td>
                                    <td className="border px-3 py-2 flex flex-col space-y-1">
                                        <Button
                                            size="sm"
                                            className="bg-green-600 text-white hover:bg-green-700 drop-shadow"
                                            onClick={() => handleAccept(item)}
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDecline(item)}
                                            className="drop-shadow"
                                        >
                                            Decline
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Dialog xem ảnh */}
            <Dialog open={imageDialog !== null} onOpenChange={() => setImageDialog(null)}>
                <DialogContent className="max-w-4xl p-4 bg-white rounded-2xl shadow-xl">
                    {imageDialog && (
                        <img
                            src={imageDialog}
                            alt="Event Full"
                            className="w-full max-h-[80vh] object-contain rounded-lg"
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
