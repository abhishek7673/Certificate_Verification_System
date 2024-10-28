import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutAPI } from "../../APIServices/userAPI.js";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { logout } from "../../redux/slices/authSlice.js";
import { useState } from "react";

export default function Navbar() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showMobileNav, setShowMobileNav] = useState(false);

    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const NAV_ITEMS = []

    if (!isAuthenticated) {
        NAV_ITEMS.push(
            { name: 'Register', path: '/register' },
        )
    } else if (isAuthenticated && user.role === 'job-seeker') {
        NAV_ITEMS.push(
            { name: 'Search Jobs', path: '/jobs' },
            { name: 'My Applications', path: '/my-application' },
            { name: 'Dashboard', path: '/dashboard' },
        )
    } else if (isAuthenticated && user.role === 'employer') {
        NAV_ITEMS.push(
            { name: 'Post Job', path: '/post-job' },
            { name: 'View Jobs', path: '/view-jobs' },
            { name: 'Dashboard', path: '/dashboard' },
        )
    }

    const logoutMutation = useMutation({
        mutationKey: ["logout"],
        mutationFn: logoutAPI,
    });

    const handleLogout = () => {
        logoutMutation
            .mutateAsync()
            .then(() => dispatch(logout()))
            .then(() => toast.success('User logged out successfully!'))
            .then(() => navigate('/'))
            .catch((err) => console.log(err));
    }

    const handleToggleClick = () => {
        setShowMobileNav(!showMobileNav);
    }

    return (
        <>
            <nav className="bg-gray-100 fixed top-0 left-0 right-0 p-4 z-20 shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    <Link className="text-xl font-bold text-gray-800" to="/">Certify</Link>
                    <button className="text-gray-800 md:hidden hover:bg-gray-300 p-1 rounded-sm" type="button" onClick={handleToggleClick}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </button>
                    <div className="hidden md:flex md:items-center md:space-x-6">
                        <ul className="flex flex-col md:flex-row md:space-x-4">
                            {NAV_ITEMS.map((item, index) => (
                                <li key={index} className="nav-item">
                                    <Link className="text-gray-800 hover:text-gray-600" to={item.path}>{item.name}</Link>
                                </li>
                            ))}
                            {isAuthenticated && (
                                <li className="nav-item">
                                    <button className="text-gray-800 hover:text-gray-600" onClick={handleLogout}>logout</button>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
                {/* mobile navbar */}
                <div className={`absolute w-44 top-0  ${showMobileNav ? "right-0" : "right-[-100%]"} z-30 shadow-xl rounded-lg transition-right duration-300`}>
                    <div className="bg-gray-100 h-[100vh]  ">
                        <div className="text-right pb-4">
                            <button className="text-right m-4 p-1 rounded-full hover:bg-gray-400 text-gray-800 md:hidden" type="button" onClick={handleToggleClick}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <ul className="w-full text-center flex flex-col gap-4">
                            {NAV_ITEMS.map((item, index) => (
                                <li key={index} onClick={handleToggleClick} className="nav-item">
                                    <Link className="text-gray-800 hover:text-gray-600" to={item.path}>{item.name}</Link>
                                </li>
                            ))}
                            {isAuthenticated && (
                                <li onClick={handleToggleClick} className="nav-item">
                                    <button className="text-gray-800 hover:text-gray-600" onClick={handleLogout}>logout</button>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="mt-16">
            </div>
        </>
    )
}