import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { confirmVaccination, getPendingVaccinationConfirmations } from "@/service/serviceauth";
import { useAuth } from "@/context/AuthContext";

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
    const [selected, setSelected] = useState<VaccinationEvent | null>(null);
    const [reasonDialog, setReasonDialog] = useState<VaccinationEvent | null>(null);
    const [declineReason, setDeclineReason] = useState("");

    const { user } = useAuth();
    const parentPhone = user?.Phone || "";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getPendingVaccinationConfirmations();
                setData(res);
            } catch (error) {
                console.error("Error fetching vaccination events:", error);
            }
        };
        fetchData();
    }, []);

    const handleAccept = async (item: VaccinationEvent) => {
        try {
            await confirmVaccination(item.notificationStudentId, "Confirmed", parentPhone);
            setData((prev) => prev.filter((d) => d.notificationStudentId !== item.notificationStudentId));
            alert(`✅ Successfully confirmed vaccination for ${item.studentName}`);
        } catch (error) {
            console.error("Error confirming:", error);
            alert("❌ Something went wrong. Please try again.");
        }
    };

    const handleSubmitDecline = async () => {
        if (!reasonDialog) return;
        try {
            await confirmVaccination(
                reasonDialog.notificationStudentId,
                "Declined",
                parentPhone,
                declineReason
            );
            setData((prev) => prev.filter((d) => d.notificationStudentId !== reasonDialog.notificationStudentId));
            alert(`⚠️ Declined vaccination for ${reasonDialog.studentName}`);
            setReasonDialog(null);
            setDeclineReason("");
        } catch (error) {
            console.error("Error declining:", error);
            alert("❌ Error sending decline reason. Please try again.");
        }
    };

    return (
        <div className="p-10 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-6">
                <h1 className="text-3xl font-bold text-blue-800 text-center">Vaccination Event Confirmation</h1>

                <div className="grid grid-cols-9 font-semibold text-sm text-gray-600 border-b pb-3">
                    <div>Event</div>
                    <div>Type</div>
                    <div>Date</div>
                    <div>Created</div>
                    <div>Student</div>
                    <div>Class</div>
                    <div className="text-center">View</div>
                    <div className="text-center">Accept</div>
                    <div className="text-center">Decline</div>
                </div>

                {data.map((item, index) => (
                    <div key={index} className="grid grid-cols-9 text-sm py-3 border-b items-center">
                        <div>{item.eventName}</div>
                        <div>{item.eventType}</div>
                        <div>{new Date(item.eventDate).toLocaleDateString()}</div>
                        <div>{new Date(item.createdAt).toLocaleDateString()}</div>
                        <div>{item.studentName}</div>
                        <div>{item.className}</div>
                        <div className="flex justify-center">
                            <Button variant="outline" size="sm" onClick={() => setSelected(item)}>
                                Details
                            </Button>
                        </div>
                        <div className="flex justify-center">
                            <Button size="sm" onClick={() => handleAccept(item)}>
                                Accept
                            </Button>
                        </div>
                        <div className="flex justify-center">
                            <Button size="sm" variant="destructive" onClick={() => setReasonDialog(item)}>
                                Decline
                            </Button>
                        </div>
                    </div>
                ))}

                {/* View Details Dialog */}
                <Dialog open={selected !== null} onOpenChange={() => setSelected(null)}>
                    <DialogContent className="max-w-3xl w-full">
                        <DialogTitle>Event Details</DialogTitle>
                        {selected && (
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-700 mt-4">
                                <div>
                                    <p className="font-semibold">Event Name:</p>
                                    <p>{selected.eventName}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Type:</p>
                                    <p>{selected.eventType}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Date:</p>
                                    <p>{new Date(selected.eventDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Created At:</p>
                                    <p>{new Date(selected.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Created By:</p>
                                    <p>{selected.createdBy}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Student:</p>
                                    <p>{selected.studentName}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Class:</p>
                                    <p>{selected.className}</p>
                                </div>
                                <div className="col-span-2 mt-4">
                                    <img
                                        src={selected.eventImage}
                                        alt="Event"
                                        className="w-full rounded-md border max-h-[400px] object-cover"
                                    />
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Decline Reason Dialog */}
                <Dialog open={reasonDialog !== null} onOpenChange={() => setReasonDialog(null)}>
                    <DialogContent className="max-w-xl w-full">
                        <DialogTitle>Reason for Decline</DialogTitle>
                        <DialogDescription>
                            Please provide a reason why you are declining the vaccination for your child.
                        </DialogDescription>
                        <textarea
                            placeholder="Enter your reason..."
                            value={declineReason}
                            onChange={(e) => setDeclineReason(e.target.value)}
                            className="w-full h-40 mt-2 p-3 border rounded-md resize-none"
                        />
                        <div className="flex justify-end mt-4">
                            <Button onClick={handleSubmitDecline}>Submit Reason</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
