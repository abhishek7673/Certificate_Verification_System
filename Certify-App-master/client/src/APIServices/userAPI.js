import axios from "axios";

// const baseUrl = process.env.REACT_APP_API_URL;
// console.log(baseUrl)
const baseUrl = 'http://localhost:5000/api/v1';

export const registerAPI = async (userData) => {
    const response = await axios.post(`${baseUrl}/user/register`, {
        fullName: userData?.fullName,
        role: userData?.role,
        email: userData?.email,
        password: userData?.password,
    }, {
        withCredentials: true
    });

    return response.data;
};

export const loginAPI = async (userData) => {
    const response = await axios.post(`${baseUrl}/user/login`, {
        email: userData?.email,
        password: userData?.password,
    }, {
        withCredentials: true
    });

    return response.data;
}

export const logoutAPI = async () => {
    const response = await axios.post(`${baseUrl}/user/logout`, {}, {
        withCredentials: true
    });

    return response.data;
};

export const checkUserAPI = async () => {
    const response = await axios.get(`${baseUrl}/user/check-user`, {
        withCredentials: true
    });

    return response.data;
};

export const getUserProfileAPI = async () => {
    const response = await axios.get(`${baseUrl}/user/profile`, {
        withCredentials: true
    });

    return response.data;
};

export const updateProfileAPI = async (userData) => {
    // console.log(userData)
    const response = await axios.put(`${baseUrl}/user/profile`, userData, {
        withCredentials: true
    });
    return response.data;
};

export const updateResumeAPI = async (file) => {
    const response = await axios.put(`${baseUrl}/user/resume`, file, {
        withCredentials: true,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const fetchResumeAPI = async () => {
    const response = await axios.get(`${baseUrl}/user/resume`, {
        withCredentials: true,
    });

    return response.data;
};

export const updateProfileImageAPI = async (file) => {
    // console.log(file)
    const response = await axios.put(`${baseUrl}/user/profile-pic`, file, {
        withCredentials: true,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const fetchProfileImageAPI = async () => {
    const response = await axios.get(`${baseUrl}/user/profile-pic`, {
        withCredentials: true,
    });

    return response.data;
};