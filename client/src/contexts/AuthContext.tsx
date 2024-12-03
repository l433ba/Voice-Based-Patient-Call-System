import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../services/api';
import Toast from 'react-native-toast-message';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'patient' | 'nurse' | 'admin';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  registerPatient: (data: PatientRegistrationData) => Promise<void>;
  registerNurse: (data: NurseRegistrationData) => Promise<void>;
}

interface PatientRegistrationData {
  fullName: string;
  email: string;
  password: string;
  fullAddress: string;
  contactNumber: string;
  emergencyContact: string;
  roomNumber: string;
  bedNumber: string;
  disease: string;
}

interface NurseRegistrationData {
  fullName: string;
  email: string;
  password: string;
  contactNumber: string;
  nurseRole: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('user');
      
      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Login failed');
      }

      const { token, user } = response.data.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      setIsAuthenticated(true);
      setUser(user);

      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: `Welcome back, ${user.fullName}!`,
      });
    } catch (error: any) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);
      
      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'Come back soon!',
      });
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const registerPatient = async (data: PatientRegistrationData) => {
    try {
      const response = await authApi.registerPatient(data);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Registration failed');
      }

      const { token, user } = response.data.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      setIsAuthenticated(true);
      setUser(user);
    } catch (error) {
      console.error('Patient registration failed:', error);
      throw error;
    }
  };

  const registerNurse = async (data: NurseRegistrationData) => {
    try {
      await authApi.registerNurse(data);
    } catch (error) {
      console.error('Nurse registration failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout, 
      registerPatient,
      registerNurse 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};