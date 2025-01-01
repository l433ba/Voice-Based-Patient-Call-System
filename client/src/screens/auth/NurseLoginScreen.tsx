// Import necessary dependencies from React and React Native
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import Toast from 'react-native-toast-message';
import type { NavigationProp } from '@/types/navigation';

// Main component for the nurse login screen
export const NurseLoginScreen = () => {
  // Initialize navigation and auth hooks
  const navigation = useNavigation<NavigationProp>();
  const { login } = useAuth();
  
  // State management for form inputs
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Handle login form submission
  const handleLogin = async () => {
    try {
      // Validate form inputs
      if (!formData.email.trim() || !formData.password) {
        Alert.alert('Error', 'Please enter both email and password');
        return;
      }

      // Attempt to login with provided credentials
      await login(formData.email, formData.password);
    } catch (error: any) {
      // Handle login errors and display appropriate message
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Login failed. Please try again.';

      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: errorMessage,
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo/Image display */}
      <Image
        source={require('@assets/Nurse.png')}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>Nurse Login</Text>
      
      {/* Login form */}
      <View style={styles.form}>
        {/* Email input field */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password input field */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          secureTextEntry
        />

        {/* Login button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        {/* Registration link */}
        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => navigation.navigate('NurseRegistration')}
        >
          <Text style={styles.registerLinkText}>
            Don't have an account? Register here
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  form: {
    width: '100%',
    maxWidth: 350,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  loginButton: {
    backgroundColor: '#4c669f',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: 20,
  },
  registerLinkText: {
    color: '#4c669f',
    textAlign: 'center',
    fontSize: 14,
  },
}); 