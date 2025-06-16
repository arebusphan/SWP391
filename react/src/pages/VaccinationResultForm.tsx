import { useState } from "react";
import axios from "axios";

interface VaccinationForm {
    studentId: number;
    notificationId: number;
    vaccinated: boolean;
    vaccinatedDate: string;
    observationStatus: string;
    vaccinatedBy: string;
}

const VaccinationResultForm = () => {
    const [form, setForm] = useState<VaccinationForm>({
        studentId: 0,
        notificationId: 0,
        vaccinated: true,
        vaccinatedDate: "",
        observationStatus: "",
        vaccinatedBy: "BS. Hồng Hà"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post("https://localhost:7195/api/vaccinations/record", {
                ...form,
                studentId: Number(form.studentId),
                notificationId: Number(form.notificationId)
            });
            alert("Đã ghi nhận kết quả tiêm.");
        } catch (error) {
            alert("Không thể ghi nhận.");
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 bg-white shadow-md p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-6 text-blue-900 text-center">Ghi nhận kết quả tiêm</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                    <input
                        type="number"
                        name="studentId"
                        placeholder="Student ID"
                        value={form.studentId}
                        onChange={handleChange}
                        className="w-1/2 px-3 py-2 border rounded"
                        required
                    />
                    <input
                        type="number"
                        name="notificationId"
                        placeholder="Notification ID"
                        value={form.notificationId}
                        onChange={handleChange}
                        className="w-1/2 px-3 py-2 border rounded"
                        required
                    />
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        name="vaccinated"
                        checked={form.vaccinated}
                        onChange={handleChange}
                    />
                    <label>Đã tiêm</label>
                </div>

                <input
                    type="date"
                    name="vaccinatedDate"
                    value={form.vaccinatedDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                />

                <input
                    name="observationStatus"
                    placeholder="Tình trạng theo dõi sau tiêm"
                    value={form.observationStatus}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                />

                <input
                    name="vaccinatedBy"
                    placeholder="Người tiêm"
                    value={form.vaccinatedBy}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                />

                <button
                    type="submit"
                    className="w-full bg-blue-700 text-white font-semibold py-2 rounded hover:bg-blue-800"
                >
                    Ghi nhận kết quả
                </button>
            </form>
        </div>
    );
};

export default VaccinationResultForm;
