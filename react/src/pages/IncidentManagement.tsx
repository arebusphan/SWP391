import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    AddSupplyToInventory,
    getAllClass,
    getStudentsByClassId,
    GetSupplies,
    postIncident,
    GetIncidentHistory,
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

interface SupplyUsed {
    supplyId: number;
    supplyName: string;
    quantity: number;
}

interface DetailInput {
    classId: number | "";
    studentIds: number[]; // Multi-select!
    students: Student[];
    handledBy: string;
    description: string;
    suppliesUsed: SupplyUsed[];
    showDetailDialog?: boolean;
    showStudentDropdown?: boolean;
}

interface IncidentInput {
    id: number;
    incidentName: string;
    details: DetailInput[];
    showDialog: boolean;
}

interface IncidentHistoryItem {
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
 
  
 

    const [selectedIncidentGroup, setSelectedIncidentGroup] = useState<IncidentHistoryItem[] | null>(null);
 
    const [expandedClass, setExpandedClass] = useState<string | null>(null);
 
 

    useEffect(() => {
        getAllClass().then(setClasses);
        GetSupplies().then(res => setAllSupplies(res.data));
        setIncidentList([
            {
                id: nextIncidentId++,
                incidentName: "",
                details: [],
                showDialog: false, // KHÔNG mở dialog ban đầu
            },
        ]); 

        GetIncidentHistory().then(data => {
            const sorted = [...data].sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setIncidentHistory(sorted);
        });
    }, []);


    const [historyPage, setHistoryPage] = useState(1);
    const groupedIncidents = Object.entries(
        incidentHistory.reduce((groups, item) => {
            const key = item.incidentName;
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(item);
            return groups;
        }, {} as Record<string, IncidentHistoryItem[]>)
    );

    const itemsPerPageHistory = 5;
    const totalHistoryPages = Math.ceil(groupedIncidents.length / itemsPerPageHistory);
    const paginatedGroupedIncidents = groupedIncidents.slice(
        (historyPage - 1) * itemsPerPageHistory,
        historyPage * itemsPerPageHistory
    );
    
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
    const groupedByClass = (selectedIncidentGroup || []).reduce((acc, item) => {
        if (!acc[item.className]) acc[item.className] = [];
        acc[item.className].push(item);
        return acc;
    }, {} as Record<string, IncidentHistoryItem[]>);
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

    const handleClassChange = async (
        incidentId: number,
        detailIndex: number,
        classId: number
    ) => {
        const students = await getStudentsByClassId(classId);
        handleFieldChange(incidentId, detailIndex, "classId", classId);
        handleFieldChange(incidentId, detailIndex, "students", students);
        handleFieldChange(incidentId, detailIndex, "studentIds", []);
    };

    const toggleDetailDialog = (
        incidentId: number,
        detailIndex: number,
        open: boolean
    ) => {
        setIncidentList(prev =>
            prev.map(i =>
                i.id === incidentId
                    ? {
                        ...i,
                        details: i.details.map((d, idx) =>
                            idx === detailIndex
                                ? { ...d, showDetailDialog: open }
                                : d
                        ),
                    }
                    : i
            )
        );
    };

    const toggleStudentDropdown = (incidentId: number, detailIndex: number) => {
        setIncidentList(prev =>
            prev.map(i =>
                i.id === incidentId
                    ? {
                        ...i,
                        details: i.details.map((d, idx) =>
                            idx === detailIndex
                                ? { ...d, showStudentDropdown: !d.showStudentDropdown }
                                : d
                        ),
                    }
                    : i
            )
        );
    };

    const handleCheckStudent = (
        incidentId: number,
        detailIndex: number,
        studentId: number
    ) => {
        setIncidentList(prev =>
            prev.map(i =>
                i.id === incidentId
                    ? {
                        ...i,
                        details: i.details.map((d, idx) => {
                            if (idx !== detailIndex) return d;
                            const checked = d.studentIds.includes(studentId);
                            const newIds = checked
                                ? d.studentIds.filter(id => id !== studentId)
                                : [...d.studentIds, studentId];
                            return { ...d, studentIds: newIds };
                        }),
                    }
                    : i
            )
        );
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

        // ✅ Reset lại dữ liệu sau khi gửi
        setIncidentList([
            {
                id: nextIncidentId++,
                incidentName: "",
                details: [],
                showDialog: false,
            },
        ]);
    };


 
    const handleDeleteIncident = (incidentId: number) => {
        setIncidentList(prev => prev.filter(i => i.id !== incidentId));
    };

