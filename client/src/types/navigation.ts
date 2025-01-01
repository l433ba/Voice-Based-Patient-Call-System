import { NavigationProp as ReactNavigationProp } from '@react-navigation/native';

export type RootStackParamList = {
  // Auth Screens
  Welcome: undefined;
  PatientLogin: undefined;
  NurseLogin: undefined;
  AdminLogin: undefined;
  PatientRegistration: undefined;
  NurseRegistration: undefined;

  // Main App Screens
  NurseApp: undefined;
  AdminDashboard: undefined;
  PatientDashboard: undefined;

  // Nurse Screens
  NurseDashboard: undefined;
  ActiveRequests: undefined;
  CompletedRequests: undefined;
  MyPatients: undefined;
  Schedule: undefined;
  NurseProfile: undefined;
  CompletedTasks: undefined;

  // Patient Screens
  NewRequest: undefined;
  MyRequests: undefined;
  MedicalRecords: undefined;
  Appointments: undefined;
  Medications: undefined;
  PatientProfile: undefined;
  Chat: undefined;
  ChatBubble: undefined;

  // Admin Screens
  ManageNurses: undefined;
  ManagePatients: undefined;
  SystemSettings: undefined;
  RequestManagement: undefined;
  NurseApproval: undefined;
  Reports: undefined;
  
};

export type NavigationProp = ReactNavigationProp<RootStackParamList>;