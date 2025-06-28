import { useEffect, useState } from "react";
import axios from "axios";

type Student = {
    studentId: number;
    fullName: string;
};

type HealthProfileDTO = {
    declarationId?: number;
    studentId: number;
    allergies: string;
    chronicDiseases: string;
    vision: string;
    hearing: string;
    otherNotes: string;
};

const ParentHealthForm = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [formData, setFormData] = useState<HealthProfileDTO>({
        studentId: 0,
        allergies: "",
        chronicDiseases: "",
        vision: "",
        hearing: "",
        otherNotes: "",
    });
    const [submitted, setSubmitted] = useState<HealthProfileDTO[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const token = localStorage.getItem("token");

    const fetchStudents = async () => {
        const res = await axios.get("https://localhost:7195/api/students/get-StuByGuardian", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(res.data);
    };

    const fetchSubmitted = async () => {
        const res = await axios.get("https://localhost:7195/api/HealthProfile/mine", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setSubmitted(res.data);
    };

    useEffect(() => {
        Promise.all([fetchStudents(), fetchSubmitted()]).finally(() => setLoading(false));
    }, [token]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!formData.studentId) return alert("❗ Please select a student");

        // Ngăn submit nếu đã gửi trước đó
        if (!editingId && submitted.some(p => p.studentId === formData.studentId)) {
            alert("❌ This student already has a submitted profile.");
            return;
        }

        const payload = {
            studentId: formData.studentId,
            allergies: formData.allergies,
            chronicDiseases: formData.chronicDiseases,
            vision: formData.vision,
            hearing: formData.hearing,
            otherNotes: formData.otherNotes,
        };

        setSubmitting(true);
        try {
            if (editingId) {
                await axios.put(`https://localhost:7195/api/HealthProfile/${editingId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("✅ Updated successfully");
            } else {
                await axios.post("https://localhost:7195/api/HealthProfile", payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("✅ Submitted successfully");
            }

            setFormData({
                studentId: 0,
                allergies: "",
                chronicDiseases: "",
                vision: "",
                hearing: "",
                otherNotes: "",
            });
            setEditingId(null);
            setShowForm(false);
            await fetchSubmitted();
        } catch {
            alert("❌ Operation failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (profile: HealthProfileDTO) => {
        setFormData(profile);
        setEditingId(profile.declarationId || null);
        setShowForm(true);
    };

    const startNewForm = () => {
        const submittedStudentIds = submitted.map(p => p.studentId);
        const notSubmitted = students.filter(s => !submittedStudentIds.includes(s.studentId));

        if (notSubmitted.length === 0) {
            alert("❌ All students have already submitted profiles.");
            return;
        }

        setFormData({
            studentId: notSubmitted[0].studentId,
            allergies: "",
            chronicDiseases: "",
            vision: "",
            hearing: "",
            otherNotes: "",
        });
        setEditingId(null);
        setShowForm(true);
    };

    if (loading) return <p>Loading data...</p>;

    return (
       <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-xl space-y-6">
  <h2 className="text-3xl font-bold text-blue-700 text-center">🩺 Health Profile Management</h2>

  <div className="flex justify-end">
    <button
      onClick={startNewForm}
      className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition-transform hover:scale-105"
    >
      ➕ Submit New Profile
    </button>
  </div>

  <div>
    <h3 className="text-xl font-bold mb-3 text-gray-800">📄 Submitted Profiles</h3>
    {submitted.length === 0 ? (
      <p className="text-gray-500 italic">No profiles submitted yet.</p>
    ) : (
      <ul className="space-y-3">
        {submitted.map((p) => (
          <li key={p.declarationId} className="border border-gray-200 p-4 rounded-lg bg-gray-50 shadow-sm">
            <div className="font-medium text-gray-800">
              👩‍🎓 Student: {students.find(s => s.studentId === p.studentId)?.fullName}
            </div>
            <div className="text-gray-700 text-sm mt-1">
              👁️ Vision: {p.vision} &nbsp;&nbsp; | &nbsp;&nbsp; 👂 Hearing: {p.hearing}
            </div>
            <button
              onClick={() => handleEdit(p)}
              className="text-blue-600 text-sm underline mt-2 hover:text-blue-800"
            >
              ✏️ Edit
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>

  {showForm && (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        {editingId ? "✏️ Edit Health Profile" : "➕ New Health Profile"}
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Select Student</label>
          <select
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm bg-gray-50"
            disabled={!!editingId}
          >
            <option value="">-- Select Student --</option>
            {students
              .filter(s => editingId || !submitted.some(p => p.studentId === s.studentId))
              .map((s) => (
                <option key={s.studentId} value={s.studentId}>
                  {s.fullName}
                </option>
              ))}
          </select>
        </div>

        {["allergies", "chronicDiseases", "vision", "hearing", "otherNotes"].map((field) => (
          <div key={field}>
            <label className="block font-medium mb-1 capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
            <input
              type="text"
              name={field}
              value={formData[field as keyof HealthProfileDTO]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 shadow-sm"
            />
          </div>
        ))}

        <div className="flex gap-4 justify-end pt-2">
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition-transform hover:scale-105"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : editingId ? "Update" : "Submit"}
          </button>
          <button
            onClick={() => {
              setShowForm(false);
              setEditingId(null);
              setFormData({
                studentId: 0,
                allergies: "",
                chronicDiseases: "",
                vision: "",
                hearing: "",
                otherNotes: "",
              });
            }}
            className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition"
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )}
</div>

    );
};

export default ParentHealthForm;
