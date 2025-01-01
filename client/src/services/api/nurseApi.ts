import { API_URL } from '../../config';
import api from '../api';

export const nurseApi = {
  getNurses: () => api.get('/api/nurses'),
  approveNurse: (id: string) => api.put(`/api/nurses/${id}/approve`),
  rejectNurse: (id: string) => api.put(`/api/nurses/${id}/reject`),
  getProfile: (id?: string) => api.get(`/api/nurses/${id}/profile`),
  updateProfile: (id?: string, data?: any) => api.put(`/api/nurses/${id}/profile`, data),
  uploadImage: (id?: string, formData: FormData) => 
    api.post(`/api/nurses/${id}/profile/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
}; 