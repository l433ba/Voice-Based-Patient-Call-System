import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const ActiveRequestsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Active Requests</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
}); 