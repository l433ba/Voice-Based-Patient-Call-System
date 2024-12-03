import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { authApi } from '@/services/api';
import Toast from 'react-native-toast-message';
import type { NavigationProp } from '@/types/navigation';
import { useAuth } from '@/contexts/AuthContext';

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
  const navigation = useNavigation<NavigationProp>();
  const { registerPatient } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    fullAddress: '',
    contactNumber: '',
    emergencyContact: '',
    roomNumber: '',
    bedNumber: '',
    disease: 'Select Disease',
  });

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
    if (!formData.bedNumber.trim()) {
      Alert.alert('Error', 'Bed number is required');
      return false;
    }
    if (formData.disease === 'Select Disease') {
      Alert.alert('Error', 'Please select a disease');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await registerPatient(formData);
      Toast.show({
        type: 'success',
        text1: 'Registration Successful',
        text2: 'Welcome to NurseConnect',
      });
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Patient Registration</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={formData.fullName}
          onChangeText={(text) => setFormData({ ...formData, fullName: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Full Address"
          value={formData.fullAddress}
          onChangeText={(text) => setFormData({ ...formData, fullAddress: text })}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          value={formData.contactNumber}
          onChangeText={(text) => setFormData({ ...formData, contactNumber: text })}
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="Emergency Contact"
          value={formData.emergencyContact}
          onChangeText={(text) => setFormData({ ...formData, emergencyContact: text })}
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="Room Number"
          value={formData.roomNumber}
          onChangeText={(text) => setFormData({ ...formData, roomNumber: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Bed Number"
          value={formData.bedNumber}
          onChangeText={(text) => setFormData({ ...formData, bedNumber: text })}
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.disease}
            style={styles.picker}
            onValueChange={(itemValue) => setFormData({ ...formData, disease: itemValue })}
          >
            {diseases.map((disease, index) => (
              <Picker.Item key={index} label={disease} value={disease} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

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
  },
  recordButton: {
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  recordButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  orText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  form: {
    gap: 15,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  submitButton: {
    backgroundColor: '#4c669f',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 