import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// Dữ liệu mẫu
type Class = {
  classId: number;
  className: string;
};

type User = {
  userId: number;
  fullName: string;
  email: string;
  classId: number;
};

const fakeClassList: Class[] = [
  { classId: 1, className: "Toán 10A1" },
  { classId: 2, className: "Văn 10A2" },
  { classId: 3, className: "Lý 11A1" },
  { classId: 4, className: "Hoá 11A2" },
  { classId: 5, className: "Sinh 12A1" },
];

const fakeUsers: User[] = [
  { userId: 1, fullName: "Nguyễn Văn A", email: "a@example.com", classId: 1 },
  { userId: 2, fullName: "Trần Thị B", email: "b@example.com", classId: 2 },
  { userId: 3, fullName: "Lê Văn C", email: "c@example.com", classId: 3 },
  { userId: 4, fullName: "Phạm Thị D", email: "d@example.com", classId: 4 },
  { userId: 5, fullName: "Võ Văn E", email: "e@example.com", classId: 5 },
  { userId: 6, fullName: "Bùi Thị F", email: "f@example.com", classId: 1 },
  { userId: 7, fullName: "Đặng Văn G", email: "g@example.com", classId: 2 },
  { userId: 8, fullName: "Hoàng Thị H", email: "h@example.com", classId: 3 },
  { userId: 9, fullName: "Đỗ Văn I", email: "i@example.com", classId: 4 },
  { userId: 10, fullName: "Ngô Thị J", email: "j@example.com", classId: 5 },
];

export default function StudentView() {
  const [searchName, setSearchName] = useState("");
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const handleFilter = () => {
    const result = fakeUsers.filter((u) => {
      const matchName = u.fullName
        .toLowerCase()
        .includes(searchName.toLowerCase());
      const matchClass = selectedClassId
        ? u.classId === parseInt(selectedClassId)
        : true;
      return matchName && matchClass;
    });
    setFilteredUsers(result);
  };

  useEffect(() => {
    handleFilter();
  }, [searchName, selectedClassId]);

  return (
    <div className="p-5 space-y-4">
      <h2 className="text-xl font-bold">Danh sách học sinh</h2>

      {/* Thanh tìm kiếm và chọn lớp */}
      <div className="flex flex-wrap gap-3 items-center">
        <Input
          placeholder="Tìm theo tên..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-[250px]"
        />

        <select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="border px-3 py-2 rounded-md"
        >
          <option value="">-- Tất cả lớp --</option>
          {fakeClassList.map((cls) => (
            <option key={cls.classId} value={cls.classId}>
              {cls.className}
            </option>
          ))}
        </select>

        <Button onClick={handleFilter}>Lọc</Button>
      </div>

      {/* Danh sách học sinh */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {filteredUsers.map((u) => {
          const className =
            fakeClassList.find((c) => c.classId === u.classId)?.className ||
            "Không rõ";
          return (
            <div
              key={u.userId}
              className="border p-2 rounded shadow-sm text-sm"
            >
              <div>
                <strong>{u.fullName}</strong> - {className}
              </div>
              <div>{u.email}</div>
            </div>
          );
        })}
        {filteredUsers.length === 0 && (
          <p className="text-sm text-gray-500">Không có học sinh phù hợp.</p>
        )}
      </div>
    </div>
  );
}
