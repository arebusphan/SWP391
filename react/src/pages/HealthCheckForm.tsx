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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", form);
        // Later: send form via axios
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6 text-blue-900">Submit Health Check Request</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 max-w-4xl">
                <input
                    name="heightCm"
                    placeholder="Height (cm)"
                    value={form.heightCm}
                    onChange={handleChange}
                    className="input"
                />
                <input
                    name="weightKg"
                    placeholder="Weight (kg)"
                    value={form.weightKg}
                    onChange={handleChange}
                    className="input"
                />
                <input
                    name="leftEyeVision"
                    placeholder="Left Eye Vision"
                    value={form.leftEyeVision}
                    onChange={handleChange}
                    className="input"
                />
                <input
                    name="rightEyeVision"
                    placeholder="Right Eye Vision"
                    value={form.rightEyeVision}
                    onChange={handleChange}
                    className="input"
                />
                <input
                    name="leftEarHearing"
                    placeholder="Left Ear Hearing"
                    value={form.leftEarHearing}
                    onChange={handleChange}
                    className="input"
                />
                <input
                    name="rightEarHearing"
                    placeholder="Right Ear Hearing"
                    value={form.rightEarHearing}
                    onChange={handleChange}
                    className="input"
                />
                <input
                    name="spineStatus"
                    placeholder="Spine Status"
                    value={form.spineStatus}
                    onChange={handleChange}
                    className="input"
                />
                <input
                    name="skinStatus"
                    placeholder="Skin Status"
                    value={form.skinStatus}
                    onChange={handleChange}
                    className="input"
                />
                <input
                    name="oralHealth"
                    placeholder="Oral Health"
                    value={form.oralHealth}
                    onChange={handleChange}
                    className="input"
                />
                <input
                    name="recordedBy"
                    placeholder="Recorded By"
                    value={form.recordedBy}
                    onChange={handleChange}
                    className="input"
                />
                <textarea
                    name="otherNotes"
                    placeholder="Other Notes"
                    value={form.otherNotes}
                    onChange={handleChange}
                    className="col-span-2 input resize-none h-24"
                />
                <button
                    type="submit"
                    className="col-span-2 bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default HealthCheckForm;
