import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginAPI } from '../APIServices/userAPI.js';
import { toast } from 'react-toastify';
import { setUser } from '../redux/slices/authSlice.js';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // State variables for form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginMutation = useMutation({
        mutationKey: ["login"],
        mutationFn: loginAPI,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            email,
            password
        };

        loginMutation
            .mutateAsync(formData)
            .then((data) => dispatch(setUser(data)))
            .then(() => navigate("/dashboard"))
            .then(() => toast.success("User logged in successfully! 😊"))
            .catch((err) => toast.error(err.response.data.error));
    };

    const { isPending } = loginMutation;

    return (
        <section className="container mx-auto py-6 max-w-sm">
            <div className='my-16 p-4 rounded-lg shadow-xl'>

                <h1 className='text-center my-4 text-2xl font-bold'>Login to continue</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="exampleInputEmail1" className="block text-sm font-medium text-gray-700">Email address</label>
                        <input
                            type="email"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <div id="emailHelp" className="mt-2 text-sm text-gray-500">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="exampleInputPassword1" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            id="exampleInputPassword1"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isPending}
                    >
                        {isPending ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div className="mt-4">
                    New to the app! <Link to="/register" className="text-indigo-600 hover:underline">Register</Link>
                </div>
            </div>
        </section>
    );
}