import { Navigate } from 'react-router-dom';
import { checkUserAPI } from '../../APIServices/userAPI.js';
import { useQuery } from '@tanstack/react-query';
import { ImSpinner8 } from 'react-icons/im';
import StudentDashboard from './StudentDashboard.jsx';
import AdminDash from './AdminDash.jsx';

export default function Dashboard() {

    const { data, isLoading, isError } = useQuery({
        queryKey: ['check-user'],
        queryFn: checkUserAPI,
    })

    if (isError) return <Navigate to='/login' />

    if (isLoading) return (
        <div className="h-screen flex items-center justify-center">
            <ImSpinner8 className="w-20 h-20 text-gray-700 animate-spin mx-auto" />
        </div>
    );

    if (data?.isAuthenticated && data?.user?.role === 'student') {
        return <StudentDashboard />
    } else if (data?.isAuthenticated && data?.user.role === 'admin') {
        return <AdminDash />
    } else {
        return <Navigate to="/dashboard" />
    }
}