// Import necessary dependencies for navigation and authentication
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from "react";
import { useAuth } from '../contexts/AuthContext';

// Import screen components
import { LoginScreen } from '../screens/auth/LoginScreen'; 
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { AdminDashboard } from '../screens/admin/AdminDashboard';
import { NurseDashboard } from '../screens/nurse/NurseDashboard';


// Create navigation stack
const Stack = createNativeStackNavigator();

/**
 * MainStack component handles the main navigation structure of the app
 * It manages authentication state and role-based routing
 */
export const MainStack = () => {
  // Get authentication state and user details from context
  const { isAuthenticated, user } = useAuth();

  // Determine initial route based on auth state and user role
  const getInitialRoute = () => {
    if (!isAuthenticated) return 'Login';
    return user?.role === 'admin' ? 'AdminDashboard' : 'NurseDashboard';
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={getInitialRoute()}
        screenOptions={{
          headerShown: true,
        }}
      >
        {/* Render auth screens when not authenticated */}
        {!isAuthenticated ? (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: 'Login' }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: 'Register' }}
            />
          </>
        ) : (
          // Render role-specific dashboard when authenticated
          user?.role === 'admin' ? (
            <Stack.Screen
              name="AdminDashboard"
              component={AdminDashboard}
              options={{ title: 'Admin Dashboard' }}
            />
          ) : (
            <Stack.Screen
              name="NurseDashboard"
              component={NurseDashboard}
              options={{ title: 'Nurse Dashboard' }}
            />
          )
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};