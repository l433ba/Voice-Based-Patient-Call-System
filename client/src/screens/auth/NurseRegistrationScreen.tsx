// Import necessary dependencies from React and React Native
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  useTheme,
} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@/types/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

// Define nurse role options with bilingual labels (English/Hindi)
const nurseRoles = [
  { label: 'Select Role *', value: '' },
  { label: 'General Nurse / सामान्य नर्स', value: 'general_nurse' },
  { label: 'Staff Nurse / स्टाफ नर्स', value: 'staff_nurse' },
  { label: 'ICU Nurse / आईसीयू नर्स', value: 'icu_nurse' },
  { label: 'Emergency Nurse / आपातकालीन नर्स', value: 'emergency_nurse' },
];

export const NurseRegistrationScreen = () => {
  // Initialize navigation, auth context and theme
  const navigation = useNavigation<NavigationProp>();
  const { registerNurse } = useAuth();
  const theme = useTheme();
  
  // Initialize form state with empty values
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactNumber: '',
    nurseRole: '',
  });

  // State for password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validate all form fields before submission
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
    if (!formData.contactNumber.trim()) {
      Alert.alert('Error', 'Contact number is required');
      return false;
    }
    if (!formData.nurseRole) {
      Alert.alert('Error', 'Please select a role');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // Attempt to register nurse with provided data
      const response = await registerNurse(formData);
      
      // Show success message
      Toast.show({
        type: 'success',
        text1: 'Registration Successful',
        text2: 'Please wait for admin approval to login',
      });

      // Navigate to login screen after successful registration
      navigation.navigate('NurseLogin');
    } catch (error: any) {
      // Handle registration errors
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: errorMessage,
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Nurse Registration</Text>
      <View style={styles.form}>
        {/* Full Name Input */}
        <View style={styles.inputContainer}>
          <Icon name="account" size={20} color={theme.colors.primary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name *"
            value={formData.fullName}
            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
          />
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Icon name="email" size={20} color={theme.colors.primary} style={styles.inputIcon} />
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
          <Icon name="lock" size={20} color={theme.colors.primary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password *"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry={!showPassword}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <Icon name="lock-check" size={20} color={theme.colors.primary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password *"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            secureTextEntry={!showConfirmPassword}
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? "eye-off" : "eye"}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
          />
        </View>

        {/* Contact Number Input */}
        <View style={styles.inputContainer}>
          <Icon name="phone" size={20} color={theme.colors.primary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Contact Number *"
            value={formData.contactNumber}
            onChangeText={(text) => setFormData({ ...formData, contactNumber: text })}
            keyboardType="phone-pad"
          />
        </View>

        {/* Nurse Role Picker */}
        <View style={[styles.inputContainer, styles.pickerContainer]}>
          <Icon name="doctor" size={20} color={theme.colors.primary} style={styles.inputIcon} />
          <Picker
            selectedValue={formData.nurseRole}
            onValueChange={(value) => setFormData({ ...formData, nurseRole: value })}
            style={styles.picker}
          >
            {nurseRoles.map((role, index) => (
              <Picker.Item key={index} label={role.label} value={role.value} />
            ))}
          </Picker>
        </View>

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
        >
          Register
        </Button>

        {/* Login Link */}
        <Button
          mode="text"
          onPress={() => navigation.navigate('NurseLogin')}
          style={styles.loginLink}
        >
          Already have an account? Login here
        </Button>
      </View>
    </ScrollView>
  );
};

// Styles for the registration screen components
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  form: {
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
    backgroundColor: 'transparent',
  },
  pickerContainer: {
    padding: 0,
    overflow: 'hidden',
  },
  picker: {
    flex: 1,
    height: 50,
    marginLeft: -8,
  },
  submitButton: {
    marginTop: 20,
    height: 50,
    justifyContent: 'center',
  },
  loginLink: {
    marginTop: 15,
  },
}); 