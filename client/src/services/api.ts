import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      console.error('Response Error:', error.response.data);
      return Promise.reject(error);
    } else if (error.request) {
      console.error('Network Error:', error.request);
      return Promise.reject(new Error('Network error - please check your connection'));
    } else {
      console.error('Error:', error.message);
      return Promise.reject(error);
    }
  }
);

export const authApi = {
  registerPatient: (data: {
    fullName: string;
    email: string;
    password: string;
    fullAddress: string;
    contactNumber: string;
    emergencyContact: string;
    roomNumber: string;
    bedNumber: string;
    disease: string;
  }) => api.post<{
    success: boolean;
    data: {
      token: string;
      user: {
        id: string;
        fullName: string;
        email: string;
        role: 'patient';
      };
    };
    message?: string;
  }>('/api/auth/register-patient', data),

  registerNurse: (data: {
    fullName: string;
    email: string;
    password: string;
    contactNumber: string;
    nurseRole: string;
  }) => api.post<{
    success: boolean;
    message: string;
    data?: {
      id: string;
      fullName: string;
      email: string;
      role: 'nurse';
    };
  }>('/api/auth/register-nurse', data),

  login: (data: { email: string; password: string }) => 
    api.post('/api/auth/login', data),
};

export const nurseApi = {
  getNurses: () => api.get<{
    success: boolean;
    data: Array<{
      _id: string;
      fullName: string;
      email: string;
      status: 'pending' | 'approved' | 'rejected';
      nurseRole: string;
    }>;
  }>('/api/nurses'),
  
  approveNurse: (id: string) => api.put(`/api/nurses/${id}/approve`),
  rejectNurse: (id: string) => api.put(`/api/nurses/${id}/reject`),
};

export const requestApi = {
  getRequests: () => api.get<{
    success: boolean;
    data: Array<{
      _id: string;
      description: string;
      priority: 'low' | 'medium' | 'high';
      status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
      createdAt: string;
    }>;
  }>('/api/requests'),
  
  createRequest: (data: { description: string; priority: string }) => 
    api.post('/api/requests', data),
    
  updateStatus: (id: string, status: string) => 
    api.put(`/api/requests/${id}/status`, { status }),
};

export const profileApi = {
  getProfile: (userId: string) => 
    api.get(`/api/patients/${userId}/profile`),
    
  updateProfile: (userId: string, data: ProfileUpdateData) => 
    api.put(`/api/patients/${userId}/profile`, data),
    
  uploadImage: (userId: string, formData: FormData) => 
    api.post(`/api/patients/${userId}/profile/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};

export const patientApi = {
  getPatients: () => axios.get(`${API_URL}/api/patients`),
  // ... other patient-related API calls
};

export default api;
