import { useState } from "react";

const HealthCheckForm = () => {
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
        otherNotes: "",
        recordedBy: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Gửi dữ liệu về backend (đặt đúng URL API của bạn)
            const response = await fetch("http://localhost:5678/api/health-check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!response.ok) throw new Error("Failed to save health check");

            // Thông báo thành công, không out trang
            alert("Lưu thành công!");
        } catch (error) {
            alert("Đã có lỗi xảy ra khi lưu!");
            console.error(error);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6 text-blue-900">Submit Health Check Request</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 max-w-4xl">
                <input className="input" name="heightCm" placeholder="Height (cm)" value={form.heightCm} onChange={handleChange} />
                <input className="input" name="weightKg" placeholder="Weight (kg)" value={form.weightKg} onChange={handleChange} />
                <input className="input" name="leftEyeVision" placeholder="Left Eye Vision" value={form.leftEyeVision} onChange={handleChange} />
                <input className="input" name="rightEyeVision" placeholder="Right Eye Vision" value={form.rightEyeVision} onChange={handleChange} />
                <input className="input" name="leftEarHearing" placeholder="Left Ear Hearing" value={form.leftEarHearing} onChange={handleChange} />
                <input className="input" name="rightEarHearing" placeholder="Right Ear Hearing" value={form.rightEarHearing} onChange={handleChange} />
                <input className="input" name="spineStatus" placeholder="Spine Status" value={form.spineStatus} onChange={handleChange} />
                <input className="input" name="skinStatus" placeholder="Skin Status" value={form.skinStatus} onChange={handleChange} />
                <input className="input" name="oralHealth" placeholder="Oral Health" value={form.oralHealth} onChange={handleChange} />
                <input className="input" name="recordedBy" placeholder="Recorded By" value={form.recordedBy} onChange={handleChange} />
                <textarea className="input col-span-2 resize-none h-24" name="otherNotes" placeholder="Other Notes" value={form.otherNotes} onChange={handleChange} />
                <button type="submit" className="col-span-2 bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded">Submit</button>
            </form>
        </div>
    );
};

export default HealthCheckForm;
