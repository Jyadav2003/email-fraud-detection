import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
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
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

// Dashboard APIs
export const fetchDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

// Email Analysis APIs
export const analyzeEmail = async (emailData) => {
  const response = await api.post('/emails/analyze', emailData);
  return response.data;
};

export const getEmailHistory = async (page = 1, limit = 10) => {
  const response = await api.get(`/emails/history?page=${page}&limit=${limit}`);
  return response.data;
};

export const getEmailDetails = async (emailId) => {
  const response = await api.get(`/emails/${emailId}`);
  return response.data;
};

// Security APIs
export const getSecuritySettings = async () => {
  const response = await api.get('/security/settings');
  return response.data;
};

export const updateSecuritySettings = async (settings) => {
  const response = await api.put('/security/settings', settings);
  return response.data;
};

// User Profile APIs
export const getUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

export const updateUserProfile = async (userData) => {
  const response = await api.put('/users/profile', userData);
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.post('/users/change-password', passwordData);
  return response.data;
};

// Report APIs
export const generateReport = async (reportParams) => {
  const response = await api.post('/reports/generate', reportParams);
  return response.data;
};

export const getReportHistory = async () => {
  const response = await api.get('/reports/history');
  return response.data;
};

export default api;