    return (
        <div className="space-y-6 p-4">
            <h1 className="text-4xl text-center font-bold text-blue-500 mb-4">Incident Management</h1>
            {incidentList.map(incident => (
                <div key={incident.id} className="relative border rounded-xl p-4 shadow bg-white space-y-4 w-150">
                    {/* Nút xóa */}
                   

                    <Input
                        placeholder="Incident Name"
                        value={incident.incidentName}
                        onChange={e =>
                            handleChangeIncidentName(incident.id, e.target.value)
                        }
                    />
                    <div className="flex gap-2">
                        <Button
                            onClick={() =>
                                setIncidentList(prev =>
                                    prev.map(i =>
                                        i.id === incident.id
                                            ? { ...i, showDialog: true }
                                            : i
                                    )
                                )
                            }
                            className="bg-blue-500 hover:bg-blue-700 px-3 py-2 rounded transition transform hover:-translate-y-1"
                        >
                            Edit Details
                        </Button>

                        <Button
                            variant="destructive"
                            onClick={() => handleDeleteIncident(incident.id)}
                            className="px-3 py-2 rounded transition transform hover:-translate-y-1"
                        >
                            Delete
                        </Button>
                        {incidentList.length > 0 && (
                            <div className="flex justify-end">
                                <Button onClick={handleSaveAll} className="bg-blue-500 hover:bg-blue-700 px-3 py-2 rounded transition transform hover:-translate-y-1"> Save</Button>
                            </div>
                        )}
                    </div>
                    <Dialog
                        open={incident.showDialog}
                        onOpenChange={() =>
                            setIncidentList(prev =>
                                prev.map(i =>
                                    i.id === incident.id
                                        ? { ...i, showDialog: false }
                                        : i
                                )
                            )
                        }
                    >
                        <DialogContent className="!max-w-[900px]">
                            <DialogHeader>
                                <DialogTitle className="text-blue-500">Incident Details</DialogTitle>
                            </DialogHeader>
                            <div className="text-right">
                                <Button
                                    variant="ghost"
                                    onClick={() =>
                                        handleAddDetail(incident.id)
                                    }
                                    className="bg-blue-500 hover:bg-blue-700 px-3 py-2 rounded transition transform hover:-translate-y-1 text-white hover:text-white" >
                                     Add  Detail
                                </Button>
                            </div>
                            {incident.details.map((detail, index) => (
                                <div key={index} className="flex items-center gap-4 mb-4">
                                    <select
                                        value={detail.classId}
                                        onChange={e =>
                                            handleClassChange(
                                                incident.id,
                                                index,
                                                Number(e.target.value)
                                            )
                                        }
                                    >
                                        <option value="">Select Class</option>
                                        {classes.map(cls => (
                                            <option key={cls.classId} value={cls.classId}>
                                                {cls.className}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Multi-select Students with checkbox */}
                                    <div className="relative inline-block w-64">
                                        <button
                                            type="button"
                                            className="w-full border rounded px-2 py-2 bg-white text-left"
                                            onClick={() => toggleStudentDropdown(incident.id, index)}
                                            disabled={!detail.classId}
                                        >
                                            {detail.studentIds.length === 0
                                                ? "Chọn học sinh"
                                                : detail.students
                                                    .filter(s => detail.studentIds.includes(s.studentId))
                                                    .map(s => s.fullName)
                                                    .join(", ")
                                            }
                                            <span className="float-right">▼</span>
                                        </button>
                                        {detail.showStudentDropdown && (
                                            <div className="absolute z-20 w-full bg-white border rounded shadow max-h-60 overflow-auto">
                                                {detail.students.length === 0 && (
                                                    <div className="px-4 py-2 text-gray-500">Không có học sinh</div>
                                                )}

                                                {/* Select all / Deselect all button */}
                                                {detail.students.length > 0 && (
                                                    <div
                                                        className="flex items-center px-4 py-2 bg-gray-50 border-b font-medium cursor-pointer hover:bg-gray-100"
                                                        onClick={() => {
                                                            if (detail.studentIds.length === detail.students.length) {
                                                                // If all are selected, deselect all
                                                                handleFieldChange(incident.id, index, "studentIds", []);
                                                            } else {
                                                                // Select all
                                                                handleFieldChange(
                                                                    incident.id,
                                                                    index,
                                                                    "studentIds",
                                                                    detail.students.map(s => s.studentId)
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            className="mr-2"
                                                            readOnly
                                                            checked={detail.studentIds.length === detail.students.length && detail.students.length > 0}
                                                        />
                                                        {detail.studentIds.length === detail.students.length && detail.students.length > 0
                                                            ? "Bỏ chọn tất cả"
                                                            : "Chọn tất cả"}
                                                    </div>
                                                )}

                                                {detail.students.map(s => (
                                                    <label
                                                        key={s.studentId}
                                                        className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={detail.studentIds.includes(s.studentId)}
                                                            onChange={() => handleCheckStudent(incident.id, index, s.studentId)}
                                                            className="mr-2"
                                                        />
                                                        {s.fullName}
                                                    </label>
                                                ))}
                                                <div className="p-2 text-right">
                                                    <Button size="sm" variant="outline" onClick={() => toggleStudentDropdown(incident.id, index)}>
                                                        OK
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                toggleDetailDialog(incident.id, index, true)
                                            }
                                            className="bg-blue-500 hover:bg-blue-700 px-3 py-2 rounded transition transform hover:-translate-y-1 text-white hover:text-white"
                                        >
                                            Edit
                                        </Button>

                                        <Button
                                            variant="destructive"
                                            onClick={() => {
                                                if (confirm("Bạn có chắc muốn xoá chi tiết này?")) {
                                                    const updatedDetails = incident.details.filter((_, i) => i !== index);
                                                    setIncidentList(prev =>
                                                        prev.map(i =>
                                                            i.id === incident.id
                                                                ? { ...i, details: updatedDetails }
                                                                : i
                                                        )
                                                    );
                                                }
                                            }}
                                            className="px-3 py-2 rounded transition transform hover:-translate-y-1"
                                        >
                                            Delete
                                        </Button>
                                    </div>

                                    {/* Detail Dialog */}
                                    <Dialog
                                        open={detail.showDetailDialog}
                                        onOpenChange={open =>
                                            toggleDetailDialog(incident.id, index, open)
                                        }
                                    >
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle className="text-blue-500">Detail #{index + 1}</DialogTitle>
                                            </DialogHeader>

                                            <Input
                                                placeholder="Handled By"
                                                value={detail.handledBy}
                                                onChange={e =>
                                                    handleFieldChange(incident.id, index, "handledBy", e.target.value)
                                                }
                                            />
                                            <Input
                                                placeholder="Description"
                                                value={detail.description}
                                                onChange={e =>
                                                    handleFieldChange(incident.id, index, "description", e.target.value)
                                                }
                                            />

                                            <Button
                                                className="mt-2 bg-blue-500 hover:bg-blue-700 text-white transition px-4 py-2 rounded w-40"
                                                onClick={() => {
                                                    const updated = [
                                                        ...detail.suppliesUsed,
                                                        {
                                                            supplyId: 0,
                                                            supplyName: "",
                                                            quantity: 1,
                                                        },
                                                    ];
                                                    handleFieldChange(incident.id, index, "suppliesUsed", updated);
                                                }}
                                            >
                                                Add Supply
                                            </Button>

                                            {detail.suppliesUsed.map((supply, i) => (
                                                <div key={i} className="flex gap-2 mt-2 items-center">
                                                    <select
                                                        value={supply.supplyId}
                                                        onChange={e => {
                                                            const id = Number(e.target.value);
                                                            const found = allSupplies.find(s => s.supplyId === id);
                                                            if (found) {
                                                                const updated = [...detail.suppliesUsed];
                                                                updated[i] = {
                                                                    ...updated[i],
                                                                    supplyId: found.supplyId,
                                                                    supplyName: found.supplyName,
                                                                };
                                                                handleFieldChange(incident.id, index, "suppliesUsed", updated);
                                                            }
                                                        }}
                                                        className="border rounded px-2 py-1"
                                                    >
                                                        <option value={0}>Select Supply</option>
                                                        {allSupplies.map(s => (
                                                            <option key={s.supplyId} value={s.supplyId}>
                                                                {s.supplyName}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <Input
                                                        type="number"
                                                        value={supply.quantity}
                                                        min={1}
                                                        className="w-20"
                                                        onChange={e => {
                                                            const updated = [...detail.suppliesUsed];
                                                            updated[i].quantity = Number(e.target.value);
                                                            handleFieldChange(incident.id, index, "suppliesUsed", updated);
                                                        }}
                                                    />

                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => {
                                                            const updated = detail.suppliesUsed.filter((_, idx) => idx !== i);
                                                            handleFieldChange(incident.id, index, "suppliesUsed", updated);
                                                        }}
                                                        className="text-white bg-red-500 hover:bg-red-500 hover:text-white "
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            ))}

                                            <DialogFooter>
                                                <Button
                                                    onClick={() => toggleDetailDialog(incident.id, index, false)}
                                                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                                                >
                                                    Close
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>


                                </div>
                            ))}

                            

                            <DialogFooter>
                                <Button
                                    onClick={() =>
                                        setIncidentList(prev =>
                                            prev.map(i =>
                                                i.id === incident.id
                                                    ? {
                                                        ...i,
                                                        showDialog: false,
                                                    }
                                                    : i
                                            )
                                        )
                                    }
                                    className="bg-blue-500 hover:bg-blue-700 px-3 py-2 rounded transition transform hover:-translate-y-1 text-white hover:text-white" >
                                    Close
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            ))}

           

            <div className="mt-10">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">Incident History</h2>

                {paginatedGroupedIncidents.map(([incidentName, items]) => (
                    <div key={incidentName} className="border rounded p-4 mb-4 bg-gray-50 shadow flex justify-between items-center">
                        <span className="font-medium text-lg text-blue-600">
                            {incidentName} ({items.length} học sinh)
                        </span>
                        <Button
                            onClick={() => setSelectedIncidentGroup(items)}
                            className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1"
                        >
                            Detail
                        </Button>
                    </div>
                ))}

                {/* Phân trang */}
                <div className="flex justify-center gap-2 mt-4">
                    <Button
                        variant="outline"
                        disabled={historyPage === 1}
                        onClick={() => setHistoryPage(p => p - 1)}
                    >
                        Trang trước
                    </Button>
                    <span className="px-2 py-1 text-gray-600">Trang {historyPage} / {totalHistoryPages}</span>
                    <Button
                        variant="outline"
                        disabled={historyPage === totalHistoryPages}
                        onClick={() => setHistoryPage(p => p + 1)}
                    >
                        Trang sau
                    </Button>
                </div>
            </div>
            <Dialog open={!!selectedIncidentGroup} onOpenChange={() => {
                setSelectedIncidentGroup(null);
                setExpandedClass(null);
            }}>
                <DialogContent className="max-w-3xl backdrop:bg-transparent">
                    <DialogHeader>
                        <DialogTitle className="text-blue-500">
                            Chi tiết sự cố: {selectedIncidentGroup?.[0]?.incidentName}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto">
                        {Object.entries(groupedByClass).map(([className, students]) => (
                            <div key={className} className="border rounded p-3 bg-gray-100">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-blue-600">{className} ({students.length} học sinh)</span>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setExpandedClass(expandedClass === className ? null : className)}
                                    >
                                        {expandedClass === className ? "Ẩn" : "Xem học sinh"}
                                    </Button>
                                </div>

                                {expandedClass === className && (
                                    <div className="mt-2 space-y-2">
                                        {students.map((item, idx) => (
                                            <div key={idx} className="border p-2 rounded bg-white">
                                                <div><strong>Học sinh:</strong> {item.studentName}</div>
                                                <div><strong>Mô tả:</strong> {item.description}</div>
                                                <div><strong>Xử lý bởi:</strong> {item.handledBy}</div>
                                                <div><strong>Thời gian:</strong> {new Date(item.createdAt).toLocaleString()}</div>
                                               
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <DialogFooter>
                        <Button onClick={() => {
                            setSelectedIncidentGroup(null);
                            setExpandedClass(null);
                        }} className="bg-blue-500 text-white">
                            Đóng
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>



        </div>
    );
};

export default IncidentForm;
