/**
 * ActiveRequestsScreen.tsx
 * Screen component for nurses to view and manage active patient requests.
 * Features real-time updates, priority-based sorting, and request completion functionality.
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Badge,
  Text,
} from 'react-native-paper';
import { requestService } from '@/services/api/requestService';
import { socket } from '@/services/socketService';
import Toast from 'react-native-toast-message';
import { RequestResponse } from '@/types/api';

export const ActiveRequestsScreen = () => {
  // State management for requests list and refresh indicator
  const [requests, setRequests] = useState<RequestResponse[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Fetches active requests from the server and sorts them by priority
   */
  const fetchRequests = async () => {
    try {
      setRefreshing(true);
      const response = await requestService.getRequests();
      console.log('Response:', response);
      
      // Filter out completed requests and sort by priority
      const activeRequests = response.data.requests.filter(
        req => req.status !== 'completed'
      );
      const criticalRequests = activeRequests.filter(req => req.priority === 'critical');
      const highRequests = activeRequests.filter(req => req.priority === 'high');
      const mediumRequests = activeRequests.filter(req => req.priority === 'medium');
      const lowRequests = activeRequests.filter(req => req.priority === 'low');
      setRequests([...criticalRequests, ...highRequests, ...mediumRequests, ...lowRequests]);
    } catch (error) {
      console.error('Error fetching requests:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch requests',
        position: 'top',
        topOffset: 60,
      });
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Initial fetch of requests
    fetchRequests();

    // Socket listener for new incoming requests
    socket.on('newRequest', (request) => {
      // Critical requests are added to the top, others to the bottom
      if (request.priority === 'critical') {
        setRequests(prev => [request, ...prev]);
      } else {
        setRequests(prev => [...prev, request]);
      }
      Toast.show({
        type: 'info',
        text1: 'New Request',
        text2: `Priority: ${request.priority} - Patient: ${request.fullName}`,
        position: 'top',
        topOffset: 60,
        visibilityTime: 6000,
      });
    });

    // Socket listener for request status updates
    socket.on('request_status_updated', (updatedRequest) => {
      if (updatedRequest.status === 'completed') {
        setRequests(prev => prev.filter(req => req.id !== updatedRequest.id));
      } else {
        setRequests(prev => prev.map(req => 
          req.id === updatedRequest.id ? updatedRequest : req
        ));
      }
    });

    // Cleanup socket listeners on component unmount
    return () => {
      socket.off('newRequest');
      socket.off('request_status_updated');
    };
  }, []);

  /**
   * Handles marking a request as completed
   * @param requestId - ID of the request to complete
   */
  const handleComplete = async (requestId: string) => {
    try {
      await requestService.updateRequestStatus(requestId, 'completed');
      setRequests(prev => prev.filter(req => req.id !== requestId));
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Request marked as completed',
        position: 'top',
        topOffset: 60,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to complete request',
        position: 'top',
        topOffset: 60,
      });
    }
  };

  /**
   * Returns color code based on request priority
   * @param priority - Priority level of the request
   */
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#FF0000';
      case 'high': return '#FF6B6B';
      case 'medium': return '#FFA500';
      case 'low': return '#4CAF50';
      default: return '#757575';
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchRequests} />
      }
    >
      {requests.map((request) => (
        <Card key={request.id} style={styles.card}>
          <Card.Content>
            <View style={styles.headerRow}>
              <Title>{request.fullName}</Title>
              <Badge
                style={[
                  styles.priorityBadge,
                  { backgroundColor: getPriorityColor(request.priority) }
                ]}
              >
                {request.priority}
              </Badge>
            </View>
            <Paragraph>Room: {request.roomNumber}</Paragraph>
            <Paragraph>Disease: {request.disease}</Paragraph>
            <Paragraph>Description: {request.description}</Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="contained" 
              onPress={() => handleComplete(request.id)}
            >
              Mark as Completed
            </Button>
          </Card.Actions>
        </Card>
      ))}
      {requests.length === 0 && (
        <Text style={styles.emptyText}>No active requests</Text>
      )}
      <Toast position="top" topOffset={60} />
    </ScrollView>
  );
};

// Styles for the screen components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});