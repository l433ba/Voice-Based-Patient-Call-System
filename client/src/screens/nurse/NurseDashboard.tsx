import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { NavigationProp } from '@/types/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { requestApi } from '@/services/api';
import { socketService } from '@/services/socketService';
import { RequestResponse } from '@/types/api';
import Toast from 'react-native-toast-message';

export const NurseDashboard = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout } = useAuth();
  const [activeRequests, setActiveRequests] = useState<RequestResponse[]>([]);
  const [assignedPatients, setAssignedPatients] = useState<number>(0);
  const [completedTasks, setCompletedTasks] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [requestsResponse, patientsResponse] = await Promise.all([
        requestApi.getRequests({ status: 'pending' }),
        requestApi.getRequests({ status: 'completed' }),
      ]);

      setActiveRequests(requestsResponse.data);
      setCompletedTasks(patientsResponse.data.length);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Listen for new requests
    socketService.onNewRequest(({ request }) => {
      setActiveRequests(prev => [...prev, request]);
      Toast.show({
        type: 'info',
        text1: 'New Request',
        text2: 'You have a new patient request',
      });
    });

    // Listen for request updates
    socketService.onRequestStatusUpdated(({ request }) => {
      if (request.status === 'completed') {
        setActiveRequests(prev =>
          prev.filter(req => req.id !== request.id)
        );
        setCompletedTasks(prev => prev + 1);
      }
    });

    return () => {
      socketService.removeListener('new_request');
      socketService.removeListener('request_status_updated');
    };
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await logout();
              // Navigation will be handled by AuthContext
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Logout Failed',
                text2: 'Please try again'
              });
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Welcome, {user?.fullName}</Text>
            <Text style={styles.roleText}>{user?.nurseRole}</Text>
          </View>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Icon name="logout" size={24} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Today's Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{assignedPatients}</Text>
            <Text style={styles.statLabel}>Assigned Patients</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{activeRequests.length}</Text>
            <Text style={styles.statLabel}>Active Requests</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{completedTasks}</Text>
            <Text style={styles.statLabel}>Completed Tasks</Text>
          </View>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.menuGrid}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('MyPatients')}
          >
            <Icon name="people" size={32} color="#4c669f" />
            <Text style={styles.menuItemText}>My Patients</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('ActiveRequests')}
          >
            <Icon name="notifications-active" size={32} color="#4c669f" />
            <Text style={styles.menuItemText}>Active Requests</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Schedule')}
          >
            <Icon name="schedule" size={32} color="#4c669f" />
            <Text style={styles.menuItemText}>My Schedule</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Profile')}
          >
            <Icon name="person" size={32} color="#4c669f" />
            <Text style={styles.menuItemText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  roleText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  logoutButton: {
    padding: 0,
    borderRadius: 8,
    backgroundColor: '#fff5f5',
    marginLeft: -8,
  },
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4c669f',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  menuContainer: {
    padding: 20,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  menuItem: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItemText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});
