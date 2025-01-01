/**
 * PatientLoginScreen.tsx
 * Screen component for patient authentication.
 * Provides a styled login form with email and password inputs.
 * Uses AuthContext for authentication state management.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import type { NavigationProp } from '@/types/navigation';
import Toast from 'react-native-toast-message';

export const PatientLoginScreen = () => {
  // Navigation hook for screen transitions
  const navigation = useNavigation<NavigationProp>();
  // Auth context hook for login functionality
  const { login } = useAuth();
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  // State management for form inputs
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  /**
   * Handles the login form submission
   * Validates inputs and attempts authentication
   * Shows error toast on failure
   */
  const handleLogin = async () => {
    try {
      // Validate required fields
      if (!formData.email.trim() || !formData.password) {
        Alert.alert('Error', 'Please enter both email and password');
        return;
      }

      // Attempt login with provided credentials
      await login(formData.email, formData.password);
    } catch (error: any) {
      // Extract error message from response or fallback to default
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Login failed. Please try again.';

      // Display error toast to user
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: errorMessage,
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header gradient with patient image */}
      <LinearGradient
        colors={['#2C6EAB', '#3b5998', '#192f6a']}
        style={styles.headerGradient}
      >
        <Image
          source={require('@assets/patientLogin.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </LinearGradient>

      {/* Login form container */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Patient Login</Text>
        
        {/* Email input field with icon */}
        <View style={styles.inputContainer}>
          <Icon name="email" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password input field with toggle visibility */}
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Password"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.visibilityIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Icon
              name={showPassword ? "visibility" : "visibility-off"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Login button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        {/* Registration link */}
        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => navigation.navigate('PatientRegistration')}
        >
          <Text style={styles.registerLinkText}>
            Don't have an account? Register here
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Styles for the PatientLoginScreen component
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  headerGradient: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
  },
  formContainer: {
    flex: 1,
    padding: 20,
    marginTop: -30,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  visibilityIcon: {
    padding: 10,
  },
  loginButton: {
    backgroundColor: '#4c669f',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerLinkText: {
    color: '#4c669f',
    fontSize: 14,
  },
}); 