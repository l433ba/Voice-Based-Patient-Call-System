/**
 * PatientNavigator.tsx
 * Defines the navigation stack for the patient section of the application.
 * Uses React Navigation's Stack Navigator to manage screen transitions and routing.
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PatientDashboard } from '@/screens/patient/PatientDashboard';
import ChatScreen from '@/screens/patient/ChatScreen';
import { EmergencyScreen } from '@/screens/patient/EmergencyScreen';
import { NewRequestScreen } from '@/screens/patient/NewRequestScreen';
import { MyRequestsScreen } from '@/screens/patient/MyRequestsScreen';
import { NavigationBar } from '@/components/NavigationBar';
import { MedicalRecordsScreen } from '@/screens/patient/MedicalRecordsScreen';
import { AppointmentScreen } from '@/screens/patient/AppointmentScreen';
import { MedicationsScreen } from '@/screens/patient/MedicationsScreen';
import { PatientProfileScreen } from '@/screens/patient/PatientProfileScreen';


// Initialize stack navigator for patient screens
const Stack = createStackNavigator();

/**
 * Default screen configuration applied to all screens in the patient navigation stack
 * - Uses custom NavigationBar component as the header
 * - Sets white background color for all screens
 */
const defaultScreenOptions = {
  header: () => <NavigationBar />,
  cardStyle: { backgroundColor: '#fff' },
};

/**
 * PatientNavigator Component
 * Defines the navigation structure for patient-specific screens
 * Includes routes for:
 * - Dashboard (main patient view)
 * - Medical records viewing
 * - Appointment management
 * - Medications tracking
 * - Patient profile settings
 * - Chat functionality with healthcare providers
 * - Emergency assistance
 * - Creating new requests
 * - Viewing existing requests
 */
export const PatientNavigator = () => {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen name="PatientDashboard" component={PatientDashboard} />
      <Stack.Screen name="MedicalRecordsScreen" component={MedicalRecordsScreen} />
      <Stack.Screen name="AppointmentScreen" component={AppointmentScreen} />
      <Stack.Screen name="MedicationsScreen" component={MedicationsScreen} />
      <Stack.Screen name="PatientProfileScreen" component={PatientProfileScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="EmergencyScreen" component={EmergencyScreen} />
      <Stack.Screen name="NewRequestScreen" component={NewRequestScreen} />
      <Stack.Screen name="MyRequestsScreen" component={MyRequestsScreen} />
    </Stack.Navigator>
  );
};
