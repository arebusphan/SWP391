import { useEffect, useState } from "react";
import { getNotifications } from "../service/serviceauth";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface EventNotification {
  id: number;
  eventName: string;
  eventType: string;
  eventDate: string;
  className: string;
  eventImage: string;
}

export default function Notificationiconview() {
  const [notifications, setNotifications] = useState<EventNotification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<EventNotification | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    getNotifications()
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error("Lỗi khi lấy thông báo:", err));
  }, []);

  const handleClick = (note: EventNotification) => {
    setSelectedNotification(note);
    setDialogOpen(true);
  };

  return (
    <div className="max-w-md">
      <h2 className="text-lg font-semibold">Notifications</h2>

      <div className="mt-3 space-y-3 max-h-[300px] overflow-y-auto">
        {notifications.map((note) => (
          <div
            key={note.id}
            onClick={() => handleClick(note)}
            className="border p-3 rounded-md shadow-sm bg-white text-sm cursor-pointer hover:bg-gray-50 transition"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-blue-600">
                {note.eventName}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(note.eventDate).toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {note.eventType} - Class {note.className}
            </p>
          </div>
        ))}
      </div>

      <div className="text-right mt-2">
        <a
          href="/notifications"
          className="text-sm text-blue-600 hover:underline"
        >
          View more
        </a>
      </div>

      {/* Dialog hiển thị chi tiết */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogTitle>{selectedNotification?.eventName}</DialogTitle>
          <DialogDescription>
            <div className="text-sm mt-2 space-y-2">
              <p><strong>Type:</strong> {selectedNotification?.eventType}</p>
              <p><strong>Date:</strong> {new Date(selectedNotification?.eventDate || "").toLocaleString()}</p>
              <p><strong>Class:</strong> {selectedNotification?.className}</p>
              {selectedNotification?.eventImage && (
                <img
                  src={selectedNotification.eventImage}
                  alt="Event"
                  className="w-full max-h-60 object-contain mt-2 rounded"
                />
              )}
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
