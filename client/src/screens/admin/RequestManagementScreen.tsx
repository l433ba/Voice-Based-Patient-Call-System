// Import necessary dependencies from React and React Native
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';

// Define request status types
type RequestStatus = 'pending' | 'assigned' | 'completed' | 'cancelled';

// Define the structure of a request object
type Request = {
  id: string;
  patientName: string;
  roomNumber: string;
  requestType: string;
  priority: 'high' | 'medium' | 'low';
  status: RequestStatus;
  assignedNurse?: string;
  createdAt: string;
};

export const RequestManagementScreen = () => {
  // State management for search, filter and requests
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');
  const [requests, setRequests] = useState<Request[]>([
    {
      id: '1',
      patientName: 'John Doe',
      roomNumber: '101',
      requestType: 'Medication',
      priority: 'high',
      status: 'pending',
      createdAt: '2024-02-20 10:30 AM',
    },
    // Add more dummy data...
  ]);

  // Helper function to determine color based on priority level
  const getPriorityColor = (priority: Request['priority']) => {
    switch (priority) {
      case 'high':
        return '#F44336';
      case 'medium':
        return '#FFC107';
      case 'low':
        return '#4CAF50';
      default:
        return '#999';
    }
  };

  // Helper function to determine color based on request status
  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case 'pending':
        return '#FFC107';
      case 'assigned':
        return '#2196F3';
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      default:
        return '#999';
    }
  };

  // Component to render individual request cards
  const renderRequestCard = ({ item }: { item: Request }) => (
    <View style={styles.card}>
      {/* Card Header - Patient Info and Priority Badge */}
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.patientName}>{item.patientName}</Text>
          <Text style={styles.roomNumber}>Room {item.roomNumber}</Text>
        </View>
        <View style={[
          styles.priorityBadge,
          { backgroundColor: getPriorityColor(item.priority) }
        ]}>
          <Text style={styles.priorityText}>{item.priority}</Text>
        </View>
      </View>

      {/* Request Details Section */}
      <View style={styles.requestDetails}>
        <View style={styles.detailRow}>
          <Icon name="local-hospital" size={16} color="#666" />
          <Text style={styles.detailText}>{item.requestType}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="access-time" size={16} color="#666" />
          <Text style={styles.detailText}>{item.createdAt}</Text>
        </View>
        {item.assignedNurse && (
          <View style={styles.detailRow}>
            <Icon name="person" size={16} color="#666" />
            <Text style={styles.detailText}>Assigned to: {item.assignedNurse}</Text>
          </View>
        )}
      </View>

      {/* Card Footer - Status and Action Buttons */}
      <View style={styles.cardFooter}>
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(item.status) }
        ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="edit" size={20} color="#4c669f" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="delete" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search and Filter Section */}
      <View style={styles.filterContainer}>
        <View style={styles.searchBox}>
          <Icon name="search" size={24} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search requests..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={statusFilter}
            onValueChange={(value) => setStatusFilter(value)}
            style={styles.picker}
          >
            <Picker.Item label="All Status" value="all" />
            <Picker.Item label="Pending" value="pending" />
            <Picker.Item label="Assigned" value="assigned" />
            <Picker.Item label="Completed" value="completed" />
            <Picker.Item label="Cancelled" value="cancelled" />
          </Picker>
        </View>
      </View>

      {/* Request List */}
      <FlatList
        data={requests}
        renderItem={renderRequestCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

// Styles definition
const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  // List styles
  list: {
    padding: 16,
    gap: 16,
  },
  // Card styles
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  roomNumber: {
    fontSize: 14,
    color: '#666',
  },
  // Badge styles
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  // Detail styles
  requestDetails: {
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
  // Footer styles
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
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
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
});
