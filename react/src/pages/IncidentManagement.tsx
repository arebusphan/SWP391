"use client";

import { useEffect, useState } from "react";
import { getAllClass, getStudentsByClassId, GetSupplies, postIncident } from "@/service/serviceauth";
import IncidentHistory from "./IncidentHistory";
import IncidentHistoryGroup from "./IncidentHistory";

export default function IncidentFormFull() {
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
    const [classDropdownOpen, setClassDropdownOpen] = useState(false);
    const [studentDropdownOpen, setStudentDropdownOpen] = useState(false);
    const [studentSearchQuery, setStudentSearchQuery] = useState("");
    const [classSearchQuery, setClassSearchQuery] = useState("");

    const [incidentName, setIncidentName] = useState("");
    const [description, setDescription] = useState("");
    const [handledBy, setHandledBy] = useState("");
    const [refreshHistory, setRefreshHistory] = useState(false);
    const [supplies, setSupplies] = useState<any[]>([]);
    const [selectedSupplyId, setSelectedSupplyId] = useState<number>(0);
    const [supplyQuantity, setSupplyQuantity] = useState<number>(1);
    const [selectedSupplies, setSelectedSupplies] = useState<{ supplyId: number; quantityUsed: number; supplyName: string }[]>([]);

    useEffect(() => {
        getAllClass().then(setClasses);
        GetSupplies().then(setSupplies);
    }, []);

    useEffect(() => {
        const fetchStudents = async () => {
            let result: any[] = [];
            for (const id of selectedClasses) {
                const res = await getStudentsByClassId(id);
                const studentsWithClass = res.map((stu: any) => ({
                    ...stu,
                    classId: id,
                }));
                result = [...result, ...studentsWithClass];
            }
            setStudents(result);
            setFilteredStudents(result);
            setSelectedStudents([]);
            setStudentSearchQuery("");
        };

        fetchStudents();
    }, [selectedClasses]);

    const toggleClass = (id: number) => {
        setSelectedClasses((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const toggleStudent = (id: number) => {
        setSelectedStudents((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const toggleSelectAllStudents = () => {
        if (selectedStudents.length === filteredStudents.length) {
            setSelectedStudents([]);
        } else {
            const allIds = filteredStudents.map((stu) => stu.studentId);
            setSelectedStudents(allIds);
        }
    };
    const removeSupply = (index: number) => {
        setSelectedSupplies(prev => prev.filter((_, i) => i !== index));
    };

    const handleClassSearch = (value: string) => {
        setClassSearchQuery(value);
    };

    const handleStudentSearch = (value: string) => {
        setStudentSearchQuery(value);
        const filtered = students.filter((stu) =>
            stu.fullName.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredStudents(filtered);
    };

    const selectedClassNames = classes
        .filter((cls) => selectedClasses.includes(cls.classId))
        .map((c) => c.className)
        .join(", ");

    const displaySelectedStudents = () => {
        const names = students
            .filter((stu) => selectedStudents.includes(stu.studentId))
            .map((s) => s.fullName);

        if (names.length === 0) return "";

        if (names.length <= 2) return names.join(", ");

        return `${names.slice(0, 2).join(", ")}... (${names.length} students)`;
    };

    const addSupply = () => {
        if (selectedSupplyId === 0 || supplyQuantity <= 0) {
            alert("Please select a supply and enter a valid quantity.");
            return;
        }

        const selectedSupply = supplies.find(s => s.supplyId === selectedSupplyId);
        if (!selectedSupply) return;

        setSelectedSupplies(prev => [
            ...prev,
            {
                supplyId: selectedSupplyId,
                quantityUsed: supplyQuantity,
                supplyName: selectedSupply.supplyName,
            },
        ]);

        setSelectedSupplyId(0);
        setSupplyQuantity(1);
    };

    const handleSubmit = async () => {
        if (
            !incidentName ||
            !handledBy ||
            selectedStudents.length === 0 ||
            selectedClasses.length === 0
        ) {
            alert("Please complete all required fields.");
            return;
        }

        const occurredAt = new Date().toISOString();

        for (const studentId of selectedStudents) {
            const student = students.find((s) => s.studentId === studentId);
            if (!student) continue;

            const className =
                classes.find((c) => c.classId === student.classId)?.className || "";

            await postIncident(
                student.studentId,
                student.classId,
                incidentName,
                description,
                handledBy,
                occurredAt,
                student.fullName,
                className,
                selectedSupplies
            );
        }

        alert("Incident report submitted successfully!");
        setRefreshHistory(true);
        resetForm();
    };

    const resetForm = () => {
        setIncidentName("");
        setDescription("");
        setHandledBy("");
        setSelectedClasses([]);
        setStudents([]);
        setFilteredStudents([]);
        setSelectedStudents([]);
        setClassDropdownOpen(false);
        setStudentDropdownOpen(false);
        setClassSearchQuery("");
        setStudentSearchQuery("");
        setSelectedSupplies([]);
    };

    return (
        <div className="mx-auto  rounded-2xl">
            <h1 className="text-4xl font-bold text-blue-800 p-10">Incident Management</h1>
            <div className="bg-white rounded-2xl mb-10 px-2 py-2">
            {/* Select Class & Student */}
            <div className="flex gap-10  flex-wrap">
                {/* Class */}
                <div className="relative w-64">
                    <label className="font-semibold text-blue-900">Select Class:</label>
                    <div
                        onClick={() => setClassDropdownOpen(!classDropdownOpen)}
                        className="border rounded-xl p-2 mt-1 cursor-pointer hover:bg-blue-50 transition"
                    >
                        {selectedClasses.length > 0 ? selectedClassNames : "Select class..."}
                    </div >

                    {classDropdownOpen && (
                        <div className="absolute z-10 w-full bg-white border rounded-xl mt-1 p-2 shadow-xl max-h-64 overflow-y-auto">
                            <input
                                type="text"
                                value={classSearchQuery}
                                onChange={(e) => handleClassSearch(e.target.value)}
                                placeholder="Search class..."
                                className="w-full border rounded-lg p-1 mb-2 focus:ring focus:border-blue-400"
                            />

                            {classes
                                .filter((cls) =>
                                    cls.className.toLowerCase().includes(classSearchQuery.toLowerCase())
                                )
                                .map((cls) => (
                                    <label
                                        key={cls.classId}
                                        className="flex items-center gap-2 py-1 hover:bg-blue-50 rounded px-1"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedClasses.includes(cls.classId)}
                                            onChange={() => toggleClass(cls.classId)}
                                        />
                                        {cls.className}
                                    </label>
                                ))}
                        </div>
                    )}
                </div>

                {/* Student */}
                {selectedClasses.length > 0 && (
                    <div className="relative w-80">
                        <label className="font-semibold text-blue-900">Select Student:</label>
                        <div
                            onClick={() => setStudentDropdownOpen(!studentDropdownOpen)}
                            className="border rounded-xl p-2 mt-1 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap hover:bg-blue-50 transition"
                        >
                            {selectedStudents.length > 0
                                ? displaySelectedStudents()
                                : "Select student..."}
                        </div>

                        {studentDropdownOpen && (
                            <div className="absolute z-10 w-full bg-white border rounded-xl mt-1 p-2 shadow-xl max-h-64 overflow-y-auto">
                                <input
                                    type="text"
                                    value={studentSearchQuery}
                                    onChange={(e) => handleStudentSearch(e.target.value)}
                                    placeholder="Search student..."
                                    className="w-full border rounded-lg p-1 mb-2 focus:ring focus:border-blue-400"
                                />

                                <div className="flex items-center gap-2 mb-2">
                                    <input
                                        type="checkbox"
                                        checked={
                                            selectedStudents.length === filteredStudents.length &&
                                            filteredStudents.length > 0
                                        }
                                        onChange={() => toggleSelectAllStudents()}
                                    />
                                    <span className="font-semibold text-blue-900">Select All</span>
                                </div>

                                {filteredStudents.length === 0 && (
                                    <div className="text-gray-500 text-sm">No students available</div>
                                )}

                                {filteredStudents.map((stu) => (
                                    <label
                                        key={stu.studentId}
                                        className="flex items-center gap-2 py-1 hover:bg-blue-50 rounded px-1"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedStudents.includes(stu.studentId)}
                                            onChange={() => toggleStudent(stu.studentId)}
                                        />
                                        {stu.fullName}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Incident & Handler */}
            <div className="flex gap-10 flex-wrap">
                <div className="w-64">
                    <label className="font-semibold text-blue-900">Incident Name:</label>
                    <input
                        type="text"
                        value={incidentName}
                        onChange={(e) => setIncidentName(e.target.value)}
                        className="w-full border rounded-xl p-2 mt-1 focus:ring focus:border-blue-400"
                    />
                </div>
                <div className="w-64">
                    <label className="font-semibold text-blue-900">Handled By:</label>
                    <input
                        type="text"
                        value={handledBy}
                        onChange={(e) => setHandledBy(e.target.value)}
                        className="w-full border rounded-xl p-2 mt-1 focus:ring focus:border-blue-400"
                    />
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="font-semibold text-blue-900">Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border rounded-xl p-2 mt-1 min-h-[120px] focus:ring focus:border-blue-400"
                />
            </div>

            {/* Supplies */}
            <div>
                <label className="font-semibold text-blue-900">Medical Supplies Used:</label>
                <div className="flex gap-3 mt-2 flex-wrap items-center">
                    <select
                        value={selectedSupplyId}
                        onChange={(e) => setSelectedSupplyId(Number(e.target.value))}
                        className="border rounded-xl p-2 min-w-[180px] focus:ring focus:border-blue-400"
                    >
                        <option value={0}>-- Select Supply --</option>
                        {supplies.map((sup) => (
                            <option key={sup.supplyId} value={sup.supplyId}>
                                {sup.supplyName}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        min={1}
                        value={supplyQuantity}
                        onChange={(e) => setSupplyQuantity(Number(e.target.value))}
                        className="border rounded-xl p-2 w-24 focus:ring focus:border-blue-400"
                    />

                    <button
                        type="button"
                        onClick={addSupply}
                        className="bg-blue-900 text-white px-4 py-2 rounded-xl hover:bg-blue-800"
                    >
                        Add Supply
                    </button>
                </div>

                {/* Display selected supplies */}
                <ul className="gap-10 flex">
                    {selectedSupplies.map((sup, index) => (
                        <li key={index} className="flex items-center gap-4 text-blue-900">
                            <span>{sup.supplyName} — {sup.quantityUsed}</span>
                            <button
                                type="button"
                                onClick={() => removeSupply(index)}
                                className="text-red-600 font-bold hover:underline text-sm"
                            >
                                X
                            </button>
                        </li>
                    ))}
                </ul>

            </div>

            {/* Submit */}
            <div className="flex justify-end">
                <button
                    onClick={handleSubmit}
                    className="bg-blue-900 text-white px-6 py-2 rounded-2xl shadow hover:bg-blue-800 transition"
                >
                    Submit Report
                </button>
            </div>
            </div>
            <IncidentHistoryGroup
                refresh={refreshHistory}
                onRefreshed={() => setRefreshHistory(false)}
            />

        </div>
    );
}
