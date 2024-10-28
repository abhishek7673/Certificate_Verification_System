import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { uploadCertificateAPI } from '../../APIServices/certificateAPI.js';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

export default function AdminDash() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const {user} = useSelector((state) => state.auth);


    const certificateMutation = useMutation({
        mutationKey: ["login"],
        mutationFn: uploadCertificateAPI,
    });

    // Handle file selection
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    // Upload file to backend
    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage('Please select a file!');
            return;
        }
        // console.log(file)
        const formData = new FormData();
        formData.append('file', file);

        certificateMutation
            .mutateAsync(formData)
            .then(() => toast.success("Certificate Uploaded Successfully! 😊"))
            .catch((err) => toast.error(err.response.data.error));
    };

    return (
        <div className="bg-gray-100 p-8 flex items-center justify-center">
            <div className="bg-white p-8 my-20 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h2>
                <p className="text-lg mb-6 text-center">Hello, <strong>{user?.fullName}</strong>!</p>
                <form onSubmit={handleUpload}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
                            Upload .xlsx File:
                        </label>
                        <input
                            type="file"
                            id="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Upload
                        </button>
                    </div>
                    {message && <p className="mt-4 text-center text-red-500">{message}</p>}
                </form>
            </div>
        </div>
    );
}