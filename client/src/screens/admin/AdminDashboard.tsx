import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '@/contexts/AuthContext';
import { nurseApi, requestApi } from '@/services/api';
import Toast from 'react-native-toast-message';

interface DashboardStats {
  pendingNurses: number;
  activeNurses: number;
  totalPatients: number;
  openRequests: number;
}

interface PendingNurse {
  _id: string;
  fullName: string;
  email: string;
  nurseRole: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    pendingNurses: 0,
    activeNurses: 0,
    totalPatients: 0,
    openRequests: 0
  });
  const [pendingNurses, setPendingNurses] = useState<PendingNurse[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardStats = async () => {
    try {
      const [nursesResponse, requestsResponse] = await Promise.all([
        nurseApi.getNurses(),
        requestApi.getRequests()
      ]);

      const nurses = nursesResponse.data.data;
      const requests = requestsResponse.data.data;

      const pendingCount = nurses.filter(nurse => nurse.status === 'pending').length;
      const approvedCount = nurses.filter(nurse => nurse.status === 'approved').length;

      setStats({
        pendingNurses: pendingCount,
        activeNurses: approvedCount,
        totalPatients: 0,
        openRequests: requests.filter(r => r.status === 'pending').length,
      });

      setPendingNurses(nurses.filter(nurse => nurse.status === 'pending'));
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load dashboard statistics'
      });
    }
  };

  const fetchPendingNurses = async () => {
    try {
      const response = await nurseApi.getNurses();
      if (response.data.success) {
        setPendingNurses(response.data.data.filter(nurse => nurse.status === 'pending'));
      }
    } catch (error) {
      console.error('Error fetching pending nurses:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load pending nurses'
      });
    }
  };

  const handleApproveNurse = async (nurseId: string) => {
    try {
      await nurseApi.approveNurse(nurseId);
      
      setPendingNurses(prev => prev.filter(nurse => nurse._id !== nurseId));
      
      setStats(prev => ({
        ...prev,
        pendingNurses: prev.pendingNurses - 1,
        activeNurses: prev.activeNurses + 1
      }));

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Nurse approved successfully'
      });
    } catch (error) {
      console.error('Error approving nurse:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to approve nurse'
      });
    }
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

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardStats();
    await fetchPendingNurses();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchDashboardStats();
    fetchPendingNurses();
  }, []);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>Welcome, Administrator</Text>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Icon name="logout" size={24} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.pendingNurses}</Text>
          <Text style={styles.statLabel}>Pending Nurses</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.activeNurses}</Text>
          <Text style={styles.statLabel}>Active Nurses</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.openRequests}</Text>
          <Text style={styles.statLabel}>Open Requests</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pending Nurse Approvals</Text>
        {pendingNurses.length === 0 ? (
          <Text style={styles.emptyText}>No pending approvals</Text>
        ) : (
          pendingNurses.map(nurse => (
            <View key={nurse._id} style={styles.nurseCard}>
              <View style={styles.nurseInfo}>
                <Text style={styles.nurseName}>{nurse.fullName}</Text>
                <Text style={styles.nurseEmail}>{nurse.email}</Text>
                <Text style={styles.nurseRole}>{nurse.nurseRole}</Text>
              </View>
              <TouchableOpacity
                style={styles.approveButton}
                onPress={() => handleApproveNurse(nurse._id)}
              >
                <Text style={styles.approveButtonText}>Approve</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="people" size={24} color="#4c669f" />
          <Text style={styles.actionButtonText}>Manage Nurses</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="assignment" size={24} color="#4c669f" />
          <Text style={styles.actionButtonText}>View Requests</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff5f5',
    marginLeft: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4c669f',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  actionsContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    marginTop: 8,
    color: '#4c669f',
    fontWeight: '500',
  },
  section: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  nurseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 10,
  },
  nurseInfo: {
    flex: 1,
  },
  nurseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  nurseEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  nurseRole: {
    fontSize: 14,
    color: '#4c669f',
    marginTop: 2,
  },
  approveButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 4,
  },
  approveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    padding: 20,
  },
});
