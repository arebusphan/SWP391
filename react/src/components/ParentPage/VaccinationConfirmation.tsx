import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    confirmVaccination,
    getPendingVaccinationConfirmations,
} from "@/service/serviceauth";
import { useAuth } from "@/context/AuthContext";
import AlertNotification from "@/components/MedicalStaffPage/AlertNotification";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

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
    const [imageDialog, setImageDialog] = useState<string | null>(null);
    const [declineDialog, setDeclineDialog] = useState<null | VaccinationEvent>(null);
    const [declineReason, setDeclineReason] = useState("");
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

    const handleDeclineConfirm = async () => {
        if (!declineDialog) return;
        if (!declineReason.trim()) {
            showAlert({
                type: "error",
                title: "Decline Failed",
                description: "Please enter a reason before declining.",
            });
            return;
        }

        try {
            await confirmVaccination(
                declineDialog.notificationStudentId,
                "Declined",
                parentPhone,
                declineReason
            );
            setData((prev) =>
                prev.filter((d) => d.notificationStudentId !== declineDialog.notificationStudentId)
            );
            showAlert({
                type: "success",
                title: "Vaccination Declined",
                description: `You have declined vaccination for ${declineDialog.studentName}.`,
            });
            setDeclineDialog(null);
            setDeclineReason("");
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
        <div className="min-h-screen">
            <AlertNotification
                alerts={alerts}
                onRemove={(id) => setAlerts((prev) => prev.filter((a) => a.id !== id))}
            />
            <h1 className="text-4xl font-bold p-10 text-blue-800">
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
                            <th className="border px-3 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="text-center py-6 text-gray-500">
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
                                            className="drop-shadow"
                                            onClick={() => {
                                                setDeclineDialog(item);
                                                setDeclineReason(""); // reset
                                            }}
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
            <Dialog open={!!imageDialog} onOpenChange={() => setImageDialog(null)}>
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

            {/* Dialog nhập lý do từ chối */}
            <Dialog open={!!declineDialog} onOpenChange={() => setDeclineDialog(null)}>
                <DialogContent className="sm:max-w-lg p-6">
                    <DialogHeader>
                        <DialogTitle>Decline Vaccination for {declineDialog?.studentName}</DialogTitle>
                    </DialogHeader>

                    <textarea
                        placeholder="Enter reason for declining..."
                        rows={4}
                        value={declineReason}
                        onChange={(e) => setDeclineReason(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />

                    <DialogFooter className="mt-4 flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setDeclineDialog(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-red-600 text-white hover:bg-red-700"
                            onClick={handleDeclineConfirm}
                        >
                            Submit Decline
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
