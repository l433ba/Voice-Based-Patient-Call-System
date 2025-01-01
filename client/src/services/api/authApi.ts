export const authApi = {
  loginNurse: async (credentials: LoginCredentials) => {
    try {
      const response = await api.post('/api/auth/nurse/login', credentials);
      // Make sure contact number is included in the response
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // ... other methods
}; 