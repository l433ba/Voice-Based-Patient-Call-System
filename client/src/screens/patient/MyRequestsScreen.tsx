import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Platform,
} from 'react-native';
import {
  Text,
  Surface,
  IconButton,
  useTheme,
  ActivityIndicator,
  Chip,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import Toast from 'react-native-toast-message';

interface Request {
  id: string;
  description: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  urgency: 'low' | 'normal' | 'high';
  createdAt: string;
  assignedNurse?: {
    name: string;
    id: string;
  };
}

export const MyRequestsScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const theme = useTheme();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRequests = async () => {
    try {
      // Add API call to fetch requests
      setRequests([
        {
          id: '1',
          description: 'Need assistance with medication',
          status: 'pending',
          urgency: 'normal',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          description: 'Require help with mobility',
          status: 'accepted',
          urgency: 'high',
          createdAt: new Date().toISOString(),
          assignedNurse: {
            name: 'Jane Smith',
            id: 'n1',
          },
        },
      ]);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch requests',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRequests();
  };

  const getStatusColor = (status: Request['status']) => {
    switch (status) {
      case 'pending':
        return '#FFA000';
      case 'accepted':
        return '#2196F3';
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const getUrgencyColor = (urgency: Request['urgency']) => {
    switch (urgency) {
      case 'low':
        return '#4CAF50';
      case 'normal':
        return '#2196F3';
      case 'high':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {requests.map((request) => (
          <Surface key={request.id} style={styles.card}>
            <Text style={styles.description}>{request.description}</Text>
            <View style={styles.chipContainer}>
              <Chip
                style={[
                  styles.chip,
                  { backgroundColor: getStatusColor(request.status) },
                ]}
                textStyle={styles.chipText}
              >
                {request.status.toUpperCase()}
              </Chip>
              <Chip
                style={[
                  styles.chip,
                  { backgroundColor: getUrgencyColor(request.urgency) },
                ]}
                textStyle={styles.chipText}
              >
                {request.urgency.toUpperCase()}
              </Chip>
            </View>
            <Text style={styles.date}>
              Created: {format(new Date(request.createdAt), 'MMM dd, yyyy HH:mm')}
            </Text>
            {request.assignedNurse && (
              <Text style={styles.nurse}>
                Assigned to: {request.assignedNurse.name}
              </Text>
            )}
          </Surface>
        ))}
      </ScrollView>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 4,
    margin: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 12,
    color: '#333',
  },
  chipContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  chip: {
    marginRight: 8,
  },
  chipText: {
    color: '#fff',
  },
  date: {
    color: '#666',
    fontSize: 12,
    marginBottom: 4,
  },
  nurse: {
    color: '#333',
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
  },
});