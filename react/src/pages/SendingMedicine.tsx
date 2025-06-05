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

        <div className="bg-gray-100 p-6 rounded-xl shadow-md max-w-md mx-auto mt-10">
            <h2 className="text-xl font-semibold mb-4">Thêm thông tin thuốc</h2>

            <form onSubmit={handlesendingmedicine}>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-1" htmlFor="medicinename">
                        Tên thuốc
                    </label>

                    <input
                        type="text"
                        id="medicinename"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter medicine"
                        value={Medicine}
                        onChange={(e) => setMedicine(e.target.value)}
                    />
                </div>


                <div className="mb-4">
                    <label className="block text-gray-700 mb-1" htmlFor="anhThuoc">
                        Ảnh thuốc
                    </label>
                    <input
                        type="text"
                        id="anhThuoc"
                        accept="image/*"
                        className="w-full"
                        value={Image}
                        onChange={(e) => setImage(e.target.value)}
                    />

                </div>



                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    Gửi
                </button>
            </form>
        </div>

    );

};
export default SendingMedicine;
