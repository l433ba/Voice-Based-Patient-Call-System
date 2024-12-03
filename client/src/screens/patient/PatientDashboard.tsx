import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { NavigationProp } from '@/types/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { requestApi } from '@/services/api';
import Toast from 'react-native-toast-message';

interface Request {
  _id: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
}

export const PatientDashboard = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout } = useAuth();
  const [activeRequests, setActiveRequests] = useState<Request[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRequests = async () => {
    try {
      const response = await requestApi.getRequests();
      if (response.data.success) {
        setActiveRequests(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load requests',
      });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRequests();
    setRefreshing(false);
  };

  const handleLogout = async () => {
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
                text2: 'Please try again',
              });
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View>
            <Text style={styles.welcomeText}>Welcome, {user?.fullName}</Text>
            <Text style={styles.emailText}>{user?.email}</Text>
          </View>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Icon name="logout" size={24} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('NewRequest')}
        >
          <Icon name="add-circle-outline" size={24} color="#4c669f" />
          <Text style={styles.actionButtonText}>New Request</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.requestsContainer}>
        <Text style={styles.sectionTitle}>Active Requests</Text>
        {activeRequests.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No active requests</Text>
          </View>
        ) : (
          activeRequests.map((request) => (
            <View key={request._id} style={styles.requestCard}>
              <Text style={styles.requestDescription}>{request.description}</Text>
              <View style={styles.requestDetails}>
                <Text style={[
                  styles.priorityBadge,
                  { backgroundColor: getPriorityColor(request.priority) }
                ]}>
                  {request.priority.toUpperCase()}
                </Text>
                <Text style={styles.requestTime}>
                  {new Date(request.createdAt).toLocaleString()}
                </Text>
              </View>
              <Text style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(request.status) }
              ]}>
                {request.status.toUpperCase()}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return '#ff4444';
    case 'medium': return '#ffbb33';
    case 'low': return '#00C851';
    default: return '#4c669f';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return '#00C851';
    case 'in_progress': return '#33b5e5';
    case 'assigned': return '#ffbb33';
    case 'cancelled': return '#ff4444';
    default: return '#4c669f';
  }
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
  profileSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  emailText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff5f5',
  },
  actionsContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '45%',
  },
  actionButtonText: {
    marginTop: 8,
    color: '#4c669f',
    fontWeight: '500',
  },
  requestsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#666',
    fontSize: 16,
  },
  requestCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  requestDescription: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  requestDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  requestTime: {
    color: '#666',
    fontSize: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
}); 