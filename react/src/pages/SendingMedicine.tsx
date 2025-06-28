import { useState } from "react";
import { sendingmedicine } from "../service/serviceauth";


const SendingMedicine = () => {
    const [Medicine, setMedicine] = useState("");
    const [Image, setImage] = useState("");
    async function handlesendingmedicine(e: React.FormEvent) {
        e.preventDefault();
        try {
            const send = await sendingmedicine(0, Medicine, Image);
            alert("successful");
            console.log("Phản hồi API:", send);
        } catch (error) {
            alert("fail");
            console.error("Lỗi khi gửi thuốc:", error);
        }
    }


    return (
        <div className="bg-gray-100 p-6 rounded-xl shadow-md max-w-md mx-auto mt-10 animate-fade-in">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Thêm thông tin thuốc</h2>

            <form onSubmit={handlesendingmedicine} className="space-y-5">
                <div>
                    <label className="block text-gray-700 font-medium mb-1" htmlFor="medicinename">
                        Tên thuốc
                    </label>
                    <input
                        type="text"
                        id="medicinename"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        placeholder="Nhập tên thuốc"
                        value={Medicine}
                        onChange={(e) => setMedicine(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1" htmlFor="anhThuoc">
                        Ảnh thuốc (URL)
                    </label>
                    <input
                        type="text"
                        id="anhThuoc"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        placeholder="Dán link ảnh vào đây"
                        value={Image}
                        onChange={(e) => setImage(e.target.value)}
                    />
                </div>

                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
                    >
                        Gửi
                    </button>
                </div>
            </form>
        </div>


    );

};
export default SendingMedicine;