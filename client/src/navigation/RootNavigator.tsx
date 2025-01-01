// Import necessary dependencies
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import authentication screens
import { WelcomeScreen } from '@/screens/auth/WelcomeScreen';
import { PatientLoginScreen } from '@/screens/auth/PatientLoginScreen';
import { NurseLoginScreen } from '@/screens/auth/NurseLoginScreen';
import { AdminLoginScreen } from '@/screens/auth/AdminLoginScreen';
import { PatientRegistrationScreen } from '@/screens/auth/PatientRegistrationScreen';
import { NurseRegistrationScreen } from '@/screens/auth/NurseRegistrationScreen';

// Import role-specific navigators
import { NurseNavigator } from './NurseNavigator';
import { PatientNavigator } from './PatientNavigator';
import { AdminDashboard } from '@/screens/admin/AdminDashboard';

// Import contexts and components
import { useAuth } from '@/contexts/AuthContext';
import { NavigationBar } from '@/components/NavigationBar';

// Create stack navigator instance
const Stack = createStackNavigator();

// Screen options for authentication screens
const authScreenOptions = {
  header: () => <NavigationBar />,
  cardStyle: { backgroundColor: '#fff' },
};

// Default screen options used for authenticated screens
const defaultScreenOptions = {
  header: () => <NavigationBar />,
  cardStyle: { backgroundColor: '#fff' },
};

/**
 * Root Navigator Component
 * Handles the main navigation structure of the app based on authentication state
 * and user role. Shows different navigation stacks for:
 * - Unauthenticated users (auth screens)
 * - Authenticated nurses (nurse-specific screens)
 * - Authenticated admins (admin dashboard)
 * - Authenticated patients (patient-specific screens)
 */
export const RootNavigator = () => {
  const { user, isAuthenticated } = useAuth();

  // Show authentication stack for unauthenticated users
  if (!isAuthenticated) {
    return (
      <Stack.Navigator screenOptions={authScreenOptions}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="PatientLogin" component={PatientLoginScreen} />
        <Stack.Screen name="NurseLogin" component={NurseLoginScreen} />
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
        <Stack.Screen name="PatientRegistration" component={PatientRegistrationScreen} />
        <Stack.Screen name="NurseRegistration" component={NurseRegistrationScreen} />
      </Stack.Navigator>
    );
  }

  // Show nurse-specific navigation stack
  if (user?.role === 'nurse') {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="NurseApp" component={NurseNavigator} />
      </Stack.Navigator>
    );
  }

  // Show admin dashboard
  if (user?.role === 'admin') {
    return (
      <Stack.Navigator screenOptions={defaultScreenOptions}>
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      </Stack.Navigator>
    );
  }

  // Show patient-specific navigation stack (default case)
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PatientApp" component={PatientNavigator} />
    </Stack.Navigator>
  );
};