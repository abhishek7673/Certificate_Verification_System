import axios from "axios";

// const baseUrl = process.env.REACT_APP_API_URL;

const baseUrl = 'http://localhost:5000/api/v1/job';

export const createJobAPI = async (jobData) => {
    const response = await axios.post(`${baseUrl}/create-job`, jobData, {
        withCredentials: true
    });

    return response.data;
};

export const getAllJobsAPI = async (filters) => {
    // console.log(filters);
    const response = await axios.get(`${baseUrl}`,
        {
            withCredentials: true,
            params: filters
        },
    );

    return response.data;
};

export const applyJobAPI = async (jobId) => {
    const response = await axios.post(`${baseUrl}/apply-job`, jobId, {
        withCredentials: true
    });

    return response.data;
};

export const getMyApplicationsAPI = async () => {
    const response = await axios.get(`${baseUrl}/my-application`, {
        withCredentials: true
    });

    return response.data;
};

export const getMyJobsAPI = async () => {
    const response = await axios.get(`${baseUrl}/my-jobs`, {
        withCredentials: true
    });

    return response.data;
};

export const getJobByIdAPI = async (jobId) => {
    const response = await axios.get(`${baseUrl}/${jobId}`, {
        withCredentials: true
    });

    return response.data;
};

export const getJobByIdWithApplicantsAPI = async (jobId) => {
    const response = await axios.get(`${baseUrl}/${jobId}/applicants`, {
        withCredentials: true
    });

    return response.data;
};

export const updateApplicationAPI = async (data) => {
    // console.log(data)
    const response = await axios.put(`${baseUrl}/update-application/${data.applicantId}`, data, {
        withCredentials: true
    });

    return response.data;
};

export const updateJobAPI = async (jobId, jobData) => {
    const response = await axios.put(`${baseUrl}/${jobId}`, jobData, {
        withCredentials: true
    });

    return response.data;
}

export const deleteJobAPI = async (jobId) => {
    const response = await axios.delete(`${baseUrl}/${jobId}`, {
        withCredentials: true
    });

    return response.data;
};