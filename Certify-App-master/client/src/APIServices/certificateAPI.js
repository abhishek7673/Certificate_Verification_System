import axios from "axios";

const baseUrl = 'http://localhost:5000/api/v1/certificate';

// certificate upload API
export const uploadCertificateAPI = async (certificateData) => {
    const response = await axios.post(`${baseUrl}/`, certificateData, {
        withCredentials: true
    });

    return response.data;
};

// certificate download API
export const downloadCertificateAPI = async (certificateId) => {
    const response = await axios.get(`${baseUrl}/${certificateId}`, {
        withCredentials: true
    });

    return response.data;
};