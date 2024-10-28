import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { registerAPI } from '../APIServices/userAPI.js';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {

    const navigate = useNavigate();

    // State variables for form fields
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const registerMutation = useMutation({
        mutationKey: ["login"],
        mutationFn: registerAPI,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Form data to be submitted
        const formData = {
            fullName,
            email,
            password
        };
        // console.log('Form Data Submitted:', formData);

        registerMutation
            .mutateAsync(formData)
            // .then((data) => dispatch(isAuthenticated(data)))
            .then(() => navigate("/dashboard"))
            .then(() => toast.success("User registered successfully! 😊"))
            .catch((err) => console.log(err));
        // .catch((err) => toast.error(err?.response?.data?.error));
    };

    const { isPending } = registerMutation;

    return (
        <section className="container mx-auto py-6 max-w-sm">
            <div className='p-4 rounded-lg shadow-xl'>
                <h1 className="text-center my-4 text-2xl font-bold">Register</h1>
                <form onSubmit={handleSubmit} >
                    <div className="mb-4">
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
                    
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
                        <div id="emailHelp" className="text-sm text-gray-500">We'll never share your email with anyone else.</div>
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
                    <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" disabled={isPending}>
                        Register
                    </button>
                </form>
            </div>
        </section>
    );
}