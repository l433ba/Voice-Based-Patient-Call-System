import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { requestApi } from '../../services/api';

interface Request {
  _id: string;
  description: string;
  status: string;
}

export const MyRequestsScreen = () => {
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await requestApi.getRequests();
        setRequests(response.data);
      } catch (error) {
        console.error('Failed to fetch requests:', error);
      }
    };

    fetchRequests();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Requests</Text>
      <FlatList
        data={requests}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.requestItem}>
            <Text style={styles.requestDescription}>{item.description}</Text>
            <Text style={styles.requestStatus}>Status: {item.status}</Text>
          </View>
        )}
      />
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
  requestItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  requestDescription: {
    fontSize: 16,
    marginBottom: 5,
  },
  requestStatus: {
    fontSize: 14,
    color: '#666',
  },
}); 