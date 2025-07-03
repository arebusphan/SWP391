import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    AddSupplyToInventory,
    getAllClass,
    
    GetSupplies,
    postIncident,
    GetIncidentHistory,
} from "../service/serviceauth";


import IncidentDetailDialog from "../components/IncidentDetailDialog";
import IncidentHistory from "../components/IncidentHistory";

export interface Class { classId: number; className: string; }
export interface Student { studentId: number; fullName: string; }
export interface Supply { supplyId: number; supplyName: string; quantity: number; }
export interface SupplyUsed { supplyId: number; supplyName: string; quantity: number; }
export interface DetailInput {
    classId: number | "";
    studentIds: number[];
    students: Student[];
    handledBy: string;
    description: string;
    suppliesUsed: SupplyUsed[];
    showDetailDialog?: boolean;
    showStudentDropdown?: boolean;
}
export interface IncidentInput {
    id: number;
    incidentName: string;
    details: DetailInput[];
    showDialog: boolean;
}
export interface IncidentHistoryItem {
    className: string;
    studentName: string;
    incidentName: string;
    handledBy: string;
    description: string;
    createdAt: string;
    supplies?: { supplyName: string; quantity: number }[];
}
let nextIncidentId = 1;

const IncidentForm: React.FC = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [incidentList, setIncidentList] = useState<IncidentInput[]>([]);
    const [allSupplies, setAllSupplies] = useState<Supply[]>([]);
    const [incidentHistory, setIncidentHistory] = useState<IncidentHistoryItem[]>([]);

    useEffect(() => {
        getAllClass().then(setClasses);
        GetSupplies().then(res => setAllSupplies(res.data));
        setIncidentList([
            { id: nextIncidentId++, incidentName: "", details: [], showDialog: false }
        ]);
        GetIncidentHistory().then(data => {
            const sorted = [...data].sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setIncidentHistory(sorted);
        });
    }, []);

    const handleAddDetail = (incidentId: number) => {
        setIncidentList(prev =>
            prev.map(i =>
                i.id === incidentId
                    ? {
                        ...i,
                        details: [
                            ...i.details,
                            {
                                classId: "",
                                studentIds: [],
                                students: [],
                                handledBy: "",
                                description: "",
                                suppliesUsed: [],
                                showDetailDialog: false,
                                showStudentDropdown: false,
                            },
                        ],
                    }
                    : i
            )
        );
    };

    const handleChangeIncidentName = (incidentId: number, name: string) => {
        setIncidentList(prev =>
            prev.map(i => (i.id === incidentId ? { ...i, incidentName: name } : i))
        );
    };

    const handleFieldChange = <T extends keyof DetailInput>(
        incidentId: number,
        detailIndex: number,
        field: T,
        value: DetailInput[T]
    ) => {
        setIncidentList(prev =>
            prev.map(i =>
                i.id === incidentId
                    ? {
                        ...i,
                        details: i.details.map((d, idx) =>
                            idx === detailIndex ? { ...d, [field]: value } : d
                        ),
                    }
                    : i
            )
        );
    };

    const resetIncidentForm = () => {
        setIncidentList([
            { id: nextIncidentId++, incidentName: "", details: [], showDialog: false }
        ]);
    };

    const handleSaveAll = async () => {
        for (const incident of incidentList) {
            for (const detail of incident.details) {
                if (
                    detail.classId &&
                    detail.studentIds.length > 0 &&
                    incident.incidentName &&
                    detail.handledBy
                ) {
                    const now = new Date().toISOString();
                    for (const studentId of detail.studentIds) {
                        await postIncident(
                            studentId,
                            detail.classId,
                            incident.incidentName,
                            detail.description,
                            detail.handledBy,
                            now,
                            detail.suppliesUsed.map(s => ({
                                supplyId: s.supplyId,
                                quantityUsed: s.quantity,
                            }))
                        );
                    }
                    for (const s of detail.suppliesUsed) {
                        try {
                            await AddSupplyToInventory(s.supplyId, s.quantity);
                        } catch {
                            alert(`Failed to deduct ${s.quantity} of supply ID ${s.supplyId}`);
                        }
                    }
                }
            }
        }
        alert("Saved incident.");
        resetIncidentForm();
    };

    // Dialog show/hide state truyền xuống
    const handleShowDialog = (incidentId: number, open: boolean) => {
        setIncidentList(prev =>
            prev.map(i =>
                i.id === incidentId
                    ? { ...i, showDialog: open }
                    : i
            )
        );
    };

    return (
        <div className="space-y-6 p-4">
            <h1 className="text-4xl text-center font-bold text-blue-500 mb-10">Incident Management</h1>
            {incidentList.map(incident => (
                <div key={incident.id} className="relative border rounded-xl p-4 shadow bg-white space-y-4 w-150">
                    <Input
                        placeholder="Incident Name"
                        value={incident.incidentName}
                        onChange={e => handleChangeIncidentName(incident.id, e.target.value)}
                    />
                    <div className="flex gap-2">
                        <Button
                            onClick={() => handleShowDialog(incident.id, true)}
                            className="bg-blue-500 hover:bg-blue-700 px-3 py-2 rounded transition transform hover:-translate-y-1"
                        >
                            Edit Details
                        </Button>
                        <Button onClick={resetIncidentForm} className="bg-yellow-500 hover:bg-yellow-700 text-white">
                            ReLoad
                        </Button>
                        <div className="flex justify-end">
                            <Button onClick={handleSaveAll} className="bg-blue-500 hover:bg-blue-700 px-3 py-2 rounded transition transform hover:-translate-y-1"> Save</Button>
                        </div>
                    </div>
                    <IncidentDetailDialog
                        open={incident.showDialog}
                        onClose={() => handleShowDialog(incident.id, false)}
                        incident={incident}
                        classes={classes}
                        allSupplies={allSupplies}
                        onAddDetail={handleAddDetail}
                        handleFieldChange={handleFieldChange}
                        setIncidentList={setIncidentList}
                    />
                </div>
            ))}
            <IncidentHistory incidentHistory={incidentHistory} />
        </div>
    );
};

export default IncidentForm;
