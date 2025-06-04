import { useAuth } from "../context/AuthContext";

const InfoofParent = () => {
    const { user } = useAuth();

    if (!user) {
        return <div>Đang tải thông tin phụ huynh...</div>;
    }

    return (
        <div className="p-4 bg-white shadow rounded max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-green-700">Thông tin phụ huynh</h2>
            <div><strong>Họ và tên:</strong> {user.Name || "Chưa cập nhật"}</div>
            {/*<div><strong>Tuổi:</strong> {user.Age || "Chưa cập nhật"}</div>*/}
            <div><strong>Số điện thoại:</strong> {user.Phone || "Chưa cập nhật"}</div>
            <div><strong>Email:</strong> {user.Email || "Chưa cập nhật"}</div>
            {/*<div><strong>Địa chỉ:</strong> {user.Address || "Chưa cập nhật"}</div>*/}
        </div>
    );
};

export default InfoofParent;
