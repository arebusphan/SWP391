import { useEffect, useState } from "react";

interface Notification {
  notificationType: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Dữ liệu mẫu (sau có thể thay bằng API call)
  useEffect(() => {
    const dummyData: Notification[] = [
      {
        notificationType: "Info",
        title: "System Maintenance",
        content: "Our system will undergo maintenance at 11 PM tonight.",
        createdBy: "Admin",
        createdAt: "2025-06-10T20:00:00Z",
      },
      {
        notificationType: "Warning",
        title: "Low Storage",
        content: "You are running out of storage. Please free up space.",
        createdBy: "System",
        createdAt: "2025-06-09T15:30:00Z",
      },
      {
        notificationType: "Error",
        title: "Failed Backup",
        content: "Backup failed due to network interruption.",
        createdBy: "Backup Service",
        createdAt: "2025-06-08T12:10:00Z",
      },
    ];
    setNotifications(dummyData);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications found.</p>
        ) : (
          notifications.map((note, index) => (
            <div
              key={index}
              className="border rounded-md shadow-sm bg-white p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    note.notificationType === "Info"
                      ? "bg-blue-100 text-blue-800"
                      : note.notificationType === "Warning"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {note.notificationType}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(note.createdAt).toLocaleString()}
                </span>
              </div>
              <h2 className="text-lg font-semibold">{note.title}</h2>
              <p className="text-sm text-gray-700 mt-1">{note.content}</p>
              <p className="text-xs text-gray-500 mt-2 italic">
                Created by: {note.createdBy}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
