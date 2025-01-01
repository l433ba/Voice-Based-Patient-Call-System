/**
 * PatientRegistrationScreen.tsx
 * Screen component for patient registration with form validation and voice recording capability.
 * Provides a comprehensive registration form with required fields and bilingual disease options.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { NavigationProp } from '@/types/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Toast from 'react-native-toast-message';

// Disease options with bilingual labels (English/Hindi)
const diseases = [
  'Select Disease',
  'Arthritis (जोड़ की बीमारी)',
  'Asthma (फेफड़े विकसित होने वाली बीमारी)',
  'Cancer (कैंसर)',
  'Chronic Kidney Disease (दीर्घकालिक गुर्दे रोग)', 
  'Diabetes (मधुमेह)',
  'Hypertension (उच्च रक्तचाप)',
  'Heart Disease (दिल की बीमारी)',
  'Migraine (सिरदर्द/माइग्रेन)',
  'Liver Disease (जिगर रोग)',
  'Other (अन्य)'
];

export const PatientRegistrationScreen = () => {
  // Navigation hook for screen transitions
  const navigation = useNavigation<NavigationProp>();
  // Auth context hook for registration functionality
  const { registerPatient } = useAuth();
  // State for voice recording feature
  const [isRecording, setIsRecording] = useState(false);
  
  // Form data state management
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullAddress: '',
    contactNumber: '',
    emergencyContact: '',
    roomNumber: '',
    bedNumber: '',
    disease: 'Select Disease',
  });

  // Password visibility toggle states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /**
   * Validates all required form fields before submission
   * @returns {boolean} Whether the form is valid
   */
  const validateForm = () => {
    if (!formData.fullName.trim()) {
      Alert.alert('Error', 'Full name is required');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Email is required');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    if (!formData.fullAddress.trim()) {
      Alert.alert('Error', 'Address is required');
      return false;
    }
    if (!formData.contactNumber.trim()) {
      Alert.alert('Error', 'Contact number is required');
      return false;
    }
    if (!formData.emergencyContact.trim()) {
      Alert.alert('Error', 'Emergency contact is required');
      return false;
    }
    if (!formData.roomNumber.trim()) {
      Alert.alert('Error', 'Room number is required');
      return false;
    }
    if (formData.disease === 'Select Disease') {
      Alert.alert('Error', 'Please select a disease');
      return false;
    }
    return true;
  };

  /**
   * Handles form submission
   * Validates form and attempts patient registration
   */
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await registerPatient(formData);
      
      Toast.show({
        type: 'success',
        text1: 'Registration Successful',
        text2: 'Please login to continue',
      });

      // Navigate to login screen after successful registration
      navigation.navigate('PatientLogin');
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: errorMessage,
      });
      console.error('Registration error:', error);
    }
  };

  /**
   * Handles voice recording toggle
   * Shows toast notification for recording status
   */
  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    // Voice recording logic will be implemented here
    Toast.show({
      type: 'info',
      text1: 'Voice Recording',
      text2: isRecording ? 'Recording stopped' : 'Recording started',
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Patient Registration</Text>

      {/* Voice recording button */}
      <TouchableOpacity 
        style={styles.recordButton}
        onPress={handleVoiceRecord}
        activeOpacity={0.7}
      >
        <View style={styles.recordButtonContent}>
          <Icon 
            name={isRecording ? "mic" : "mic-none"} 
            size={24} 
            color="#fff" 
          />
          <Text style={styles.recordButtonText}>
            {isRecording ? 'Recording...' : 'Tap to record your information'}
          </Text>
        </View>
        {isRecording && (
          <View style={styles.recordingIndicator} />
        )}
      </TouchableOpacity>

      {/* Registration form */}
      <View style={styles.form}>
        {/* Full Name Input */}
        <View style={styles.inputContainer}>
          <Icon name="person" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name *"
            value={formData.fullName}
            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
          />
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Icon name="email" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email *"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Password *"
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

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Confirm Password *"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            style={styles.visibilityIcon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Icon
              name={showConfirmPassword ? "visibility" : "visibility-off"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Address Input */}
        <View style={styles.inputContainer}>
          <Icon name="location-on" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Full Address *"
            value={formData.fullAddress}
            onChangeText={(text) => setFormData({ ...formData, fullAddress: text })}
            multiline
          />
        </View>

        {/* Contact Number Input */}
        <View style={styles.inputContainer}>
          <Icon name="phone" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Contact Number *"
            value={formData.contactNumber}
            onChangeText={(text) => setFormData({ ...formData, contactNumber: text })}
            keyboardType="phone-pad"
          />
        </View>

        {/* Emergency Contact Input */}
        <View style={styles.inputContainer}>
          <Icon name="emergency" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Emergency Contact *"
            value={formData.emergencyContact}
            onChangeText={(text) => setFormData({ ...formData, emergencyContact: text })}
            keyboardType="phone-pad"
          />
        </View>

        {/* Room Number Input */}
        <View style={styles.inputContainer}>
          <Icon name="meeting-room" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Room Number *"
            value={formData.roomNumber}
            onChangeText={(text) => setFormData({ ...formData, roomNumber: text })}
          />
        </View>

        {/* Bed Number Input */}
        <View style={styles.inputContainer}>
          <Icon name="single-bed" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Bed Number (Optional)"
            value={formData.bedNumber}
            onChangeText={(text) => setFormData({ ...formData, bedNumber: text })}
          />
        </View>

        {/* Disease Selection Picker */}
        <View style={[styles.inputContainer, styles.pickerContainer]}>
          <Icon name="local-hospital" size={20} color="#666" style={styles.inputIcon} />
          <Picker
            selectedValue={formData.disease}
            style={[styles.input, styles.picker]}
            onValueChange={(itemValue) => setFormData({ ...formData, disease: itemValue })}
          >
            {diseases.map((disease, index) => (
              <Picker.Item key={index} label={disease} value={disease} />
            ))}
          </Picker>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Register</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate('PatientLogin')}
        >
          <Text style={styles.loginLinkText}>
            Already have an account? Login here
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Styles for the PatientRegistrationScreen component
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  recordButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 25,
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  recordButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  recordButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  recordingIndicator: {
    position: 'absolute',
    right: 15,
    top: '50%',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ff4444',
    transform: [{ translateY: -5 }],
  },
  form: {
    width: '100%',
    gap: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f8f9fa',
    minHeight: 50,
  },
  inputIcon: {
    marginRight: 10,
    width: 20,
    textAlign: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  pickerContainer: {
    padding: 0,
    overflow: 'hidden',
  },
  picker: {
    marginLeft: -8,
    height: 50,
  },
  submitButton: {
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
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  visibilityIcon: {
    padding: 10,
  },
  requiredText: {
    color: '#ff0000',
    fontSize: 14,
    marginLeft: 4,
  },
  loginLink: {
    marginTop: 15,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#4c669f',
    fontSize: 14,
  },
}); 