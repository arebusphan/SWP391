import { useState } from "react";

const VaccinationForm = () => {
    const [form, setForm] = useState({
        vaccineName: "",
        vaccinationDate: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitted:", form);
        // TODO: axios.post() here
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6 text-blue-900">Submit Vaccination Request</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 max-w-3xl">
                <input
                    name="vaccineName"
                    placeholder="Vaccine Name"
                    value={form.vaccineName}
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
