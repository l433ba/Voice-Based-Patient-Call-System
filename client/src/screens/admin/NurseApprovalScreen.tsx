// Import necessary dependencies from React and React Native
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { nurseApi } from '@/services/api';
import Toast from 'react-native-toast-message';
import { NurseResponse } from '@/types/api';

// Main component for handling nurse approval workflow
export const NurseApprovalScreen = () => {
  // State management for nurse applications, loading state, and errors
  const [applications, setApplications] = useState<NurseResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch nurses data on component mount
  useEffect(() => {
    fetchNurses();
  }, []);

  // Function to fetch nurse applications from the API
  const fetchNurses = async () => {
    try {
      setError(null);
      const response = await nurseApi.getNurses();
      setApplications(response.data);
    } catch (error) {
      setError('Failed to fetch nurses');
      console.error('Failed to fetch nurses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for approving a nurse application
  const handleApprove = async (id: string) => {
    try {
      await nurseApi.approveNurse(id);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Nurse approved successfully',
      });
      fetchNurses();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to approve nurse',
      });
      console.error(error);
    }
  };

  // Loading state UI
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size={36} color="#4c669f" />
      </View>
    );
  }

  // Error state UI
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchNurses}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render individual nurse application card
  const renderApplicationCard = ({ item }: { item: NurseResponse }) => (
    <View style={styles.card}>
      {/* Header section with nurse info and status */}
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Icon name="person" size={30} color="#666" />
          </View>
          <View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </View>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(item.status) }
        ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      {/* Details section with role, experience, and application date */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Icon name="work" size={16} color="#666" />
          <Text style={styles.detailText}>Role: {item.role}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="history" size={16} color="#666" />
          <Text style={styles.detailText}>Experience: {item.experience}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="event" size={16} color="#666" />
          <Text style={styles.detailText}>Applied: {item.createdAt}</Text>
        </View>
      </View>

      {/* Action buttons for pending applications */}
      {item.status === 'pending' && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleApprove(item.id)}
          >
            <Icon name="check" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleReject(item.id)}
          >
            <Icon name="close" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  // Helper function to determine status badge color
  const getStatusColor = (status: NurseResponse['status']) => {
    switch (status) {
      case 'approved':
        return '#4CAF50';
      case 'rejected':
        return '#F44336';
      default:
        return '#FFC107';
    }
  };

  // Main render
  return (
    <View style={styles.container}>
      <FlatList
        data={applications}
        renderItem={renderApplicationCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  detailsContainer: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4c669f',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

// TODO: Implement reject functionality
function handleReject(id: string): void {
  throw new Error('Function not implemented.');
}
