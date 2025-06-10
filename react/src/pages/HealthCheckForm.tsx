import { useState, useEffect } from "react";

const HealthCheckForm = () => {
    const [studentId, setStudentId] = useState("");
    const [students, setStudents] = useState<any[]>([]); // hoặc kiểu Student[]
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

    // 🧠 Gọi API lấy danh sách học sinh (chỉ cần gọi 1 lần)
    useEffect(() => {
        fetch("https://localhost:7195/api/students/get-all-basic", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => res.json())
            .then(data => setStudents(data));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!studentId) {
            alert("Vui lòng chọn học sinh trước khi gửi báo cáo.");
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

            alert("✅ Gửi báo cáo sức khỏe thành công!");
        } catch (error: any) {
            alert("❌ Lỗi khi gửi báo cáo:\n" + error.message);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6 text-blue-900">Submit Health Check Request</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 max-w-4xl">

                {/* ✅ Dropdown chọn học sinh */}
                <select className="input col-span-2" value={studentId} onChange={e => setStudentId(e.target.value)}>
                    <option value="">-- Chọn học sinh --</option>
                    {students.map((stu) => (
                        <option key={stu.studentId} value={stu.studentId}>
                            {stu.fullName} (ID: {stu.studentId})
                        </option>
                    ))}
                </select>

                <input className="input" name="heightCm" placeholder="Height (cm)" value={form.heightCm} onChange={handleChange} />
                <input className="input" name="weightKg" placeholder="Weight (kg)" value={form.weightKg} onChange={handleChange} />
                <input className="input" name="leftEyeVision" placeholder="Left Eye Vision" value={form.leftEyeVision} onChange={handleChange} />
                <input className="input" name="rightEyeVision" placeholder="Right Eye Vision" value={form.rightEyeVision} onChange={handleChange} />
                <input className="input" name="leftEarHearing" placeholder="Left Ear Hearing" value={form.leftEarHearing} onChange={handleChange} />
                <input className="input" name="rightEarHearing" placeholder="Right Ear Hearing" value={form.rightEarHearing} onChange={handleChange} />
                <input className="input" name="spineStatus" placeholder="Spine Status" value={form.spineStatus} onChange={handleChange} />
                <input className="input" name="skinStatus" placeholder="Skin Status" value={form.skinStatus} onChange={handleChange} />
                <input className="input" name="oralHealth" placeholder="Oral Health" value={form.oralHealth} onChange={handleChange} />
                <textarea className="input col-span-2 resize-none h-24" name="otherNotes" placeholder="Other Notes" value={form.otherNotes} onChange={handleChange} />
                <button type="submit" className="col-span-2 bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded">Submit</button>
            </form>
        </div>
    );
};

export default HealthCheckForm;
