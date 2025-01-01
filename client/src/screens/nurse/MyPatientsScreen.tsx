// Import necessary React and React Native components
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

// Define the Patient type with required properties
type Patient = {
  id: string;
  name: string;
  roomNumber: string;
  bedNumber: string;
  disease: string;
  status: 'completed' | 'pending' | 'recovering';
};

// Main component for displaying the nurse's patient list
export const MyPatientsScreen = () => {
  // State for search functionality
  const [searchQuery, setSearchQuery] = useState('');
  // State for storing patient data
  const [patients, setPatients] = useState<Patient[]>([
    // Dummy data - replace with actual API call
    {
      id: '1',
      name: 'Kailash maurya',
      roomNumber: '101',
      bedNumber: '001',
      disease: 'Diabetes',
      status: 'completed',
    },
    // Add more dummy data...
  ]);

  // Component to render individual patient cards
  const renderPatientCard = ({ item }: { item: Patient }) => (
    <TouchableOpacity style={styles.patientCard}>
      {/* Patient header with name and status */}
      <View style={styles.patientHeader}>
        <Text style={styles.patientName}>{item.name}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(item.status) }
        ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      {/* Patient details section */}
      <View style={styles.patientInfo}>
        <View style={styles.infoRow}>
          <Icon name="room" size={16} color="#666" />
          <Text style={styles.infoText}>Room {item.roomNumber}, Bed {item.bedNumber}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="local-hospital" size={16} color="#666" />
          <Text style={styles.infoText}>{item.disease}</Text>
        </View>
      </View>

      {/* Action buttons for patient interaction */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="message" size={20} color="#4c669f" />
          <Text style={styles.actionButtonText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="notifications" size={20} color="#4c669f" />
          <Text style={styles.actionButtonText}>Alerts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="edit" size={20} color="#4c669f" />
          <Text style={styles.actionButtonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Helper function to determine status color based on patient status
  const getStatusColor = (status: Patient['status']) => {
    switch (status) {
      case 'stable':
        return '#4CAF50';
      case 'critical':
        return '#F44336';
      case 'recovering':
        return '#FFC107';
      default:
        return '#999';
    }
  };

  // Main render method
  return (
    <View style={styles.container}>
      {/* Search bar section */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search patients..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Patient list section */}
      <FlatList
        data={patients}
        renderItem={renderPatientCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  listContainer: {
    padding: 15,
    gap: 15,
  },
  // Patient card styles
  patientCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  patientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
  patientInfo: {
    gap: 8,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    color: '#666',
    fontSize: 14,
  },
  // Action button styles
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  actionButton: {
    alignItems: 'center',
    gap: 5,
  },
  actionButtonText: {
    color: '#4c669f',
    fontSize: 12,
  },
});
