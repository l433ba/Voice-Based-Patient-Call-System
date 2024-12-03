import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from "react";
import { useAuth } from '../contexts/AuthContext';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import { AdminDashboard } from '../screens/admin/AdminDashboard';
import { NurseDashboard } from '../screens/nurse/NurseDashboard';

const Stack = createNativeStackNavigator();

export const MainStack = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? (user?.role === 'admin' ? 'AdminDashboard' : 'NurseDashboard') : 'Login'}
        screenOptions={{
          headerShown: true,
        }}
      >
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
        ) : user?.role === 'admin' ? (
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
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};