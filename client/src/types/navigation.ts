import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  NurseLogin: undefined;
  NurseRegistration: undefined;
  AdminLogin: undefined;
  PatientRegistration: undefined;
  PatientDashboard: undefined;
  NurseDashboard: undefined;
  AdminDashboard: undefined;
  MyPatients: undefined;
  ActiveRequests: undefined;
  Schedule: undefined;
  Profile: undefined;
  ForgotPassword: undefined;
  NurseApproval: undefined;
  RequestManagement: undefined;
  Reports: undefined;
  Settings: undefined;
  NewRequest: undefined;
  MyRequests: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>; 