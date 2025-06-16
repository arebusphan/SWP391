import { useEffect, useState } from "react";
import { getNotifications } from "../service/serviceauth";

interface Notification {
  notificationType: "Info" | "Warning" | "Error";
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
}

export default function Notificationiconview() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    getNotifications()
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error("Lỗi khi lấy thông báo:", err));
  }, []);

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-semibold">Notifications</h2>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Your latest system alerts</p>
        <a href="#" className="text-sm text-blue-600 hover:underline">
          View more
        </a>
      </div>

      <div className="mt-4 space-y-4 max-h-[400px] overflow-y-auto">
        {notifications.map((note, idx) => (
          <div
            key={idx}
            className="border p-4 rounded-md shadow-sm bg-white"
          >
            <div className="flex justify-between items-center mb-1">
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
            <h4 className="font-semibold text-md">{note.title}</h4>
            <p className="text-sm text-gray-700 mt-1">{note.content}</p>
            <p className="text-xs text-gray-500 mt-2 italic">
              Created by: {note.createdBy}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
