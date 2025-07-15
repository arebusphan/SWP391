import { useState, useEffect } from "react";
import AlertNotification from "@/components/MedicalStaffPage/AlertNotification";
import type { AlertItem } from "@/components/MedicalStaffPage/AlertNotification";
import { apiser } from "../service/apiser";
import { getStudentsByClassId } from "../service/serviceauth";

interface Class {
  classId: number;
  className: string;
}

interface Student {
  studentId: number;
  fullName: string;
  dateOfBirth: string;
}

const HealthCheckForm = () => {
  const [studentId, setStudentId] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  const [form, setForm] = useState({
    heightCm: "",
    weightKg: "",
    leftEyeVision: "",
    rightEyeVision: "",
    leftEarHearing: "",
    rightEarHearing: "",
    spineStatus: "",
    skinStatus: "",
    oralHealth: "",
    otherNotes: ""
  });

  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const addAlert = (alert: Omit<AlertItem, "id">) => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, ...alert }]);
  };
  const removeAlert = (id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

    useEffect(() => {
        apiser
            .get("/classes")
            .then((res) => setClasses(res.data))
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (selectedClassId) {
            getStudentsByClassId(selectedClassId)
                .then(setStudents)
                .catch(console.error);
        } else {
            setStudents([]);
        }
    }, [selectedClassId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentId) {
      addAlert({
        type: "error",
        title: "Validation Error",
        description: "Please select a student before submitting the report.",
      });
      return;
    }

    const requestBody = {
      heightCm: parseFloat(form.heightCm),
      weightKg: parseFloat(form.weightKg),
      leftEyeVision: parseFloat(form.leftEyeVision),
      rightEyeVision: parseFloat(form.rightEyeVision),
      leftEarHearing: form.leftEarHearing,
      rightEarHearing: form.rightEarHearing,
      spineStatus: form.spineStatus,
      skinStatus: form.skinStatus,
      oralHealth: form.oralHealth,
      otherNotes: form.otherNotes
    };

      try {
          const token = localStorage.getItem("token");
          await apiser.post(
              `/students/${studentId}/healthCheck`,
              requestBody,
              {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              }
          );

          addAlert({
              type: "success",
              title: "Success",
              description: "Health check report submitted successfully!",
          });

          // Reset form
          setForm({
              heightCm: "",
              weightKg: "",
              leftEyeVision: "",
              rightEyeVision: "",
              leftEarHearing: "",
              rightEarHearing: "",
              spineStatus: "",
              skinStatus: "",
              oralHealth: "",
              otherNotes: "",
          });
          setStudentId("");
      } catch (error: any) {
          const errorMessage =
              error.response?.data?.message || error.response?.data || error.message;

          addAlert({
              type: "error",
              title: "Submission Failed",
              description: errorMessage || "Error submitting report.",
          });
      }

  };

  return (
    <div className="min-h-screen">
      <div className=" mx-auto ">
        <h2 className="text-4xl font-bold text-blue-800 p-10">
          Periodic Health Check
        </h2>

        <AlertNotification alerts={alerts} onRemove={removeAlert} />

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Select Class */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
            <select
              value={selectedClassId ?? ""}
              onChange={(e) => setSelectedClassId(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring focus:ring-blue-200 bg-gray-50"
              required
            >
              <option value="">-- Select Class --</option>
              {classes.map((cls) => (
                <option key={cls.classId} value={cls.classId}>
                  {cls.className}
                </option>
              ))}
            </select>
          </div>

          {/* Select Student */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Student</label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring focus:ring-blue-200 bg-gray-50"
              required
            >
              <option value="">-- Select Student --</option>
              {students.map((stu) => (
                <option key={stu.studentId} value={stu.studentId}>
                  {stu.fullName} (DOB: {new Date(stu.dateOfBirth).toLocaleDateString("vi-VN")})
                </option>
              ))}
            </select>
          </div>

          {/* Form Fields */}
          <input
            name="heightCm"
            placeholder="Height (cm)"
            value={form.heightCm}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring focus:ring-blue-200 bg-gray-50"
          />

          <input
            name="weightKg"
            placeholder="Weight (kg)"
            value={form.weightKg}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring focus:ring-blue-200 bg-gray-50"
          />

          <input
            name="leftEyeVision"
            placeholder="Left Eye Vision"
            value={form.leftEyeVision}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring focus:ring-blue-200 bg-gray-50"
          />

          <input
            name="rightEyeVision"
            placeholder="Right Eye Vision"
            value={form.rightEyeVision}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring focus:ring-blue-200 bg-gray-50"
          />

          <input
            name="leftEarHearing"
            placeholder="Left Ear Hearing"
            value={form.leftEarHearing}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring focus:ring-blue-200 bg-gray-50"
          />

          <input
            name="rightEarHearing"
            placeholder="Right Ear Hearing"
            value={form.rightEarHearing}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring focus:ring-blue-200 bg-gray-50"
          />

          <input
            name="spineStatus"
            placeholder="Spine Status"
            value={form.spineStatus}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring focus:ring-blue-200 bg-gray-50"
          />

          <input
            name="skinStatus"
            placeholder="Skin Status"
            value={form.skinStatus}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring focus:ring-blue-200 bg-gray-50"
          />

          <input
            name="oralHealth"
            placeholder="Oral Health"
            value={form.oralHealth}
            onChange={handleChange}
            className="w-full md:col-span-2 border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring focus:ring-blue-200 bg-gray-50"
          />

          <textarea
            name="otherNotes"
            placeholder="Other Notes"
            value={form.otherNotes}
            onChange={handleChange}
            className="w-full col-span-2 border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring focus:ring-blue-200 bg-gray-50 resize-none h-24"
          />

          {/* Submit Button */}
          <div className="md:col-span-2 text-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HealthCheckForm;
