import { Navigate, Outlet } from 'react-router-dom';
import { checkUserAPI } from '../APIServices/userAPI.js';
import { useQuery } from '@tanstack/react-query';

const Protected = ({ children }) => {

    const { data, isLoading } = useQuery({
      queryKey: ["user-auth"],
      queryFn: checkUserAPI,
    });
  
  
    if (isLoading) return <h1>Loading...</h1>;
  
    if (!data) return <Navigate to='/login' />
  
    return children;
  };
  
  export default Protected;