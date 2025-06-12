import axios from "axios";
import { useState } from "react";

const VaccinationForm = () => {
    const [form, setForm] = useState({
        studentId: "",
        vaccineName: "",
        vaccinationDate: "",
        notes: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("https://localhost:7195/api/Vaccination", {
                studentId: parseInt(form.studentId),
                vaccineName: form.vaccineName,
                vaccinationDate: form.vaccinationDate,
                notes: form.notes
            });
            alert("Vaccination request submitted successfully.");
        } catch (error) {
            alert("Something went wrong!");
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl mt-12">
            <h2 className="text-3xl font-bold mb-8 text-blue-900 text-center">
                Submit Vaccination Request
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <label className="block mb-1 text-sm font-semibold text-gray-700">Student ID</label>
                        <input
                            type="number"
                            name="studentId"
                            placeholder="Student ID"
                            value={form.studentId}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block mb-1 text-sm font-semibold text-gray-700">Vaccine Name</label>
                        <input
                            name="vaccineName"
                            placeholder="Vaccine Name"
                            value={form.vaccineName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                        />
                    </div>
                </div>
                <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-700">Vaccination Date</label>
                    <input
                        name="vaccinationDate"
                        type="date"
                        value={form.vaccinationDate}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-700">Notes (optional)</label>
                    <input
                        name="notes"
                        placeholder="Notes (optional)"
                        value={form.notes}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition duration-200 shadow-md"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default VaccinationForm;
