import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-50 text-gray-700 border-t border-gray-200">
            <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">

                {/* Thông tin về trường tiểu học */}
                <div>
                    <h3 className="text-lg font-semibold mb-2 text-green-700">FPT Primary School</h3>
                    <p>📍 Thu Duc, TP.HCM</p>
                    <p>📞 0703 250 127</p>
                    <p>✉️ FptPrimary@fpt.edu.vn</p>
                </div>

                {/* Liên kết các trang khác */}
                <div>
                    <h3 className="text-lg font-semibold mb-2 text-green-700">Quick Links</h3>
                    <ul className="space-y-1">
                        <li><a href="#" className="hover:underline">Home</a></li>
                        <li><a href="#" className="hover:underline">About Us</a></li>
                        <li><a href="#" className="hover:underline">Login</a></li>
                        <li><a href="#" className="hover:underline">Support</a></li>
                    </ul>
                </div>

                {/* Thông tin liên lạc và thời gian mở cửa */}
                <div>
                    <h3 className="text-lg font-semibold mb-2 text-green-700">Health Support Hotline</h3>
                    <p>📞 1900 123 456</p>
                    <p>✉️ support@healthschool.edu.vn</p>
                    <p className="mt-2 text-sm italic">Tư vấn sức khỏe học đường 24/7</p>

                    <h3 className="text-lg font-semibold mt-6 mb-2 text-green-700">Working Hours</h3>
                    <p>Monday – Friday: 7:30 – 17:00</p>
                    <p>Saturday, Sunday: Closed</p>

                    <h3 className="text-lg font-semibold mt-6 mb-2 text-green-700">Social</h3>
                    <div className="flex space-x-4">
                        {/* Có thể sử dụng icon khác */}
                        <a href="https://facebook.com" aria-label="Facebook" className="hover:text-green-600">Facebook</a>
                        <a href="https://zalo.me" aria-label="Zalo" className="hover:text-green-600">Zalo</a>
                        <a href="https://discord.com" aria-label="Discord" className="hover:text-green-600">Discord</a>
                    </div>
                </div>

            </div>

            <div className="text-center text-xs text-gray-500 border-t border-gray-200 py-4">
                © 2025 FPT Primary School. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
