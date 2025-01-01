/**
 * ReportsScreen.tsx
 * Screen component for displaying reports in the admin interface.
 * Currently a basic placeholder screen that will be expanded with reporting functionality.
 * Part of the admin screens suite along with AdminDashboard, NurseApproval, etc.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * ReportsScreen component
 * Simple screen component that renders a title within a container.
 * Will be enhanced to show various reports and analytics.
 */
export const ReportsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reports</Text>
    </View>
  );
};

// Styles for the ReportsScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1,                  // Takes up full available space
    padding: 20,              // Adds padding around content
    backgroundColor: '#fff',  // White background
  },
  title: {
    fontSize: 24,            // Large text size for header
    fontWeight: 'bold',      // Bold text for emphasis
    marginBottom: 20,        // Space below the title
  },
}); 