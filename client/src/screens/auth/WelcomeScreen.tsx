// Import required dependencies from React and React Native
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@/types/navigation';

// Main welcome screen component that handles role selection
export const WelcomeScreen = () => {
  // Initialize navigation hook for screen transitions
  const navigation = useNavigation<NavigationProp>();

  return (
    // Background gradient container
    <LinearGradient
      colors={['#EBF2F9', '#F5F7FA', '#FFFFFF']}
      style={styles.container}
    >
      {/* App title section */}
      <Text style={styles.welcomeText}>Welcome to</Text>
      <Text style={styles.appName}>NurseConnect</Text>
      <Text style={styles.heading}>Select Your Role</Text>

      {/* Role selection buttons container */}
      <View style={styles.buttonContainer}>
        {/* Patient role button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('PatientLogin')}
        >
          <Text style={styles.buttonText}>Patient</Text>
        </TouchableOpacity>
        {/* Nurse role button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('NurseLogin')}
        >
          <Text style={styles.buttonText}>Nurse</Text>
        </TouchableOpacity>
        {/* Admin role button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('AdminLogin')}
        >
          <Text style={styles.buttonText}>Admin</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

// Styles for the welcome screen components
const styles = StyleSheet.create({
  // Main container style with flex layout
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  // Welcome text styling
  welcomeText: {
    fontSize: 24,
    color: '#2C6EAB',
    marginBottom: 8,
  },
  // App name text styling
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C6EAB',
    marginBottom: 40,
  },
  // Role selection heading style
  heading: {
    fontSize: 20,
    color: '#4A5568',
    marginBottom: 30,
  },
  // Container for role selection buttons
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 20,
  },
  // Individual button styling
  button: {
    backgroundColor: '#2C6EAB',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  // Button text styling
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});