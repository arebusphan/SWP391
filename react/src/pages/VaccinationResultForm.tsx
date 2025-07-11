import axios from "axios";
import { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

import AlertNotification from "@/components/MedicalStaffPage/AlertNotification";
import type { AlertItem } from "@/components/MedicalStaffPage/AlertNotification";
import { Pagination } from "@/components/ui/Pagination";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Class {
  classId: number;
  className: string;
}

interface NotificationBasic {
  notificationId: number;
  eventName: string;
  eventDate: string;
}

interface VaccinationStudent {
  studentId: number;
  studentName: string;
  className: string;
  confirmStatus: string;
  vaccinated?: boolean;
  vaccinatedDate?: string;
  observationStatus?: string;
  parentPhone?: string;
}

export default function VaccineResultForm() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [notifications, setNotifications] = useState<NotificationBasic[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number>(0);
  const [selectedNotificationId, setSelectedNotificationId] = useState<number>(0);
  const [students, setStudents] = useState<VaccinationStudent[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<VaccinationStudent | null>(null);
  const [vaccinated, setVaccinated] = useState<boolean | null>(null);
  const [observationStatus, setObservationStatus] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [filterVaccine, setFilterVaccine] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [vaccinatorName, setVaccinatorName] = useState<string>("");

  const studentsPerPage = 10;
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const addAlert = (alert: Omit<AlertItem, "id">) => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, ...alert }]);
  };
  const removeAlert = (id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  useEffect(() => {
    axios.get("https://localhost:7195/api/classes").then((res) => {
      setClasses(res.data);
      setSelectedClassId(res.data[0]?.classId);
    });
    axios.get("https://localhost:7195/api/notifications/list-basic").then((res) => {
      setNotifications(res.data);
      setSelectedNotificationId(res.data[0]?.notificationId);
    });
  }, []);

  useEffect(() => {
    if (selectedClassId && selectedNotificationId) {
      axios
        .get("https://localhost:7195/api/vaccinations/by-notification", {
          params: { notificationId: selectedNotificationId, classId: selectedClassId },
        })
        .then((res) => setStudents(res.data));
    }
  }, [selectedClassId, selectedNotificationId]);

  const handleSave = async () => {
    if (!selectedStudent || vaccinated === null || !vaccinatorName.trim()) {
      addAlert({
        type: "error",
        title: "Missing information",
        description: "Please fill in vaccination status and vaccinator name.",
      });
      return;
    }

    try {
      await axios.post("https://localhost:7195/api/vaccinations/record", {
        studentId: selectedStudent.studentId,
        notificationId: selectedNotificationId,
        vaccinated,
        vaccinatedDate: new Date().toISOString(),
        observationStatus,
        vaccinatedBy: vaccinatorName,
      });

      addAlert({
        type: "success",
        title: "Saved Successfully",
        description: `${selectedStudent.studentName} marked as ${vaccinated ? "vaccinated" : "not vaccinated"}.`,
      });

      setSelectedStudent(null);
      setVaccinated(null);
      setObservationStatus("");

      const res = await axios.get("https://localhost:7195/api/vaccinations/by-notification", {
        params: { notificationId: selectedNotificationId, classId: selectedClassId },
      });
      setStudents(res.data);
    } catch (error) {
      console.error(error);
      addAlert({
        type: "error",
        title: "Save Failed",
        description: "Could not save the vaccination result. Please try again.",
      });
    }
  };

  const filtered = students.filter((s) => {
    const matchVaccine =
      filterVaccine === "Vaccinated"
        ? s.vaccinated === true
        : filterVaccine === "NotVaccinated"
        ? !s.vaccinated
        : true;
    return s.confirmStatus === "Confirmed" && matchVaccine;
  });

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filtered.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filtered.length / studentsPerPage);

  const handleExport = () => {
    const exportData = students
      .filter((s) => selectedIds.includes(s.studentId))
      .map((s) => ({
        "Student ID": s.studentId,
        "Student Name": s.studentName,
        "Class": s.className,
        "Vaccinated": s.vaccinated ? "Yes" : "No",
        "Vaccinated Date": s.vaccinatedDate || "",
        "Observation": s.observationStatus || "",
      }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Vaccinated List");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "vaccination_result.xlsx");
  };

  const toggleSelectAllVaccinated = () => {
    const vaccinatedIds = filtered.filter((s) => s.vaccinated).map((s) => s.studentId);
    const isAllSelected = vaccinatedIds.every((id) => selectedIds.includes(id));
    setSelectedIds(isAllSelected ? [] : vaccinatedIds);
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white mt-10 shadow-lg rounded-2xl">
      <AlertNotification alerts={alerts} onRemove={removeAlert} />

      <h2 className="text-3xl font-bold mb-8 text-center text-blue-800">💉 Vaccine Result</h2>

      {/* Filters & Export */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center items-center">
        <select
          className="border px-4 h-10 rounded-lg shadow-sm text-sm"
          value={selectedNotificationId}
          onChange={(e) => {
            setSelectedNotificationId(+e.target.value);
            setCurrentPage(1);
          }}
        >
          {notifications.map((n) => (
            <option key={n.notificationId} value={n.notificationId}>
              {n.eventName} ({n.eventDate})
            </option>
          ))}
        </select>

        <select
          className="border px-4 h-10 rounded-lg shadow-sm text-sm"
          value={selectedClassId}
          onChange={(e) => {
            setSelectedClassId(+e.target.value);
            setCurrentPage(1);
          }}
        >
          {classes.map((c) => (
            <option key={c.classId} value={c.classId}>
              {c.className}
            </option>
          ))}
        </select>

        <select
          className="border px-4 h-10 rounded-lg shadow-sm text-sm"
          value={filterVaccine}
          onChange={(e) => {
            setFilterVaccine(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All</option>
          <option value="Vaccinated">Vaccinated</option>
          <option value="NotVaccinated">Not Vaccinated</option>
        </select>

        <input
          type="text"
          value={vaccinatorName}
          onChange={(e) => setVaccinatorName(e.target.value)}
          className="border px-4 h-10 rounded-lg shadow-sm text-sm w-56"
          placeholder="Vaccinated by (required)"
        />

        <button
          onClick={handleExport}
          className="ml-auto bg-green-600 text-white px-4 h-10 rounded hover:bg-green-700 text-sm"
        >
          Export to Excel
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-300 rounded-md">
          <thead className="bg-blue-100 text-gray-800 text-center font-semibold">
            <tr>
              <th className="border px-4 py-2">Student ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Vaccinated</th>
              <th className="border px-4 py-2">Action</th>
              <th className="border px-4 py-2">
                <div className="flex justify-center items-center gap-2">
                  Select
                  <input
                    type="checkbox"
                    onChange={toggleSelectAllVaccinated}
                    checked={
                      filtered.filter((s) => s.vaccinated).every((s) => selectedIds.includes(s.studentId)) &&
                      filtered.some((s) => s.vaccinated)
                    }
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white text-center">
            {currentStudents.map((stu) => (
              <tr key={stu.studentId} className="hover:bg-blue-50 transition">
                <td className="border px-4 py-2">{stu.studentId}</td>
                <td className="border px-4 py-2">{stu.studentName}</td>
                <td className="border px-4 py-2">{stu.vaccinated ? "Yes" : "No"}</td>
                <td
                  className="border px-4 py-2 text-blue-600 underline cursor-pointer"
                  onClick={() => {
                    setSelectedStudent(stu);
                    setVaccinated(stu.vaccinated ?? null);
                    setObservationStatus(stu.observationStatus ?? "");
                  }}
                >
                  View Detail
                </td>
                <td className="border px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(stu.studentId)}
                    onChange={() =>
                      setSelectedIds((prev) =>
                        prev.includes(stu.studentId)
                          ? prev.filter((id) => id !== stu.studentId)
                          : [...prev, stu.studentId]
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* ✅ ShadCN Dialog */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>📋 Student Details</DialogTitle>
            <DialogDescription>
              Update vaccination information for {selectedStudent?.studentName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-sm text-gray-700 mt-4">
            <div><strong>Class:</strong> {selectedStudent?.className}</div>
            <div><strong>Phone:</strong> {selectedStudent?.parentPhone}</div>

            <div>
              <label className="block font-medium mb-1">Vaccination Status:</label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="vaccinated"
                    checked={vaccinated === true}
                    onChange={() => setVaccinated(true)}
                  />
                  <span className="ml-2">Vaccinated</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="vaccinated"
                    checked={vaccinated === false}
                    onChange={() => setVaccinated(false)}
                  />
                  <span className="ml-2">Not Vaccinated</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1">Observation:</label>
              <textarea
                value={observationStatus}
                onChange={(e) => setObservationStatus(e.target.value)}
                className="w-full border border-gray-300 mt-1 p-2 rounded focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              ></textarea>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setSelectedStudent(null)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
