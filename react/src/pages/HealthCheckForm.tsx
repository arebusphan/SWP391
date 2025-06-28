import { useState, useEffect } from "react";

interface Class {
    classId: number;
    className: string;
}

interface Student {
    studentId: number;
    fullName: string;
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

    useEffect(() => {
        fetch("https://localhost:7195/api/classes", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => res.json())
            .then(data => setClasses(data));
    }, []);

    useEffect(() => {
        if (selectedClassId) {
            fetch(`https://localhost:7195/api/students/by-class/${selectedClassId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
                .then(res => res.json())
                .then(data => setStudents(data));
        }
    }, [selectedClassId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!studentId) {
            alert("Please select a student before submitting the report.");
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
            const response = await fetch(`https://localhost:7195/api/students/${studentId}/healthCheck`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) throw new Error(await response.text());

            alert("✅ Health check report submitted successfully!");
        } catch (error: any) {
            alert("❌ Error submitting report:\n" + error.message);
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold mb-6 text-blue-600 text-center">Periodic Health Check</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                        <label className="block mb-1 font-semibold">Select Class:</label>
                        <select
                            value={selectedClassId ?? ""}
                            onChange={e => setSelectedClassId(Number(e.target.value))}
                            className="w-full border rounded-lg px-4 py-2"
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

                    <div>
                        <label className="block mb-1 font-semibold">Select Student:</label>
                        <select
                            value={studentId}
                            onChange={e => setStudentId(e.target.value)}
                            className="w-full border rounded-lg px-4 py-2"
                            required
                        >
                            <option value="">-- Select Student --</option>
                            {students.map((stu) => (
                                <option key={stu.studentId} value={stu.studentId.toString()}>
                                    {stu.fullName} (ID: {stu.studentId})
                                </option>
                            ))}
                        </select>
                    </div>

                    <input className="input" name="heightCm" placeholder="Height (cm)" value={form.heightCm} onChange={handleChange} />
                    <input className="input" name="weightKg" placeholder="Weight (kg)" value={form.weightKg} onChange={handleChange} />
                    <input className="input" name="leftEyeVision" placeholder="Left Eye Vision" value={form.leftEyeVision} onChange={handleChange} />
                    <input className="input" name="rightEyeVision" placeholder="Right Eye Vision" value={form.rightEyeVision} onChange={handleChange} />
                    <input className="input" name="leftEarHearing" placeholder="Left Ear Hearing" value={form.leftEarHearing} onChange={handleChange} />
                    <input className="input" name="rightEarHearing" placeholder="Right Ear Hearing" value={form.rightEarHearing} onChange={handleChange} />
                    <input className="input" name="spineStatus" placeholder="Spine Status" value={form.spineStatus} onChange={handleChange} />
                    <input className="input" name="skinStatus" placeholder="Skin Status" value={form.skinStatus} onChange={handleChange} />
                    <input className="input md:col-span-2" name="oralHealth" placeholder="Oral Health" value={form.oralHealth} onChange={handleChange} />
                    <textarea className="input col-span-2 resize-none h-24" name="otherNotes" placeholder="Other Notes" value={form.otherNotes} onChange={handleChange} />
                    <div className="md:col-span-2 text-center">
                        <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition duration-200">
                            Submit Report
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HealthCheckForm;
