import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import MainLayout from "./Pages/MainLayout.jsx";
import Home from "./Pages/Home.jsx";
import { useQuery } from '@tanstack/react-query';
import { checkUserAPI } from './APIServices/userAPI.js';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from './redux/slices/authSlice.js';
import { ImSpinner8 } from 'react-icons/im';
import StudentDashboard from './Pages/Dashboard/StudentDashboard.jsx';
import AdminDash from './Pages/Dashboard/AdminDash.jsx';
import Dashboard from './Pages/Dashboard/Dashboard.jsx';


function App() {

  const dispatch = useDispatch();

  const { data, isLoading } = useQuery({
    queryKey: ['check-user'],
    queryFn: checkUserAPI,
  })

  const isAuthenticated = data?.isAuthenticated;
  // console.log(data)

  useEffect(() => {
    if (data) {
      dispatch(setUser(data));
    }
  }, [data]);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: 'dashboard', element: <Dashboard /> },
      ]
    },
  ]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <ImSpinner8 className="w-20 h-20 text-gray-700 animate-spin mx-auto" />
      </div>
    )
  }

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;