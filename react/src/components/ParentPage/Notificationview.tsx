import { useEffect, useState } from "react";
import { getNotifications } from "@/service/serviceauth";

interface EventNotification {
  id: number;
  eventName: string;
  eventType: string;
  eventDate: string;
  className: string;
  eventImage: string;
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<EventNotification[]>([]);

  useEffect(() => {
    getNotifications()
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error("Error loading notifications:", err));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">All Notifications</h1>
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications found.</p>
        ) : (
          notifications.map((note) => (
            <div
              key={note.id}
              className="border rounded-md shadow-sm bg-white p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold bg-gray-200 px-2 py-1 rounded">
                  {note.eventType}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(note.eventDate).toLocaleString()}
                </span>
              </div>
              <h2 className="text-lg font-semibold">{note.eventName}</h2>
              <p className="text-sm text-gray-700 mt-1">Class: {note.className}</p>

              {/* Optional image preview */}
              {note.eventImage && (
                <img
                  src={note.eventImage}
                  alt="Event"
                  className="mt-3 w-full max-h-60 object-contain rounded"
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
