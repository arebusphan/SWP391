import { useEffect, useState } from "react";
import axios from "axios";
import {
    getAllClass,
    getStudentsByClassId,
    GetSupplies,
    postIncident
} from "../service/serviceauth";

export interface IncidentInput {
    studentId: number;
    classId: number;
    incidentName: string;
    description: string;
    handledBy: string;
    occurredAt: string;
    createdAt: string;
}

interface Class {
    classId: number;
    className: string;
}

interface Student {
    studentId: number;
    fullName: string;
}

interface Supply {
    supplyId: number;
    supplyName: string;
    quantity: number;
}

export default function IncidentManagement() {
    const [classes, setClasses] = useState<Class[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [supplies, setSupplies] = useState<Supply[]>([]);
    const [selectedSupplyId, setSelectedSupplyId] = useState<number | null>(null);
    const [usedQuantity, setUsedQuantity] = useState<number>(1);
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

    const [form, setForm] = useState<IncidentInput>({
        studentId: 0,
        classId: 0,
        incidentName: "",
        description: "",
        handledBy: "",
        occurredAt: "",
        createdAt: ""
    });

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const classList = await getAllClass();
                setClasses(classList);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách lớp:", error);
            }
        };
        fetchClasses();
    }, []);

    useEffect(() => {
        const fetchSupplies = async () => {
            try {
                const res = await GetSupplies();
                setSupplies(res.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách thuốc:", error);
            }
        };
        fetchSupplies();
    }, []);

    useEffect(() => {
        if (selectedClassId) {
            const fetchStudents = async () => {
                try {
                    const studentList = await getStudentsByClassId(selectedClassId);
                    setStudents(studentList);
                } catch (error) {
                    console.error("Lỗi khi lấy học sinh:", error);
                }
            };
            fetchStudents();
        }
    }, [selectedClassId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedClassId || !selectedStudentId) {
            alert("Vui lòng chọn lớp và học sinh.");
            return;
        }

        try {
            if (selectedSupplyId && usedQuantity > 0) {
                await axios.put("/api/medicalsupplies/post/used", {
                    supplyId: selectedSupplyId,
                    quantity: usedQuantity
                });
            }

            await postIncident(
                selectedStudentId,
                selectedClassId,
                form.incidentName,
                form.description,
                form.handledBy,
                form.occurredAt,
                form.createdAt
            );

            alert("Gửi sự cố thành công!");
        } catch (err) {
            console.error("Lỗi khi gửi sự cố:", err);
            alert("Có lỗi xảy ra!");
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold mb-6 text-blue-600 text-center">Khai báo sự cố y tế</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Lớp */}
                    <div>
                        <label className="block mb-1 font-semibold">Chọn lớp:</label>
                        <select
                            value={selectedClassId ?? ""}
                            onChange={(e) => setSelectedClassId(Number(e.target.value))}
                            className="w-full border rounded-lg px-4 py-2"
                            required
                        >
                            <option value="">-- Chọn lớp --</option>
                            {classes.map((cls) => (
                                <option key={cls.classId} value={cls.classId}>
                                    {cls.className}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Học sinh */}
                    <div>
                        <label className="block mb-1 font-semibold">Chọn học sinh:</label>
                        <select
                            value={selectedStudentId ?? ""}
                            onChange={(e) => setSelectedStudentId(Number(e.target.value))}
                            className="w-full border rounded-lg px-4 py-2"
                            required
                        >
                            <option value="">-- Chọn học sinh --</option>
                            {students.map((s) => (
                                <option key={s.studentId} value={s.studentId}>
                                    {s.fullName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Tên sự cố */}
                    <div className="md:col-span-2">
                        <label className="block mb-1 font-semibold">Tên sự cố:</label>
                        <input
                            name="incidentName"
                            value={form.incidentName}
                            onChange={handleInputChange}
                            placeholder="VD: Ngã, sốt, côn trùng cắn..."
                            className="w-full border rounded-lg px-4 py-2"
                            required
                        />
                    </div>

                    {/* Mô tả */}
                    <div className="md:col-span-2">
                        <label className="block mb-1 font-semibold">Mô tả:</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleInputChange}
                            rows={3}
                            placeholder="Mô tả chi tiết sự cố..."
                            className="w-full border rounded-lg px-4 py-2"
                            required
                        />
                    </div>

                    {/* Người xử lý */}
                    <div>
                        <label className="block mb-1 font-semibold">Người xử lý:</label>
                        <input
                            name="handledBy"
                            value={form.handledBy}
                            onChange={handleInputChange}
                            className="w-full border rounded-lg px-4 py-2"
                            required
                        />
                    </div>

                    {/* Thời điểm xảy ra */}
                    <div>
                        <label className="block mb-1 font-semibold">Thời điểm xảy ra:</label>
                        <input
                            type="datetime-local"
                            name="occurredAt"
                            value={form.occurredAt}
                            onChange={handleInputChange}
                            className="w-full border rounded-lg px-4 py-2"
                            required
                        />
                    </div>

                    {/* Thời điểm tạo */}
                    <div className="md:col-span-2">
                        <label className="block mb-1 font-semibold">Thời điểm tạo:</label>
                        <input
                            type="datetime-local"
                            name="createdAt"
                            value={form.createdAt}
                            onChange={handleInputChange}
                            className="w-full border rounded-lg px-4 py-2"
                            required
                        />
                    </div>

                    {/* Vật tư */}
                    <div>
                        <label className="block mb-1 font-semibold">Chọn vật tư:</label>
                        <select
                            value={selectedSupplyId ?? ""}
                            onChange={(e) => setSelectedSupplyId(Number(e.target.value))}
                            className="w-full border rounded-lg px-4 py-2"
                        >
                            <option value="">-- Chọn vật tư --</option>
                            {supplies.map((supply) => (
                                <option key={supply.supplyId} value={supply.supplyId}>
                                    {supply.supplyName} (Còn lại: {supply.quantity})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Số lượng */}
                    <div>
                        <label className="block mb-1 font-semibold">Số lượng sử dụng:</label>
                        <input
                            type="number"
                            value={usedQuantity}
                            min={1}
                            onChange={(e) => setUsedQuantity(Number(e.target.value))}
                            className="w-full border rounded-lg px-4 py-2"
                        />
                    </div>

                    {/* Nút gửi */}
                    <div className="md:col-span-2 text-center">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition duration-200"
                        >
                            Gửi sự cố
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
