/**
 * Navigation configuration and theme settings for the application
 */

import { DefaultTheme, Theme } from '@react-navigation/native';

/**
 * Custom navigation theme that extends the default React Navigation theme
 * Customizes colors while maintaining other default theme properties
 */
export const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff', // Sets white background for all screens
    primary: '#007AFF',   // Sets iOS blue as primary color for navigation elements
  },
};

/**
 * Default screen options applied to all screens in the navigation stack
 * - Hides the default header
 * - Sets white background for screen content
 * - Configures screen transition animations
 */
export const screenOptions = {
  headerShown: false,                           // Hides the navigation header
  contentStyle: { backgroundColor: '#fff' },    // White background for content
  animation: 'fade',                           // Fade transition between screens
  animationDuration: 200,                      // Animation duration in milliseconds
};
