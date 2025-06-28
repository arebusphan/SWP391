import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    AddSupplyToInventory,
    getAllClass,
    GetIncidentHistory,
    getStudentsByClassId,
    GetSupplies,
    postIncident
} from "../service/serviceauth";

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

interface IncidentInput {
    id: number;
    classId: number | "";
    studentId: number | "";
    students: Student[];
    showDialog: boolean;
    incidentName: string;
    description: string;
    handledBy: string;
    suppliesUsed: { supplyId: number; supplyName: string; quantity: number }[];
    showAddSupply: boolean;
}

let nextId = 1;

const IncidentForm: React.FC = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [incidentInputs, setIncidentInputs] = useState<IncidentInput[]>([]);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);
    const [allSupplies, setAllSupplies] = useState<Supply[]>([]);
    const [selectedSupplies, setSelectedSupplies] = useState<Record<number, { supplyId: number | ""; quantity: number }[]>>({});
    const [incidentHistory, setIncidentHistory] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; 
    const totalPages = Math.ceil(incidentHistory.length / itemsPerPage);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedHistoryItem, setSelectedHistoryItem] = useState<any | null>(null);
    const filteredHistory = incidentHistory.filter(item =>
        item.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    );

 
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredHistory.slice(startIndex, startIndex + itemsPerPage);
    useEffect(() => {
        getAllClass().then(setClasses);
        GetIncidentHistory().then(setIncidentHistory);
    }, []);

    const handleAddRow = () => {
        setIncidentInputs((prev) => [
            ...prev,
            {
                id: nextId++,
                classId: "",
                studentId: "",
                students: [],
                showDialog: false,
                incidentName: "",
                description: "",
                handledBy: "",
                suppliesUsed: [],
                showAddSupply: false,
            },
        ]);
    };

    const handleDeleteRow = (rowId: number) => {
        if (window.confirm("Are you sure you want to delete this draft incident?")) {
            setIncidentInputs((rows) => rows.filter((row) => row.id !== rowId));
        }
    };

    const handleClassChange = async (rowId: number, classId: number) => {
        const students = await getStudentsByClassId(classId);
        setIncidentInputs((rows) =>
            rows.map((row) =>
                row.id === rowId ? { ...row, classId, students, studentId: "" } : row
            )
        );
    };

    const handleStudentChange = (rowId: number, studentId: number) => {
        setIncidentInputs((rows) =>
            rows.map((row) =>
                row.id === rowId ? { ...row, studentId } : row
            )
        );
    };

    const openDialog = async (rowId: number) => {
        setCurrentEditId(rowId);
        const res = await GetSupplies();
        setAllSupplies(res.data);
        setIncidentInputs((rows) =>
            rows.map((row) =>
                row.id === rowId ? { ...row, showDialog: true } : row
            )
        );
        setSelectedSupplies((prev) => ({
            ...prev,
            [rowId]: [{ supplyId: "", quantity: 1 }],
        }));
    };

    const closeDialog = () => {
        if (currentEditId !== null) {
            setIncidentInputs((rows) =>
                rows.map((row) =>
                    row.id === currentEditId ? { ...row, showDialog: false } : row
                )
            );
            setCurrentEditId(null);
        }
    };

    const updateIncidentDetails = () => {
        if (currentEditId === null) return;
        setIncidentInputs((rows) =>
            rows.map((row) =>
                row.id === currentEditId ? { ...row, showDialog: false } : row
            )
        );
        setCurrentEditId(null);
    };

    const toggleAddSupplyUI = () => {
        if (currentEditId === null) return;
        setIncidentInputs((rows) =>
            rows.map((row) =>
                row.id === currentEditId ? { ...row, showAddSupply: !row.showAddSupply } : row
            )
        );
    };

    const handleSupplyChange = (index: number, field: "supplyId" | "quantity", value: number) => {
        if (currentEditId === null) return;
        setSelectedSupplies((prev) => {
            const updated = [...(prev[currentEditId] || [])];
            if (!updated[index]) updated[index] = { supplyId: "", quantity: 1 };
            updated[index][field] = value;
            return { ...prev, [currentEditId]: updated };
        });
    };

    const addMoreSupplyField = () => {
        if (currentEditId === null) return;
        setSelectedSupplies((prev) => {
            const updated = [...(prev[currentEditId] || [])];
            updated.push({ supplyId: "", quantity: 1 });
            return { ...prev, [currentEditId]: updated };
        });
    };

    const handleAddSupply = () => {
        if (currentEditId === null) return;
        const currentSelections = selectedSupplies[currentEditId] || [];
        const updatedSupplies = [...incidentInputs];

        const currentRowIndex = updatedSupplies.findIndex((r) => r.id === currentEditId);
        const row = updatedSupplies[currentRowIndex];

        currentSelections.forEach(({ supplyId, quantity }) => {
            if (supplyId === "") return;
            const supply = allSupplies.find((s) => s.supplyId === supplyId);
            if (supply && quantity > 0 && quantity <= supply.quantity) {
                const existing = row.suppliesUsed.find((s) => s.supplyId === supplyId);
                if (existing) existing.quantity += quantity;
                else row.suppliesUsed.push({ supplyId, supplyName: supply.supplyName, quantity });
            }
        });

        updatedSupplies[currentRowIndex] = row;
        setIncidentInputs(updatedSupplies);
    };

    const handleSaveAll = async () => {
        try {
            for (const row of incidentInputs) {
                if (
                    row.classId &&
                    row.studentId &&
                    row.incidentName &&
                    row.handledBy
                ) {
                    const now = new Date().toISOString();
                    await postIncident(
                        row.studentId,
                        row.classId,
                        row.incidentName,
                        row.description,
                        row.handledBy,
                        now,
                        row.suppliesUsed.map(s => ({
                            supplyId: s.supplyId,
                            quantityUsed: s.quantity
                        }))
                    );

                    for (const s of row.suppliesUsed) {
                        try {
                            await AddSupplyToInventory(s.supplyId, s.quantity);
                        } catch (err) {
                            console.error(`Error deducting supply ${s.supplyName}:`, err);
                            alert(`Failed to deduct ${s.quantity} of supply "${s.supplyName}".`);
                        }
                    }
                }
            }

            alert("All incidents have been saved!");
            setIncidentInputs([]);
        } catch (err) {
            alert("Error saving incidents or supplies!");
        }
    };

    return (
        <div className="p-4 space-y-4">
            <Button onClick={handleAddRow}>Add Incident</Button>

            {incidentInputs.map((row) => (
                <div key={row.id} className="flex gap-4 items-end mt-2">
                    <div className="flex-1">
                        <label className="block mb-1 text-sm">Select Class</label>
                        <select
                            className="w-full border p-2 rounded"
                            value={row.classId}
                            onChange={(e) => handleClassChange(row.id, Number(e.target.value))}
                        >
                            <option value="">-- Select Class --</option>
                            {classes.map((cls) => (
                                <option key={cls.classId} value={cls.classId}>{cls.className}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1">
                        <label className="block mb-1 text-sm">Select Student</label>
                        <select
                            className="w-full border p-2 rounded"
                            value={row.studentId}
                            onChange={(e) => handleStudentChange(row.id, Number(e.target.value))}
                            disabled={!row.classId}
                        >
                            <option value="">-- Select Student --</option>
                            {row.students.map((s) => (
                                <option key={s.studentId} value={s.studentId}>{s.fullName}</option>
                            ))}
                        </select>
                    </div>

                    <Button onClick={() => openDialog(row.id)} disabled={!row.studentId}>Details</Button>
                    <Button variant="destructive" onClick={() => handleDeleteRow(row.id)}>Delete</Button>

                    <Dialog open={row.showDialog}>
                        <DialogContent className="!w-full !max-w-[1000px]">
                            <DialogHeader>
                                <DialogTitle>Incident Details</DialogTitle>
                                <DialogDescription>
                                    Enter incident name, handler, description, and select supplies if used.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-3">
                                <Input placeholder="Incident Name" value={row.incidentName} onChange={(e) => setIncidentInputs(rows => rows.map(r => r.id === row.id ? { ...r, incidentName: e.target.value } : r))} />
                                <Input placeholder="Handled By" value={row.handledBy} onChange={(e) => setIncidentInputs(rows => rows.map(r => r.id === row.id ? { ...r, handledBy: e.target.value } : r))} />
                                <textarea
                                    placeholder="Description"
                                    className="w-full border p-2 rounded"
                                    rows={3}
                                    value={row.description}
                                    onChange={(e) => setIncidentInputs(rows => rows.map(r => r.id === row.id ? { ...r, description: e.target.value } : r))}
                                />

                                <div className="border-t pt-2">
                                    <h4 className="font-medium mb-1">Used Supplies</h4>
                                    <Button variant="outline" onClick={toggleAddSupplyUI} className="mb-2">Add Supplies</Button>
                                    {row.showAddSupply && (
                                        <>
                                            {(selectedSupplies[row.id] || []).map((entry, idx) => (
                                                <div className="flex gap-2 mb-2" key={idx}>
                                                    <select
                                                        className="border p-2 rounded w-full"
                                                        value={entry.supplyId || ""}
                                                        onChange={(e) => handleSupplyChange(idx, "supplyId", Number(e.target.value))}
                                                    >
                                                        <option value="">-- Select Supply --</option>
                                                        {allSupplies.map((s) => (
                                                            <option key={s.supplyId} value={s.supplyId}>
                                                                {s.supplyName} (Available: {s.quantity})
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        value={entry.quantity}
                                                        onChange={(e) => handleSupplyChange(idx, "quantity", Number(e.target.value))}
                                                        className="w-[100px]"
                                                    />
                                                </div>
                                            ))}
                                            <Button variant="ghost" onClick={addMoreSupplyField}>Add More</Button>
                                            <Button onClick={handleAddSupply}>Confirm Supplies</Button>
                                        </>
                                    )}

                                    <ul className="text-sm list-disc ml-5 mt-2">
                                        {row.suppliesUsed.map((s, i) => (
                                            <li key={i}>{s.supplyName} × {s.quantity}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={closeDialog}>Cancel</Button>
                                <Button onClick={updateIncidentDetails}>Save Details</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            ))}
            <Input
                type="text"
                placeholder="Search by student name..."
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                }}
                className="w-full max-w-md mb-4"
            />

            {incidentInputs.length > 0 && (
                <div className="pt-4">
                    <Button onClick={handleSaveAll}>Save All</Button>
                </div>
            )}
            {incidentHistory.length > 0 && (
    <div className="mt-10">
        <h2 className="text-lg font-semibold mb-4">Incident History</h2>
        <div className="space-y-4">
                        {currentItems.map((item, index) => (
                            <div key={index} className="p-4 border rounded bg-gray-50 shadow-sm flex justify-between items-center">
                                <div>
                                    <p><strong>Class:</strong> {item.className}</p>
                                    <p><strong>Student:</strong> {item.studentName}</p>
                                </div>
                                <Button onClick={() => setSelectedHistoryItem(item)}>Detail</Button>
                            </div>
                        ))}
                        <Dialog open={selectedHistoryItem !== null} onOpenChange={() => setSelectedHistoryItem(null)}>
                            <DialogContent className="!w-full !max-w-[800px]">
                                <DialogHeader>
                                    <DialogTitle>Incident Details</DialogTitle>
                                </DialogHeader>
                                {selectedHistoryItem && (
                                    <div className="space-y-2">
                                        <p><strong>Class:</strong> {selectedHistoryItem.className}</p>
                                        <p><strong>Student:</strong> {selectedHistoryItem.studentName}</p>
                                        <p><strong>Incident:</strong> {selectedHistoryItem.incidentName}</p>
                                        <p><strong>Handled By:</strong> {selectedHistoryItem.handledBy}</p>
                                        <p><strong>Description:</strong> {selectedHistoryItem.description}</p>
                                        <p><strong>Date:</strong> {new Date(selectedHistoryItem.createdAt).toLocaleString()}</p>
                                        {selectedHistoryItem.supplies?.length > 0 && (
                                            <div>
                                                <strong>Supplies Used:</strong>
                                                <ul className="list-disc ml-6">
                                                    {selectedHistoryItem.supplies.map((s: any, idx: number) => (
                                                        <li key={idx}>{s.supplyName} × {s.quantity}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <DialogFooter>
                                    <Button onClick={() => setSelectedHistoryItem(null)}>Close</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <div className="flex justify-center mt-4 gap-2">
                            <Button
                                variant="outline"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            >
                                Prev
                            </Button>
                            <span className="flex items-center px-2">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            >
                                Next
                            </Button>
                        </div>
        </div>
    </div>
)}
        </div>
    );
};

export default IncidentForm;
