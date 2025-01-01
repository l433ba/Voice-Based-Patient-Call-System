/**
 * AdminDashboard.tsx
 * Main dashboard screen for administrators to manage nurses and view system statistics.
 * Provides functionality for approving new nurse registrations and monitoring key metrics.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Dimensions,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '@/contexts/AuthContext';
import { nurseApi, requestApi } from '@/services/api';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Types for dashboard statistics
interface DashboardStats {
  pendingNurses: number;
  activeNurses: number;
  totalPatients: number;
  openRequests: number;
}

// Type definition for nurse approval requests
interface PendingNurse {
  _id: string;
  fullName: string;
  email: string;
  nurseRole: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const AdminDashboard = () => {
  // Access authentication context
  const { user, logout } = useAuth();
  
  // State management for dashboard data
  const [stats, setStats] = useState<DashboardStats>({
    pendingNurses: 0,
    activeNurses: 0,
    totalPatients: 0,
    openRequests: 0
  });
  const [pendingNurses, setPendingNurses] = useState<PendingNurse[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Fetches and updates dashboard statistics including nurse and request counts
   */
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

  /**
   * Fetches the list of nurses pending approval
   */
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

  /**
   * Handles the approval of a nurse registration request
   * Updates local state and sends approval to backend
   */
  const handleApproveNurse = async (nurseId: string) => {
    try {
      await nurseApi.approveNurse(nurseId);
      
      // Remove approved nurse from pending list
      setPendingNurses(prev => prev.filter(nurse => nurse._id !== nurseId));
      
      // Update dashboard statistics
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

  /**
   * Handles admin logout with confirmation dialog
   */
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

  /**
   * Handles pull-to-refresh functionality
   */
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardStats();
    await fetchPendingNurses();
    setRefreshing(false);
  };

  // Initial data fetch on component mount
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
      <LinearGradient
        colors={['#2C6EAB', '#4c669f']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.adminName}>Administrator</Text>
          </View>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Icon name="logout" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.statsContainer}>
        <View style={styles.statRow}>
          <View style={[styles.statCard, styles.elevation]}>
            <Icon name="people" size={32} color="#2C6EAB" />
          <Text style={styles.statNumber}>{stats.pendingNurses}</Text>
          <Text style={styles.statLabel}>Pending Nurses</Text>
        </View>
          <View style={[styles.statCard, styles.elevation]}>
            <Icon name="medical-services" size={32} color="#2C6EAB" />
          <Text style={styles.statNumber}>{stats.activeNurses}</Text>
          <Text style={styles.statLabel}>Active Nurses</Text>
          </View>
        </View>
        <View style={styles.statRow}>
          <View style={[styles.statCard, styles.elevation]}>
            <Icon name="assignment" size={32} color="#2C6EAB" />
          <Text style={styles.statNumber}>{stats.openRequests}</Text>
          <Text style={styles.statLabel}>Open Requests</Text>
          </View>
          <View style={[styles.statCard, styles.elevation]}>
            <Icon name="person" size={32} color="#2C6EAB" />
            <Text style={styles.statNumber}>{stats.totalPatients}</Text>
            <Text style={styles.statLabel}>Total Patients</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pending Approvals</Text>
        {pendingNurses.length === 0 ? (
          <View style={[styles.emptyState, styles.elevation]}>
            <Icon name="check-circle" size={48} color="#2C6EAB" />
          <Text style={styles.emptyText}>No pending approvals</Text>
          </View>
        ) : (
          pendingNurses.map(nurse => (
            <View key={nurse._id} style={[styles.nurseCard, styles.elevation]}>
              <View style={styles.nurseInfo}>
                <View style={styles.nurseIconContainer}>
                  <Icon name="person" size={24} color="#fff" />
                </View>
                <View style={styles.nurseDetails}>
                <Text style={styles.nurseName}>{nurse.fullName}</Text>
                <Text style={styles.nurseEmail}>{nurse.email}</Text>
                <Text style={styles.nurseRole}>{nurse.nurseRole}</Text>
                </View>
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

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={[styles.actionCard, styles.elevation]}>
            <Icon name="people" size={32} color="#2C6EAB" />
            <Text style={styles.actionText}>Manage Nurses</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionCard, styles.elevation]}>
            <Icon name="assignment" size={32} color="#2C6EAB" />
            <Text style={styles.actionText}>View Requests</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionCard, styles.elevation]}>
            <Icon name="analytics" size={32} color="#2C6EAB" />
            <Text style={styles.actionText}>Reports</Text>
        </TouchableOpacity>
          <TouchableOpacity style={[styles.actionCard, styles.elevation]}>
            <Icon name="settings" size={32} color="#2C6EAB" />
            <Text style={styles.actionText}>Settings</Text>
        </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  adminName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  statsContainer: {
    padding: 15,
    marginTop: -30,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    width: width * 0.44,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  nurseCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  nurseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nurseIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2C6EAB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  nurseDetails: {
    flex: 1,
  },
  nurseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  nurseEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  nurseRole: {
    fontSize: 14,
    color: '#2C6EAB',
    marginTop: 2,
  },
  approveButton: {
    backgroundColor: '#2C6EAB',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'flex-end',
  },
  approveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  quickActions: {
    padding: 15,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    width: width * 0.44,
    alignItems: 'center',
    marginBottom: 15,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  elevation: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  }
});
