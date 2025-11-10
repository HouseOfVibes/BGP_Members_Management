import axios from 'axios';
import toast from 'react-hot-toast';

// Base API configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance
const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bgp_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('bgp_token');
        localStorage.removeItem('bgp_user');
        window.location.href = '/login';
      }
      
      // Return the error data for handling
      return Promise.reject(data);
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection.');
      return Promise.reject({ message: 'Network error' });
    } else {
      // Other error
      toast.error('An unexpected error occurred.');
      return Promise.reject({ message: 'Unexpected error' });
    }
  }
);

// Authentication API
export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  logout: () => apiClient.post('/auth/logout'),
  changePassword: (passwords) => apiClient.post('/auth/change-password', passwords),
  refreshToken: (token) => apiClient.post('/auth/refresh-token', { token }),
  setupAdmin: () => apiClient.post('/auth/setup-admin')
};

// Public API (no auth required)
export const publicAPI = {
  registerMember: (memberData) => apiClient.post('/public/register', memberData),
  health: () => apiClient.get('/public/health')
};

// Members API
export const membersAPI = {
  getAll: (params = {}) => apiClient.get('/members', { params }),
  getById: (id) => apiClient.get(`/members/${id}`),
  create: (memberData) => apiClient.post('/members', memberData),
  update: (id, memberData) => apiClient.put(`/members/${id}`, memberData),
  delete: (id) => apiClient.delete(`/members/${id}`),
  updateStatus: (id, status) => apiClient.patch(`/members/${id}/status`, { status })
};

// Admin API
export const adminAPI = {
  getDashboard: () => apiClient.get('/admin/dashboard'),
  getAnalytics: (range = '30days') => apiClient.get('/admin/analytics', { params: { range } }),
  exportCSV: (status = 'all') => {
    return apiClient.get('/admin/export/csv', {
      params: { status },
      responseType: 'blob'
    });
  },
  exportExcel: (status = 'all') => {
    return apiClient.get('/admin/export/excel', {
      params: { status },
      responseType: 'blob'
    });
  },
  getActivityLogs: (params = {}) => apiClient.get('/admin/activity-logs', { params }),
  bulkUpdateStatus: (memberIds, status) =>
    apiClient.post('/admin/bulk-update-status', { memberIds, status }),
  bulkImport: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/admin/bulk-import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

// Utility functions for file downloads
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Health check function
export const checkAPIHealth = async () => {
  try {
    const response = await axios.get(`${API_URL}/health`);
    return response.data;
  } catch (error) {
    throw new Error('API is not responding');
  }
};

// Export the configured axios instance for custom requests
export default apiClient;