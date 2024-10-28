import { useState } from 'react';
import { useSelector } from 'react-redux';
// import { downloadCertificateAPI } from '../../APIServices/certificateAPI.js';
// import { useQuery } from '@tanstack/react-query';

export default function StudentDashboard() {
    const [certificateId, setCertificateId] = useState('');
    const [message, setMessage] = useState('');
    const { user } = useSelector((state) => state.auth);

    // const { refetch, data } = useQuery({
    //     queryKey: ['get-certificate', certificateId],
    //     queryFn: () => downloadCertificateAPI(certificateId),
    //     enabled: false, // Disable automatic execution
    // });

    // console.log(data)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/v1/certificate/${certificateId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/pdf',
                },
            });

            if (response.ok) {
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                window.open(blobUrl, '_blank');
            } else {
                setMessage('Certificate not found');
            }
        } catch (error) {
            setMessage('Error fetching certificate');
            console.error('Error:', error);
        }
    };

    return (
        <div className="bg-gray-100  p-8 flex items-center justify-center">
            <div className="bg-white p-8 my-20 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Student Dashboard</h2>
                <p className="text-lg ">Hello <strong>{user?.fullName}</strong>! </p>
                <p className="text-lg mb-4">Email: {user?.email}</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="certificateId">
                            Enter your Certificate ID:
                        </label>
                        <input
                            type="text"
                            id="certificateId"
                            value={certificateId}
                            onChange={(e) => setCertificateId(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Get Certificate
                        </button>
                    </div>
                    {message && <p className="mt-4 text-center text-red-500">{message}</p>}
                </form>
            </div>
        </div>
    );
}