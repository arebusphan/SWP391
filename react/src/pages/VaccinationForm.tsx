import axios from "axios";
import { useState } from "react";

const VaccinationForm = () => {
    const [form, setForm] = useState({
        vaccineId: "", // cần truyền ID thay vì tên
        vaccinationDate: "",
        notes: ""
    });

    const studentId = 1; // giả định bạn biết studentId từ đâu đó (nên truyền từ props hoặc context)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axios.post("https://localhost:7195/api/Vaccination", {
                studentId: studentId,
                vaccineId: parseInt(form.vaccineId),
                vaccinationDate: form.vaccinationDate,
                notes: form.notes
            });
            alert("Vaccination request submitted successfully.");
        } catch (error) {
            console.error("Submission error:", error);
            alert("Something went wrong!");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6 text-blue-900">Submit Vaccination Request</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 max-w-3xl">
                <input
                    name="vaccineId"
                    placeholder="Vaccine ID"
                    value={form.vaccineId}
                    onChange={handleChange}
                    className="input"
                />
                <input
                    name="vaccinationDate"
                    type="date"
                    value={form.vaccinationDate}
                    onChange={handleChange}
                    className="input"
                />
                <input
                    name="notes"
                    placeholder="Notes (optional)"
                    value={form.notes}
                    onChange={handleChange}
                    className="input col-span-2"
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

export default VaccinationForm;
