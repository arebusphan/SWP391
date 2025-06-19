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
        setFormData({
            studentId: 0,
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
        <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Health Profile Management</h2>

            <button
                onClick={startNewForm}
                className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                ➕ Submit New Profile
            </button>

            {/* Submitted List */}
            <h3 className="text-xl font-bold mt-6 mb-2 text-gray-800">Submitted Profiles</h3>
            <ul className="space-y-3">
                {submitted.map((p) => (
                    <li key={p.declarationId} className="border p-3 rounded bg-gray-50">
                        <div><strong>Student:</strong> {students.find(s => s.studentId === p.studentId)?.fullName}</div>
                        <div><strong>Vision:</strong> {p.vision} | <strong>Hearing:</strong> {p.hearing}</div>
                        <button onClick={() => handleEdit(p)} className="text-blue-600 underline mt-1">✏️ Edit</button>
                    </li>
                ))}
            </ul>

            {/* Conditional Form Display */}
            {showForm && (
                <>
                    <h3 className="text-xl font-bold mt-8 text-gray-800">
                        {editingId ? "Edit Health Profile" : "New Health Profile"}
                    </h3>

                    <div className="mb-4 mt-2">
                        <label className="block font-semibold mb-1">Select Student</label>
                        <select
                            name="studentId"
                            value={formData.studentId}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                        >
                            <option value="">-- Select Student --</option>
                            {students.map((s) => (
                                <option key={s.studentId} value={s.studentId}>
                                    {s.fullName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {["allergies", "chronicDiseases", "vision", "hearing", "otherNotes"].map((field) => (
                        <div className="mb-4" key={field}>
                            <label className="block font-semibold mb-1 capitalize">{field}</label>
                            <input
                                type="text"
                                name={field}
                                value={formData[field as keyof HealthProfileDTO]}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded"
                            />
                        </div>
                    ))}

                    <button
                        onClick={handleSubmit}
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                        disabled={submitting}
                    >
                        {submitting ? "Submitting..." : editingId ? "Update" : "Submit"}
                    </button>
                </>
            )}
        </div>
    );
};

export default ParentHealthForm;
