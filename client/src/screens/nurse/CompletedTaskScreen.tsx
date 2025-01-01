/**
 * CompletedTaskScreen.tsx
 * Screen component for nurses to view completed patient requests.
 * Features real-time updates via socket connection and pull-to-refresh functionality.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Text,
} from 'react-native-paper';
import { requestApi } from '@/services/api'; // Importing the API service for fetching requests
import Toast from 'react-native-toast-message'; // Importing Toast for displaying messages
import { RequestResponse } from '@/types/api'; // Importing the RequestResponse type for type safety
import { socket } from '@/services/socketService'; // Importing socket service for real-time updates
import { useFocusEffect } from '@react-navigation/native'; // Hook to run effects when the screen is focused

export const CompletedTaskScreen = () => {
  // State for storing completed requests and refresh indicator
  const [completedRequests, setCompletedRequests] = useState<RequestResponse[]>([]); // State to hold completed requests
  const [refreshing, setRefreshing] = useState(false); // State to manage the refreshing indicator

  /**
   * Fetches completed requests from the API
   * Filters requests with 'completed' status
   */
  const fetchCompletedRequests = async () => {
    try {
      const response = await requestApi.getRequests(); // Fetching requests from the API
      const completed = response.data.requests.filter(
        req => req.status === 'completed' // Filtering requests to get only completed ones
      );
      setCompletedRequests(completed); // Updating state with completed requests
    } catch (error) {
      // Handling errors during the fetch
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch completed requests',
        position: 'top',
        topOffset: 60,
      });
    }
  };

  /**
   * Handles pull-to-refresh functionality
   * Shows refresh indicator while fetching new data
   */
  const onRefresh = React.useCallback(() => {
    setRefreshing(true); // Setting refreshing state to true
    fetchCompletedRequests().finally(() => setRefreshing(false)); // Fetching completed requests and resetting refreshing state
  }, []);

  /**
   * Effect hook that runs when screen comes into focus
   * Sets up socket listener for real-time updates of completed requests
   */
  useFocusEffect(
    React.useCallback(() => {
      fetchCompletedRequests(); // Fetch completed requests when the screen is focused

      // Socket handler for newly completed requests
      const handleRequestCompleted = (request: RequestResponse) => {
        setCompletedRequests(prev => [request, ...prev]); // Adding newly completed request to the state
      };

      // Subscribe to socket events
      socket.on('requestCompleted', handleRequestCompleted); // Listening for completed request events

      // Cleanup socket subscription on unmount
      return () => {
        socket.off('requestCompleted', handleRequestCompleted); // Unsubscribing from the event
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> // Adding pull-to-refresh functionality
        }
      >
        {completedRequests.length === 0 ? (
          <Text style={styles.emptyText}>No completed requests</Text> // Message when there are no completed requests
        ) : (
          completedRequests.map((request) => (
            <Card key={request.id} style={styles.card}> // Rendering each completed request in a card
              <Card.Content>
                <Title>{request.fullName}</Title> // Displaying patient's full name
                <Paragraph>Room: {request.roomNumber}</Paragraph> // Displaying room number
                <Paragraph>Disease: {request.disease}</Paragraph> // Displaying disease information
                <Text>Completed at: {new Date(request.completedAt).toLocaleString()}</Text> // Displaying completion time
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
      <Toast position="top" topOffset={60} /> // Toast for displaying messages
    </View>
  );
};

/**
 * Component styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5', // Background color for the container
  },
  card: {
    marginBottom: 16,
    elevation: 4, // Elevation for shadow effect on cards
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666', // Color for the empty state text
  },
});
