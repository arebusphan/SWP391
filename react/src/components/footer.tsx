import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-100 text-gray-700 border-t border-gray-200">
            <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">


                <div>
                    <h3 className="text-lg font-semibold mb-2">Trường Tiểu học ABC</h3>
                    <p>📍 Số 123, Đường Hòa Bình, Quận 5, TP.HCM</p>
                    <p>📞 (028) 1234 5678</p>
                    <p>✉️ lienhe@abc.edu.vn</p>
                </div>


                <div>
                    <h3 className="text-lg font-semibold mb-2">Liên kết nhanh</h3>
                    <ul className="space-y-1">
                        <li><a href="#" className="hover:underline">Trang chủ</a></li>
                        <li><a href="#" className="hover:underline">Thông báo</a></li>
                        <li><a href="#" className="hover:underline">Đăng nhập</a></li>
                        <li><a href="#" className="hover:underline">Liên hệ hỗ trợ</a></li>
                    </ul>
                </div>


                <div>
                    <h3 className="text-lg font-semibold mb-2">Giờ làm việc</h3>
                    <p>Thứ 2 – Thứ 6: 7h30 – 17h00</p>
                    <p>Thứ 7, CN: Nghỉ</p>

                    <h3 className="text-lg font-semibold mt-4 mb-2">Mạng xã hội</h3>
                    <div className="flex space-x-4">
                        <a href="#"><img src="/icons/facebook.svg" alt="Facebook" className="w-5 h-5" /></a>
                        <a href="#"><img src="/icons/youtube.svg" alt="YouTube" className="w-5 h-5" /></a>
                        <a href="#"><img src="/icons/email.svg" alt="Email" className="w-5 h-5" /></a>
                    </div>
                </div>

            </div>

            <div className="text-center text-xs text-gray-500 border-t border-gray-200 py-4">
                © 2025 Trường Tiểu học ABC. Mọi quyền được bảo lưu.
            </div>
        </footer>

    );
};

export default Footer;