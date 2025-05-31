import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-100 text-gray-700 border-t border-gray-200">
            <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">


                <div>
                    <h3 className="text-lg font-semibold mb-2">FPT Primary School</h3>
                    <p>📍 Thu Duc, TP.HCM</p>
                    <p>📞 0703250127</p>
                    <p>✉️ FptPrimary@fpt.edu.vn</p>
                </div>


                <div>
                    <h3 className="text-lg font-semibold mb-2">Fast Connection</h3>
                    <ul className="space-y-1">
                        <li><a href="#" className="hover:underline">Home</a></li>
                        <li><a href="#" className="hover:underline">About</a></li>
                        <li><a href="#" className="hover:underline">Login</a></li>
                        <li><a href="#" className="hover:underline">Support</a></li>
                    </ul>
                </div>


                <div>
                    <h3 className="text-lg font-semibold mb-2">Working hours</h3>
                    <p>Monday – Friday: 7:30 – 17:00</p>
                    <p>Saturday, Sunday: Rest</p>

                    <h3 className="text-lg font-semibold mt-4 mb-2">Social</h3>
                    <div className="flex space-x-4">
                        <div>Facebook</div>
                        <div>Discord</div>
                        <div>Zalo</div>
                    </div>
                </div>

            </div>

            <div className="text-center text-xs text-gray-500 border-t border-gray-200 py-4">
                © 2025 Fpt Primary School.
            </div>
        </footer>

    );
};

export default Footer;