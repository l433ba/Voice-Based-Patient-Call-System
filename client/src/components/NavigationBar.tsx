import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '@/contexts/AuthContext';

export const NavigationBar = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NurseConnect</Text>
      {isAuthenticated && (user?.role === 'patient' || user?.role === 'nurse' || user?.role === 'admin') && (
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {user.role === 'admin' ? 'Administrator' : 
             user.role === 'nurse' ? `Nurse: ${user.fullName}` : 
             user.fullName}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === 'ios' ? 90 : 60,
    paddingTop: Platform.OS === 'ios' ? 40 : StatusBar.currentHeight,
    backgroundColor: '#4c669f',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 3,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  userName: {
    color: '#fff',
    fontSize: 14,
    marginRight: 8,
    textAlign: 'right',
    maxWidth: 150,
  },
}); 