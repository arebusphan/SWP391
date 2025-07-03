import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import MultiSelectStudent from "./MultiSelectStudent";
import { getStudentsByClassId } from "../service/serviceauth";
import type { Class, DetailInput, IncidentInput, Supply } from "../pages/IncidentManagement";

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
            <Input
                placeholder="Handled By"
                value={detail.handledBy}
                onChange={e => handleFieldChange(incidentId, detailIndex, "handledBy", e.target.value)}
            />
            <Input
                placeholder="Description"
                value={detail.description}
                onChange={e => handleFieldChange(incidentId, detailIndex, "description", e.target.value)}
            />
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
