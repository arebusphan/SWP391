import React from "react";
import { Button } from "@/components/ui/button";
import type { DetailInput } from "../pages/IncidentManagement";


interface Props {
    detail: DetailInput;
    incidentId: number;
    detailIndex: number;
    handleFieldChange: <T extends keyof DetailInput>(
        incidentId: number,
        detailIndex: number,
        field: T,
        value: DetailInput[T]
    ) => void;
}
const MultiSelectStudent: React.FC<Props> = ({
    detail, incidentId, detailIndex, handleFieldChange
}) => {
    const [open, setOpen] = React.useState(false);

    const handleCheckStudent = (studentId: number) => {
        const checked = detail.studentIds.includes(studentId);
        const newIds = checked
            ? detail.studentIds.filter(id => id !== studentId)
            : [...detail.studentIds, studentId];
        handleFieldChange(incidentId, detailIndex, "studentIds", newIds);
    };

    return (
        <div className="relative inline-block w-64">
            <button
                type="button"
                className="w-full border rounded px-2 py-2 bg-white text-left"
                onClick={() => setOpen(o => !o)}
                disabled={!detail.classId}
            >
                {detail.studentIds.length === 0
                    ? "Chọn học sinh"
                    : detail.students.filter(s => detail.studentIds.includes(s.studentId))
                        .map(s => s.fullName).join(", ")
                }
                <span className="float-right">▼</span>
            </button>
            {open && (
                <div className="absolute z-20 w-full bg-white border rounded shadow max-h-60 overflow-auto">
                    {detail.students.length === 0 && (
                        <div className="px-4 py-2 text-gray-500">Không có học sinh</div>
                    )}
                    {detail.students.length > 0 && (
                        <div
                            className="flex items-center px-4 py-2 bg-gray-50 border-b font-medium cursor-pointer hover:bg-gray-100"
                            onClick={() => {
                                if (detail.studentIds.length === detail.students.length) {
                                    handleFieldChange(incidentId, detailIndex, "studentIds", []);
                                } else {
                                    handleFieldChange(
                                        incidentId,
                                        detailIndex,
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
                        <label key={s.studentId} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={detail.studentIds.includes(s.studentId)}
                                onChange={() => handleCheckStudent(s.studentId)}
                                className="mr-2"
                            />
                            {s.fullName}
                        </label>
                    ))}
                    <div className="p-2 text-right">
                        <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
                            OK
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultiSelectStudent;
