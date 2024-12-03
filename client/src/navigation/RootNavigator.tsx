import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { NavigationBar } from '../components/NavigationBar';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { NurseLoginScreen } from '../screens/auth/NurseLoginScreen';
import { NurseRegistrationScreen } from '../screens/auth/NurseRegistrationScreen';
import { AdminLoginScreen } from '../screens/auth/AdminLoginScreen';
import { PatientRegistrationScreen } from '../screens/auth/PatientRegistrationScreen';
import { PatientDashboard } from '../screens/patient/PatientDashboard';
import { NurseDashboard } from '../screens/nurse/NurseDashboard';
import { AdminDashboard } from '../screens/admin/AdminDashboard';
import { MyPatientsScreen } from '../screens/nurse/MyPatientsScreen';
import { ActiveRequestsScreen } from '../screens/nurse/ActiveRequestsScreen';
import { ScheduleScreen } from '../screens/nurse/ScheduleScreen';
import { ProfileScreen } from '../screens/common/ProfileScreen';
import { NurseApprovalScreen } from '../screens/admin/NurseApprovalScreen';
import { RequestManagementScreen } from '../screens/admin/RequestManagementScreen';
import { ReportsScreen } from '../screens/admin/ReportsScreen';
import { SettingsScreen } from '../screens/common/SettingsScreen';
import { NewRequestScreen } from '../screens/patient/NewRequestScreen';
import { MyRequestsScreen } from '../screens/patient/MyRequestsScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <>
      <NavigationBar />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="NurseLogin" component={NurseLoginScreen} />
            <Stack.Screen name="NurseRegistration" component={NurseRegistrationScreen} />
            <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
            <Stack.Screen name="PatientRegistration" component={PatientRegistrationScreen} />
          </>
        ) : (
          <>
            {user?.role === 'patient' && (
              <Stack.Screen name="PatientDashboard" component={PatientDashboard} />
            )}
            {user?.role === 'nurse' && (
              <Stack.Screen name="NurseDashboard" component={NurseDashboard} />
            )}
            {user?.role === 'admin' && (
              <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
            )}
          </>
        )}
      </Stack.Navigator>
    </>
  );
};