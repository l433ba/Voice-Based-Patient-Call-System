import { API_URL } from '../../config';
import axios from 'axios';

export const appointmentApi = {
  fetchAppointments: async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/appointments/${userId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return [];
        }
      }
      throw error;
    }
  }
}; 