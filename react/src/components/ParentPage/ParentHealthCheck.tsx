import React, { useEffect, useState } from 'react';

interface HealthCheck {
    studentId: number;
    height: number;
    weight: number;
    leftEyeVision: string;
    rightEyeVision: string;
    leftEarHearing: string;
    rightEarHearing: string;
    spineStatus: string;
    skinStatus: string;
    oralHealth: string;
    otherNotes: string;
    checkDate: string;
}

const ParentHealthCheck: React.FC = () => {
    const [records, setRecords] = useState<HealthCheck[]>([]);
    const guardianId = 123;

    useEffect(() => {
        fetch(`/api/ParentHealthCheck/${guardianId}`)
            .then((res) => res.json())
            .then((data) => setRecords(data));
    }, []);

    return (
        <div className="p-6">
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">
                    Student Health Check Records
                </h2>
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700 text-left">
                                <th className="px-4 py-2">Student</th>
                                <th className="px-4 py-2">Height</th>
                                <th className="px-4 py-2">Weight</th>
                                <th className="px-4 py-2">Eye Vision (L/R)</th>
                                <th className="px-4 py-2">Ear Hearing (L/R)</th>
                                <th className="px-4 py-2">Spine</th>
                                <th className="px-4 py-2">Skin</th>
                                <th className="px-4 py-2">Oral</th>
                                <th className="px-4 py-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((r, i) => (
                                <tr key={i} className="hover:bg-gray-50 border-t">
                                    <td className="px-4 py-2">{r.studentId}</td>
                                    <td className="px-4 py-2">{r.height} cm</td>
                                    <td className="px-4 py-2">{r.weight} kg</td>
                                    <td className="px-4 py-2">{r.leftEyeVision} / {r.rightEyeVision}</td>
                                    <td className="px-4 py-2">{r.leftEarHearing} / {r.rightEarHearing}</td>
                                    <td className="px-4 py-2">{r.spineStatus}</td>
                                    <td className="px-4 py-2">{r.skinStatus}</td>
                                    <td className="px-4 py-2">{r.oralHealth}</td>
                                    <td className="px-4 py-2">{r.checkDate.split("T")[0]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ParentHealthCheck;
