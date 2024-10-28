import { FaTwitter, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div className="mb-4 md:mb-0">
                        <h2 className="text-2xl font-bold">Certify</h2>
                        <p className="text-gray-400">© 2024 Certify. All rights reserved.</p>
                    </div>
                    <div className="flex space-x-4 mb-4 md:mb-0">
                        <a href="#" className="text-gray-400 hover:text-white">Home</a>
                        <a href="#" className="text-gray-400 hover:text-white">About</a>
                        <a href="#" className="text-gray-400 hover:text-white">Services</a>
                        <a href="#" className="text-gray-400 hover:text-white">Contact</a>
                    </div>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-400 hover:text-white">
                            <FaTwitter className="w-6 h-6" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white">
                            <FaFacebookF className="w-6 h-6" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white">
                            <FaLinkedinIn className="w-6 h-6" />
                        </a>
                    </div>
                </div>
                <div className="border-t border-gray-700 pt-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <h3 className="text-lg font-semibold">Contact Us</h3>
                            <p className="text-gray-400">1234 Street, City, State, 12345</p>
                            <p className="text-gray-400">Email: info@company.com</p>
                            <p className="text-gray-400">Phone: (123) 456-7890</p>
                        </div>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
                            <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}