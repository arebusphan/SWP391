import React, { useEffect, useState } from "react";
import { getAllClass } from "../service/serviceauth";


interface Class {
    classId: number;
    className: string;
}

interface SelectClassProps {
    onClassSelected: (classId: number) => void;
}

const SelectClass: React.FC<SelectClassProps> = ({ onClassSelected }) => {
    const [classList, setClassList] = useState<Class[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
    

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await getAllClass(); 
                setClassList(res);          
            } catch (error) {
                alert("Không thể tải danh sách lớp.");
            } 
        };

        fetchClasses();
    }, []);

    const handleContinue = () => {
        if (selectedClassId !== null) {
            onClassSelected(selectedClassId);
        } else {
            alert("Vui lòng chọn lớp.");
        }
    };

    return (
        <div className="p-6 bg-white rounded-2xl shadow space-y-4 max-w-md">
            <h2 className="text-xl font-bold text-center">Chọn lớp học</h2>

            {(
                <>
                    <select
                        className="w-full p-2 border rounded"
                        value={selectedClassId ?? ""}
                        onChange={(e) => setSelectedClassId(Number(e.target.value))}
                    >
                        <option value="">-- Chọn lớp --</option>
                        {classList.map((cls) => (
                            <option key={cls.classId} value={cls.classId}>
                                {cls.className}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={handleContinue}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        Tiếp tục
                    </button>
                </>
            )}
        </div>
    );
};

export default SelectClass;
