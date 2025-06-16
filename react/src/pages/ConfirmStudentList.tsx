import { useEffect, useState } from "react";
import axios from "axios";

interface ConfirmStudent {
    studentId: number;
    studentName: string;
    confirmStatus: string;
    declineReason?: string;
    parentPhone?: string;
}

const ConfirmStudentList = () => {
    const [notificationId, setNotificationId] = useState<number>(1);
    const [classId, setClassId] = useState<number>(1);
    const [students, setStudents] = useState<ConfirmStudent[]>([]);

    const fetchData = async () => {
        try {
            const res = await axios.get("https://localhost:7195/api/notifications/students/confirmation", {
                params: { notificationId, classId }
            });
            setStudents(res.data);
        } catch (error) {
            alert("Không thể tải danh sách xác nhận.");
        }
    };

    useEffect(() => {
        fetchData();
    }, [notificationId, classId]);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white mt-10 shadow-md rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Danh sách xác nhận thông báo</h2>

            <div className="flex gap-4 mb-6">
                <input
                    type="number"
                    value={notificationId}
                    onChange={(e) => setNotificationId(parseInt(e.target.value))}
                    placeholder="Notification ID"
                    className="border px-3 py-2 rounded w-40"
                />
                <input
                    type="number"
                    value={classId}
                    onChange={(e) => setClassId(parseInt(e.target.value))}
                    placeholder="Class ID"
                    className="border px-3 py-2 rounded w-40"
                />
                <button
                    className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded"
                    onClick={fetchData}
                >
                    Tải lại
                </button>
            </div>

            {students.length === 0 ? (
                <p>Không có học sinh nào xác nhận.</p>
            ) : (
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-blue-100 text-left">
                            <th className="border px-3 py-2">Mã HS</th>
                            <th className="border px-3 py-2">Họ tên</th>
                            <th className="border px-3 py-2">Trạng thái</th>
                            <th className="border px-3 py-2">Lý do từ chối</th>
                            <th className="border px-3 py-2">SĐT PH</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((stu) => (
                            <tr key={stu.studentId}>
                                <td className="border px-3 py-2">{stu.studentId}</td>
                                <td className="border px-3 py-2">{stu.studentName}</td>
                                <td className="border px-3 py-2">{stu.confirmStatus}</td>
                                <td className="border px-3 py-2">{stu.declineReason || "-"}</td>
                                <td className="border px-3 py-2">{stu.parentPhone || "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ConfirmStudentList;
