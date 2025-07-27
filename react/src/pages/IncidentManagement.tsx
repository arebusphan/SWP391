"use client";

import { useEffect, useState } from "react";
import { AddSupplyToInventory, getAllClass, getStudentsByClassId, GetSupplies, postIncident } from "@/service/serviceauth";

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [incidentName, setIncidentName] = useState("");
    const [description, setDescription] = useState("");
    const [handledBy, setHandledBy] = useState("");
    const [refreshHistory, setRefreshHistory] = useState(false);
    const [supplies, setSupplies] = useState<any[]>([]);

    const [selectedSupplies, setSelectedSupplies] = useState<{ supplyId: number; quantityUsed: number; supplyName: string }[]>([]);
    const [supplyDropdownOpen, setSupplyDropdownOpen] = useState(false);
    const [supplySearchQuery, setSupplySearchQuery] = useState("");
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

    const resetForm = () => {
        setIncidentName("");
        setDescription("");
        setHandledBy("");
        setSelectedClasses([]);
        setSelectedStudents([]);
        setSelectedSupplies([]);
     
        setClassSearchQuery("");
        setStudentSearchQuery("");
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

        setIsSubmitting(true); // 🟡 Bắt đầu loading

        try {
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

            for (const supply of selectedSupplies) {
                await AddSupplyToInventory(supply.supplyId, supply.quantityUsed);
            }

            alert("Incident report submitted successfully!");
            setRefreshHistory(true);
            resetForm();
        } catch (err) {
            console.error("Error submitting incident:", err);
            alert("Failed to submit incident. Please try again.");
        } finally {
            setIsSubmitting(false); // ✅ Kết thúc loading
        }
    };

    return (
        <div className="rounded-2xl min-h-screen bg-slate-50">
            <h1 className="text-4xl font-bold text-blue-900 p-10">Incident Management</h1>

            <div className="p-10  mx-auto bg-white shadow-xl rounded-2xl space-y-10">
                {/* Incident Name */}
                <section>
                    <label className="block text-sm font-medium text-blue-900 mb-1">Incident Name</label>
                    <input
                        type="text"
                        placeholder="Enter Incident Name"
                        value={incidentName}
                        onChange={(e) => setIncidentName(e.target.value)}
                        className="w-full border border-blue-200 rounded-xl p-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                </section>

                {/* Class and Student Selection */}
                <section className="flex flex-wrap md:flex-nowrap gap-8">
                    {/* Select Class */}
                    <div className="relative w-full md:w-1/2">
                        <label className="block text-sm font-medium text-blue-900 mb-1">Select Class</label>
                        <div
                            onClick={() => setClassDropdownOpen(!classDropdownOpen)}
                            className="border border-blue-200 rounded-xl p-2 cursor-pointer hover:bg-blue-50 bg-white shadow-sm"
                        >
                            {selectedClasses.length > 0 ? selectedClassNames : "Click to select class..."}
                        </div>
                        {classDropdownOpen && (
                            <div className="absolute mt-1 w-full bg-white border rounded-xl shadow-lg z-10 max-h-64 overflow-y-auto p-2">
                                <input
                                    type="text"
                                    value={classSearchQuery}
                                    onChange={(e) => handleClassSearch(e.target.value)}
                                    placeholder="Search class..."
                                    className="w-full border rounded-md p-1 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                {classes
                                    .filter(cls =>
                                        cls.className.toLowerCase().includes(classSearchQuery.toLowerCase())
                                    )
                                    .map(cls => (
                                        <label
                                            key={cls.classId}
                                            className="flex items-center gap-2 px-1 py-1 hover:bg-blue-50 rounded"
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

                    {/* Select Student */}
                    {selectedClasses.length > 0 && (
                        <div className="relative w-full md:w-1/2">
                            <label className="block text-sm font-medium text-blue-900 mb-1">Select Student</label>
                            <div
                                onClick={() => setStudentDropdownOpen(!studentDropdownOpen)}
                                className="border border-blue-200 rounded-xl p-2 cursor-pointer hover:bg-blue-50 bg-white shadow-sm truncate"
                            >
                                {selectedStudents.length > 0 ? displaySelectedStudents() : "Click to select student..."}
                            </div>
                            {studentDropdownOpen && (
                                <div className="absolute mt-1 w-full bg-white border rounded-xl shadow-lg z-10 max-h-64 overflow-y-auto p-2">
                                    <input
                                        type="text"
                                        value={studentSearchQuery}
                                        onChange={(e) => handleStudentSearch(e.target.value)}
                                        placeholder="Search student..."
                                        className="w-full border rounded-md p-1 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    <div className="flex items-center gap-2 mb-2">
                                        <input
                                            type="checkbox"
                                            checked={
                                                selectedStudents.length === filteredStudents.length &&
                                                filteredStudents.length > 0
                                            }
                                            onChange={toggleSelectAllStudents}
                                        />
                                        <span className="text-sm font-medium text-blue-900">Select All</span>
                                    </div>
                                    {filteredStudents.length === 0 && (
                                        <div className="text-gray-500 text-sm">No students found.</div>
                                    )}
                                    {filteredStudents.map(stu => (
                                        <label
                                            key={stu.studentId}
                                            className="flex items-center gap-2 px-1 py-1 hover:bg-blue-50 rounded"
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
                </section>

                {/* Handled By & Supplies */}
                <section className="flex flex-wrap md:flex-nowrap gap-8">
                    {/* Handled By */}
                    <div className="w-full md:w-1/2">
                        <label className="block text-sm font-medium text-blue-900 mb-1">Handled By</label>
                        <input
                            type="text"
                            placeholder="Enter handler name"
                            value={handledBy}
                            onChange={(e) => setHandledBy(e.target.value)}
                            className="w-full border border-blue-200 rounded-xl p-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>

                    {/* Medical Supplies */}
                    <div className="relative w-full md:w-1/2">
                        <label className="block text-sm font-medium text-blue-900 mb-1">Medical Supplies Used</label>
                        <div
                            onClick={() => setSupplyDropdownOpen(!supplyDropdownOpen)}
                            className="border border-blue-200 rounded-xl p-2 cursor-pointer hover:bg-blue-50 bg-white shadow-sm"
                        >
                            {selectedSupplies.length > 0
                                ? `${selectedSupplies.length} selected`
                                : "Click to select supplies..."}
                        </div>
                        {supplyDropdownOpen && (
                            <div className="absolute mt-1 w-full bg-white border rounded-xl shadow-lg z-10 max-h-64 overflow-y-auto p-2">
                                <input
                                    type="text"
                                    value={supplySearchQuery}
                                    onChange={(e) => setSupplySearchQuery(e.target.value)}
                                    placeholder="Search supply..."
                                    className="w-full border rounded-md p-1 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                {[...supplies]
                                    .filter(sup =>
                                        sup.supplyName.toLowerCase().includes(supplySearchQuery.toLowerCase())
                                    )
                                    .sort((a, b) => {
                                        const aSelected = selectedSupplies.some(s => s.supplyId === a.supplyId);
                                        const bSelected = selectedSupplies.some(s => s.supplyId === b.supplyId);
                                        return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
                                    })
                                    .map(sup => {
                                        const isSelected = selectedSupplies.some(s => s.supplyId === sup.supplyId);
                                        const quantity =
                                            selectedSupplies.find(s => s.supplyId === sup.supplyId)?.quantityUsed || 1;

                                        return (
                                            <div
                                                key={sup.supplyId}
                                                className="flex items-center justify-between gap-2 px-2 py-1 hover:bg-blue-50 rounded"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => {
                                                            if (isSelected) {
                                                                setSelectedSupplies(prev =>
                                                                    prev.filter(s => s.supplyId !== sup.supplyId)
                                                                );
                                                            } else {
                                                                setSelectedSupplies(prev => [
                                                                    ...prev,
                                                                    {
                                                                        supplyId: sup.supplyId,
                                                                        supplyName: sup.supplyName,
                                                                        quantityUsed: 1,
                                                                    },
                                                                ]);
                                                            }
                                                        }}
                                                    />
                                                    <span>{sup.supplyName}</span>
                                                </div>
                                                {isSelected && (
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        value={quantity}
                                                        onChange={(e) => {
                                                            const qty = Number(e.target.value);
                                                            setSelectedSupplies(prev =>
                                                                prev.map(s =>
                                                                    s.supplyId === sup.supplyId
                                                                        ? { ...s, quantityUsed: qty }
                                                                        : s
                                                                )
                                                            );
                                                        }}
                                                        className="border rounded p-1 w-16 text-right"
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                </section>

                {/* Description */}
                <section>
                    <label className="block text-sm font-medium text-blue-900 mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter description..."
                        className="w-full border border-blue-200 rounded-xl p-2 shadow-sm min-h-[120px] focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                </section>

                {/* Submit */}
                <div className="flex justify-end pt-4 border-t">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-xl shadow transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting && (
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8H4z"
                                />
                            </svg>
                        )}
                        {isSubmitting ? "Submitting..." : "Submit Report"}
                    </button>
                </div>
            </div>

            {/* Incident History */}
            <IncidentHistoryGroup
                refresh={refreshHistory}
                onRefreshed={() => setRefreshHistory(false)}
            />
            <div className="flex justify-end pt-4 border-t">
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-xl shadow transition-all disabled:opacity-50"
                >
                    {isSubmitting ? "Submitting..." : "Submit Report"}
                </button>
            </div>
        </div>
    );



}
