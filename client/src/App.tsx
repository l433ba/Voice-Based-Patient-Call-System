import React from 'react';
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './navigation/RootNavigator';
import { AuthProvider } from './contexts/AuthContext';
import { theme } from './theme';
import Toast, { BaseToast } from 'react-native-toast-message';

// Custom Toast Configuration
const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'green' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 15, fontWeight: 'bold' }}
      text2Style={{ fontSize: 13 }}
    />
  ),
  error: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'red' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 15, fontWeight: 'bold' }}
      text2Style={{ fontSize: 13 }}
    />
  ),
};

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        {/* Status Bar Configuration */}
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        {/* PaperProvider for theming */}
        <PaperProvider theme={theme}>
          {/* AuthProvider for managing authentication */}
          <AuthProvider>
            {/* Navigation Container for navigation stack */}
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </AuthProvider>
        </PaperProvider>
        {/* Toast Notifications */}
        <Toast
          config={toastConfig}
          position="top"
          topOffset={60}
        />
      </View>
    </SafeAreaProvider>
  );
}
