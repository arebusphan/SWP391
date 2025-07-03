import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import MultiSelectStudent from "./MultiSelectStudent";
import { getStudentsByClassId } from "../service/serviceauth";
import type { Class, DetailInput, IncidentInput, Supply } from "../pages/IncidentManagement";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";

interface Props {
    incidentId: number;
    detail: DetailInput;
    detailIndex: number;
    classes: Class[];
    allSupplies: Supply[];
    handleFieldChange: <T extends keyof DetailInput>(
        incidentId: number,
        detailIndex: number,
        field: T,
        value: DetailInput[T]
    ) => void;
    setIncidentList: React.Dispatch<React.SetStateAction<IncidentInput[]>>;
    incident: IncidentInput;
}
const DetailInputBlock: React.FC<Props> = ({
    incidentId, detail, detailIndex, classes, allSupplies, handleFieldChange, setIncidentList, incident
}) => {

    const handleClassChange = async (classId: number) => {
        const students = await getStudentsByClassId(classId);
        handleFieldChange(incidentId, detailIndex, "classId", classId);
        handleFieldChange(incidentId, detailIndex, "students", students);
        handleFieldChange(incidentId, detailIndex, "studentIds", []);
    };
    return (
        <div className="flex items-center gap-4 mb-4">
            <select
                value={detail.classId}
                onChange={e => handleClassChange(Number(e.target.value))}
            >
                <option value="">Select Class</option>
                {classes.map(cls => (
                    <option key={cls.classId} value={cls.classId}>{cls.className}</option>
                ))}
            </select>
            <MultiSelectStudent
                detail={detail}
                incidentId={incidentId}
                detailIndex={detailIndex}
                handleFieldChange={handleFieldChange}
            />
            {!detail.isExpanded && (
                <Button
                    onClick={() => handleFieldChange(incidentId, detailIndex, "showDetailDialog", true)}
                    className="bg-blue-500 text-white"
                >
                    Edit
                </Button>
            )}

            <Dialog
                open={detail.showDetailDialog}
                onOpenChange={(open) =>
                    handleFieldChange(incidentId, detailIndex, "showDetailDialog", open)
                }
            >
                <DialogContent className="!max-w-[900px]">
                    <DialogHeader>
                        <DialogTitle className="text-blue-500">Detail Information</DialogTitle>
                    </DialogHeader>

                    <div className="flex gap-6">
                        {/* LEFT: Thông tin xử lý */}
                        <div className="flex-1 space-y-4">
                            <Input
                                placeholder="Handled By"
                                value={detail.handledBy}
                                onChange={(e) =>
                                    handleFieldChange(incidentId, detailIndex, "handledBy", e.target.value)
                                }
                            />
                            <Input
                                placeholder="Description"
                                value={detail.description}
                                onChange={(e) =>
                                    handleFieldChange(incidentId, detailIndex, "description", e.target.value)
                                }
                            />
                        </div>

                        {/* RIGHT: Thuốc */}
                        <div className="flex-1 space-y-2">
                         
                            <select
                                className="border rounded px-2 py-1 mt-1 w-full"
                                value=""
                                onChange={(e) => {
                                    const selectedId = Number(e.target.value);
                                    if (!selectedId) return;
                                    const selected = allSupplies.find(s => s.supplyId === selectedId);
                                    if (!selected) return;

                                    const alreadyExists = detail.suppliesUsed.some(s => s.supplyId === selectedId);
                                    if (!alreadyExists) {
                                        const updated = [
                                            ...detail.suppliesUsed,
                                            { supplyId: selected.supplyId, supplyName: selected.supplyName, quantity: 1 }
                                        ];
                                        handleFieldChange(incidentId, detailIndex, "suppliesUsed", updated);
                                    }
                                }}
                            >
                                <option value="">-- Choose Supply --</option>
                                {allSupplies.map(s => (
                                    <option key={s.supplyId} value={s.supplyId}>
                                        {s.supplyName}
                                    </option>
                                ))}
                            </select>

                            {detail.suppliesUsed.length > 0 && (
                                <div className="space-y-2 mt-2">
                                    {detail.suppliesUsed.map((supply, idx) => (
                                        <div key={supply.supplyId} className="flex items-center gap-2">
                                            <span className="w-40">{supply.supplyName}</span>
                                            <Input
                                                type="number"
                                                min={1}
                                                value={supply.quantity}
                                                onChange={(e) => {
                                                    const updated = [...detail.suppliesUsed];
                                                    updated[idx].quantity = Number(e.target.value);
                                                    handleFieldChange(incidentId, detailIndex, "suppliesUsed", updated);
                                                }}
                                                className="w-20"
                                            />
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    const updated = detail.suppliesUsed.filter((_, i) => i !== idx);
                                                    handleFieldChange(incidentId, detailIndex, "suppliesUsed", updated);
                                                }}
                                            >
                                                Xoá
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button
                            className="bg-blue-500 text-white"
                            onClick={() => handleFieldChange(incidentId, detailIndex, "showDetailDialog", false)}
                        >
                            Done
                        </Button>
                    </DialogFooter>
                </DialogContent>

            </Dialog>
            {/* ...supply chọn ở đây (tách riêng SupplyUsedList cũng ok)... */}
            <Button
                variant="destructive"
                onClick={() => {
                    if (confirm("Bạn có chắc muốn xoá chi tiết này?")) {
                        const updatedDetails = incident.details.filter((_, i) => i !== detailIndex);
                        setIncidentList(prev =>
                            prev.map(i =>
                                i.id === incidentId
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
    );
};

export default DetailInputBlock;
