/**
 * Authentication Context Provider and Hook
 * Manages user authentication state, login/logout functionality, and user registration
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../services/api';
import Toast from 'react-native-toast-message';

/**
 * Interface defining the structure of a User object
 */
interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  contactNumber: string;
  nurseRole?: string; // Optional field for nurse users
}

/**
 * Interface defining the authentication context shape and available methods
 */
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  registerPatient: (data: PatientRegistrationData) => Promise<void>;
  registerNurse: (data: NurseRegistrationData) => Promise<void>;
}

/**
 * Interface for patient registration data
 */
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

/**
 * Interface for nurse registration data
 */
interface NurseRegistrationData {
  fullName: string;
  email: string;
  password: string;
  contactNumber: string;
  nurseRole: string;
}

// Create the authentication context with undefined default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component that wraps the app and provides authentication context
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for tracking authentication status and user data
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Check authentication status on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Checks if user is already authenticated by verifying stored token and user data
   */
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

  /**
   * Handles user login by validating credentials and storing authentication data
   */
  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Login failed');
      }

      const { token, user } = response.data.data;

      // Store authentication data
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      // Update authentication state
      setIsAuthenticated(true);
      setUser(user);

      // Show success message
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

  /**
   * Handles user logout by clearing stored authentication data
   */
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

  /**
   * Handles patient registration without automatic login
   */
  const registerPatient = async (data: PatientRegistrationData) => {
    try {
      const response = await authApi.registerPatient(data);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Registration failed');
      }

      // Remove automatic login after registration
      // Just return the success response
      return response.data;
      
    } catch (error) {
      console.error('Patient registration failed:', error);
      throw error;
    }
  };

  /**
   * Handles nurse registration (does not automatically log in the nurse)
   */
  const registerNurse = async (data: NurseRegistrationData) => {
    try {
      await authApi.registerNurse(data);
    } catch (error) {
      console.error('Nurse registration failed:', error);
      throw error;
    }
  };

  // Provide authentication context to child components
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

/**
 * Custom hook to use authentication context
 * Throws error if used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};