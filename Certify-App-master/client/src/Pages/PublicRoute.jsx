import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const Public = ({ children }) => {

    const { isAuthenticated } = useSelector((state) => state.auth);

    if (!isAuthenticated) return <Navigate to='/login' />

    return children;
};

export default Public;