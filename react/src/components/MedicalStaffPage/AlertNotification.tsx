import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X } from "lucide-react";

export type AlertItem = {
  id: number;
  type: "success" | "error";
  title: string;
  description: string;
};

type Props = {
  alerts: AlertItem[];
  onRemove: (id: number) => void;
};

export default function AlertNotification({ alerts, onRemove }: Props) {
  // ⏱️ Tự động xóa sau 10 giây
  useEffect(() => {
    const timers = alerts.map((alert) =>
      setTimeout(() => {
        onRemove(alert.id);
      }, 10000)
    );
    return () => timers.forEach(clearTimeout);
  }, [alerts, onRemove]);

  return (
    <div className="fixed top-16 right-6 z-50 space-y-3 w-[320px]">
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          variant={alert.type === "error" ? "destructive" : "default"}
          className={`shadow-lg relative pr-10 ${
            alert.type === "success"
              ? "border-green-500 bg-green-50 text-green-700"
              : "border-red-500 bg-red-50 text-red-700"
          }`}
        >
          {/* Nút X để đóng */}
          <button
            className="absolute right-2 top-2 text-sm text-gray-400 hover:text-gray-600"
            onClick={() => onRemove(alert.id)}
          >
            <X className="w-4 h-4" />
          </button>
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>{alert.description}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
