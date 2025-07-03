

const Footer = () => {
    return (
        <footer className="bg-gray-50 text-gray-700 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 text-sm">
                {/* School Information */}
                <div>
                    <h3 className="text-lg font-semibold mb-3 text-blue-700">FPT Primary School</h3>
                    <p>📍 Thu Duc District, Ho Chi Minh City</p>
                    <p>📞 0703 250 127</p>
                    <p>✉️ contact@fptprimary.edu.vn</p>
                </div>

                {/* Quick Navigation */}
                <div>
                    <h3 className="text-lg font-semibold mb-3 text-blue-700">Quick Links</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:underline hover:text-blue-600">Home</a></li>
                        <li><a href="#" className="hover:underline hover:text-blue-600">About Us</a></li>
                        <li><a href="#" className="hover:underline hover:text-blue-600">Login</a></li>
                        <li><a href="#" className="hover:underline hover:text-blue-600">Support</a></li>
                    </ul>
                </div>

                {/* Contact & Hours */}
                <div>
                    <h3 className="text-lg font-semibold mb-3 text-blue-700">Health Support</h3>
                    <p>📞 Hotline: 1900 123 456</p>
                    <p>✉️ support@healthschool.edu.vn</p>
                    <p className="mt-2 text-sm italic">24/7 student health consulting</p>

                    <h3 className="text-lg font-semibold mt-6 mb-3 text-blue-700">Opening Hours</h3>
                    <p>Mon – Fri: 07:30 AM – 05:00 PM</p>
                    <p>Sat – Sun: Closed</p>

                    <h3 className="text-lg font-semibold mt-6 mb-3 text-blue-700">Follow Us</h3>
                    <div className="flex space-x-4">
                        <a href="https://facebook.com" className="hover:text-green-600">Facebook</a>
                        <a href="https://zalo.me" className="hover:text-green-600">Zalo</a>
                        <a href="https://discord.com" className="hover:text-green-600">Discord</a>
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
