// Import necessary libraries and components from React and React Native
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';

// Define the NavigationBar component
export const NavigationBar = () => {
  // Access navigation and route objects from the navigation context
  const navigation = useNavigation();
  const route = useRoute();
  // Access authentication state and user details from the AuthContext
  const { isAuthenticated, user } = useAuth();

  // Function to handle the back navigation
  const handleBack = () => {
    // Check if there is a previous screen to go back to
    if (navigation.canGoBack()) {
      navigation.goBack(); // Navigate back to the previous screen
    }
  };

  // Function to determine the title based on the current route name
  const getTitle = () => {
    switch (route.name) {
      case 'Welcome':
        return 'Welcome to NurseConnect';
      case 'PatientLogin':
        return 'Patient Login';
      case 'NurseLogin':
        return 'Nurse Login';
      case 'AdminLogin':
        return 'Admin Login';
      case 'PatientRegistration':
        return 'Patient Registration';
      case 'NurseRegistration':
        return 'Nurse Registration';
      default:
        return 'NurseConnect'; // Default title if no specific route matches
    }
  };

  // Render the navigation bar UI
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {/* Render back button if there is a screen to go back to */}
        {navigation.canGoBack() && (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="grey" />
          </TouchableOpacity>
        )}
        {/* Display the title of the current screen */}
        <Text style={styles.title}>NurseConnect</Text>
      </View>
    </View>
  );
};

// Define styles for the navigation bar components
const styles = StyleSheet.create({
  container: {
    height: Platform.OS === 'ios' ? 90 : 80,
    paddingTop: Platform.OS === 'ios' ? 40 : StatusBar.currentHeight,
    backgroundColor: '#2C6EAB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  title: {
    fontSize: 25,
    fontWeight: '600',
    color: '#FFFFFF',
  }
});