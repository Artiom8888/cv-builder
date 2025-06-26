import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Handle specific error cases
            switch (error.response.status) {
                case 400:
                    console.error('Bad Request:', error.response.data.error);
                    break;
                case 401:
                    console.error('Unauthorized:', error.response.data.error);
                    // Handle unauthorized access (e.g., redirect to login)
                    break;
                case 404:
                    console.error('Not Found:', error.response.data.error);
                    break;
                case 500:
                    console.error('Server Error:', error.response.data.error);
                    break;
                default:
                    console.error('Error:', error.response.data.error);
            }
        } else if (error.request) {
            console.error('Network Error:', error.request);
        } else {
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

// Resume API functions
const resumeApi = {
    createResume: async (resumeData) => {
        try {
            const formData = new FormData();
            
            // Add all resume fields to formData
            Object.keys(resumeData).forEach(key => {
                if (key === 'photo' && resumeData[key]) {
                    // Convert base64 to blob for image
                    const base64Data = resumeData[key].split(',')[1];
                    const byteCharacters = atob(base64Data);
                    const byteArrays = [];
                    
                    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
                        const slice = byteCharacters.slice(offset, offset + 1024);
                        const byteNumbers = new Array(slice.length);
                        
                        for (let i = 0; i < slice.length; i++) {
                            byteNumbers[i] = slice.charCodeAt(i);
                        }
                        
                        const byteArray = new Uint8Array(byteNumbers);
                        byteArrays.push(byteArray);
                    }
                    
                    const blob = new Blob(byteArrays, { type: 'image/jpeg' });
                    formData.append('photo', blob, 'photo.jpg');
                } else if (key === 'keyResponsibilities') {
                    // Handle nested arrays by stringifying them
                    formData.append(key, JSON.stringify(resumeData[key]));
                } else {
                    formData.append(key, resumeData[key]);
                }
            });

            const response = await api.post('/resumes', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getResumes: async () => {
        try {
            const response = await api.get('/resumes');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getResumeById: async (resumeId) => {
        try {
            const response = await api.get(`/resumes/${resumeId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateResume: async (resumeId, resumeData) => {
        try {
            const formData = new FormData();
            
            // Add all resume fields to formData
            Object.keys(resumeData).forEach(key => {
                if (key === 'photo' && resumeData[key]) {
                    // Convert base64 to blob for image
                    const base64Data = resumeData[key].split(',')[1];
                    const byteCharacters = atob(base64Data);
                    const byteArrays = [];
                    
                    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
                        const slice = byteCharacters.slice(offset, offset + 1024);
                        const byteNumbers = new Array(slice.length);
                        
                        for (let i = 0; i < slice.length; i++) {
                            byteNumbers[i] = slice.charCodeAt(i);
                        }
                        
                        const byteArray = new Uint8Array(byteNumbers);
                        byteArrays.push(byteArray);
                    }
                    
                    const blob = new Blob(byteArrays, { type: 'image/jpeg' });
                    formData.append('photo', blob, 'photo.jpg');
                } else if (Array.isArray(resumeData[key]) || typeof resumeData[key] === 'object') {
                    // Stringify arrays and objects
                    formData.append(key, JSON.stringify(resumeData[key]));
                } else {
                    formData.append(key, resumeData[key]);
                }
            });

            const response = await api.put(`/resumes/${resumeId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating resume:', error);
            throw error.response?.data || error.message;
        }
    },

    deleteResume: async (resumeId) => {
        try {
            const response = await api.delete(`/resumes/${resumeId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getUserResumes: async (userId) => {
        try {
            const response = await api.get(`/users/${userId}/resumes`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    downloadPDF: async (resumeId) => {
        try {
            console.log('Attempting to download PDF for resume ID:', resumeId);
            const response = await api.get(`/resumes/${resumeId}/download/pdf`, {
                responseType: 'blob'
            });
            console.log('PDF download response:', response);
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'resume.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading PDF:', error);
            throw error.response?.data || error.message;
        }
    },

    downloadDOCX: async (resumeId) => {
        try {
            console.log('Attempting to download DOCX for resume ID:', resumeId);
            const response = await api.get(`/resumes/${resumeId}/download/docx`, {
                responseType: 'blob'
            });
            console.log('DOCX download response:', response);
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'resume.docx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading DOCX:', error);
            throw error.response?.data || error.message;
        }
    }
};

export default resumeApi;



