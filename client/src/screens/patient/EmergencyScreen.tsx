import React, { useState } from 'react'; // Importing React and useState hook for managing state
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native'; // Importing necessary components from react-native
import {
  Text,
  Surface,
  IconButton,
  useTheme,
  Button,
  Modal,
  ProgressBar,
} from 'react-native-paper'; // Importing components from react-native-paper for UI elements
import { LinearGradient } from 'expo-linear-gradient'; // Importing LinearGradient for background styling
import { BlurView } from 'expo-blur'; // Importing BlurView for blurred background effect
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Importing MaterialCommunityIcons for icons
import Animated, { 
  FadeInDown, 
  useAnimatedStyle, 
  withSpring,
  withRepeat,
  withSequence,
} from 'react-native-reanimated'; // Importing Animated components for animations
import { useAuth } from '@/contexts/AuthContext'; // Importing authentication context
import { requestApi } from '@/services/api'; // Importing API service for requests
import Toast from 'react-native-toast-message'; // Importing Toast for notifications

// EmergencyScreen component definition
export const EmergencyScreen: React.FC = () => {
  // State variables for managing emergency status and UI
  const [emergencyActive, setEmergencyActive] = useState(false); // Tracks if emergency is active
  const [helpOnWay, setHelpOnWay] = useState(false); // Tracks if help is on the way
  const [confirmationVisible, setConfirmationVisible] = useState(false); // Controls visibility of confirmation modal
  const [estimatedTime, setEstimatedTime] = useState(0); // Estimated time for help arrival
  const theme = useTheme(); // Accessing theme for styling
  const { user } = useAuth(); // Getting user information from authentication context

  // Animated style for the emergency button's pulsing effect
  const pulseStyle = useAnimatedStyle(() => {
    if (!emergencyActive) return {}; // Return empty style if not active
    return {
      transform: [
        {
          scale: withRepeat(
            withSequence(
              withSpring(1.2), // Scale up
              withSpring(1) // Scale down
            ),
            -1, // Repeat indefinitely
            true // Reverse the animation
          ),
        },
      ],
    };
  });

  // Function to handle emergency button press
  const handleEmergency = () => {
    setConfirmationVisible(true); // Show confirmation modal
  };

  // Function to confirm the emergency alert
  const confirmEmergency = async () => {
    try {
      setConfirmationVisible(false); // Hide confirmation modal
      setEmergencyActive(true); // Set emergency as active
      setEstimatedTime(3); // Mock estimated time in minutes

      // Sending emergency request to the API
      const response = await requestApi.createEmergencyRequest({
        patientId: user?.id, // Patient ID from user context
        priority: 'high', // Setting priority to high
        description: 'Emergency alert triggered', // Description of the alert
        department: 'Emergency', // Department handling the emergency
      });

      // Check if the response indicates success
      if (response.success) {
        setHelpOnWay(true); // Indicate that help is on the way
        Toast.show({
          type: 'success', // Type of toast notification
          text1: 'Emergency Alert Sent', // Main message
          text2: 'Help is on the way!', // Additional message
          position: 'top', // Position of the toast
          topOffset: 60, // Offset from the top
        });
      } else {
        throw new Error('Failed to create emergency request'); // Throw error if request fails
      }
    } catch (error) {
      console.error('Emergency request error:', error); // Log error
      setEmergencyActive(false); // Reset emergency active state
      Alert.alert(
        'Error', // Alert title
        'Failed to send emergency alert. Please try again or contact the front desk.', // Alert message
        [{ text: 'OK' }] // Alert button
      );
    }
  };

  // Function to cancel the emergency alert
  const cancelEmergency = () => {
    Alert.alert(
      'Cancel Emergency', // Alert title
      'Are you sure you want to cancel the emergency alert?', // Alert message
      [
        { text: 'No', style: 'cancel' }, // Cancel button
        {
          text: 'Yes', // Confirm button
          style: 'destructive', // Destructive style
          onPress: () => {
            setEmergencyActive(false); // Reset emergency active state
            setHelpOnWay(false); // Reset help on the way state
            Toast.show({
              type: 'info', // Type of toast notification
              text1: 'Emergency Alert Cancelled', // Main message
              position: 'top', // Position of the toast
              topOffset: 60, // Offset from the top
            });
          },
        },
      ]
    );
  };

  // Emergency button component
  const EmergencyButton = () => (
    <Animated.View style={[styles.emergencyButtonContainer, pulseStyle]}>
      <TouchableOpacity
        style={[
          styles.emergencyButton, // Base button style
          emergencyActive && styles.emergencyButtonActive, // Active button style
        ]}
        onPress={handleEmergency} // Handle button press
        disabled={emergencyActive} // Disable button if emergency is active
      >
        <Icon
          name="alert-octagon" // Icon for emergency button
          size={64} // Icon size
          color={emergencyActive ? '#fff' : '#f44336'} // Icon color based on state
        />
        <Text style={[
          styles.emergencyButtonText, // Base text style
          emergencyActive && styles.emergencyButtonTextActive, // Active text style
        ]}>
          {emergencyActive ? 'EMERGENCY ACTIVE' : 'PRESS FOR EMERGENCY'} // Button text based on state
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  // Quick actions component for additional options
  const QuickActions = () => (
    <View style={styles.quickActions}>
      <Surface style={styles.actionCard}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="phone" size={32} color={theme.colors.primary} /> // Call Nurse action
          <Text style={styles.actionText}>Call Nurse</Text>
        </TouchableOpacity>
      </Surface>

      <Surface style={styles.actionCard}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="medical-bag" size={32} color={theme.colors.primary} /> // Medical Help action
          <Text style={styles.actionText}>Medical Help</Text>
        </TouchableOpacity>
      </Surface>

      <Surface style={styles.actionCard}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="pill" size={32} color={theme.colors.primary} /> // Medicine action
          <Text style={styles.actionText}>Medicine</Text>
        </TouchableOpacity>
      </Surface>

      <Surface style={styles.actionCard}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="doctor" size={32} color={theme.colors.primary} /> // Assistance action
          <Text style={styles.actionText}>Assistance</Text>
        </TouchableOpacity>
      </Surface>
    </View>
  );

  // Main render function
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" /> // Set status bar style
      <LinearGradient
        colors={emergencyActive ? ['#f44336', '#d32f2f'] : ['#2C6EAB', '#3b5998', '#192f6a']} // Gradient colors based on emergency state
        style={styles.header}
        start={{ x: 0, y: 0 }} // Start point for gradient
        end={{ x: 1, y: 1 }} // End point for gradient
      >
        <BlurView intensity={20} style={styles.headerBlur}> // Blur effect for header
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Emergency</Text> // Header title
            {emergencyActive && ( // Show close button if emergency is active
              <IconButton
                icon="close" // Close icon
                iconColor="#fff" // Icon color
                size={24} // Icon size
                onPress={cancelEmergency} // Handle cancel emergency
                style={styles.headerButton}
              />
            )}
          </View>
        </BlurView>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <Animated.View entering={FadeInDown}> // Animated view for status display
          {emergencyActive ? ( // Check if emergency is active
            <Surface style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <Icon name="alert-circle" size={32} color="#f44336" /> // Alert icon
                <Text style={styles.statusTitle}>Emergency Alert Active</Text> // Status title
              </View>
              
              {helpOnWay && ( // Show help status if help is on the way
                <React.Fragment>
                  <Text style={styles.statusText}>Help is on the way!</Text> // Help status message
                  <View style={styles.estimatedTime}>
                    <Text style={styles.estimatedTimeText}>
                      Estimated arrival in {estimatedTime} minutes // Estimated time message
                    </Text>
                    <ProgressBar
                      progress={0.3} // Progress bar value
                      color={theme.colors.primary} // Progress bar color
                      style={styles.progressBar} // Progress bar style
                    />
                  </View>
                </React.Fragment>
              )}
            </Surface>
          ) : (
            <EmergencyButton /> // Render emergency button if not active
          )}

          <QuickActions /> // Render quick actions
        </Animated.View>
      </ScrollView>

      <Modal
        visible={confirmationVisible} // Modal visibility based on state
        onDismiss={() => setConfirmationVisible(false)} // Handle modal dismiss
        contentContainerStyle={styles.modalContainer} // Modal container style
      >
        <View style={styles.modalContent}>
          <Icon name="alert" size={48} color="#f44336" /> // Alert icon in modal
          <Text style={styles.modalTitle}>Confirm Emergency</Text> // Modal title
          <Text style={styles.modalText}>
            Are you sure you want to trigger an emergency alert? // Modal message
          </Text>
          <View style={styles.modalButtons}>
            <Button
              mode="outlined" // Button mode
              onPress={() => setConfirmationVisible(false)} // Handle cancel
              style={styles.modalButton}
            >
              Cancel // Cancel button text
            </Button>
            <Button
              mode="contained" // Button mode
              onPress={confirmEmergency} // Handle confirm
              style={[styles.modalButton, styles.confirmButton]} // Button styles
              buttonColor="#f44336" // Button color
            >
              Confirm // Confirm button text
            </Button>
          </View>
        </View>
      </Modal>
      <Toast /> // Toast notification component
    </View>
  );
};

// Styles for the EmergencyScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1, // Full height
    backgroundColor: '#f8f9fa', // Background color
  },
  header: {
    height: 120, // Header height
    justifyContent: 'flex-end', // Align content to the bottom
  },
  headerBlur: {
    padding: 16, // Padding for header
  },
  headerContent: {
    flexDirection: 'row', // Row layout for header content
    justifyContent: 'space-between', // Space between header items
    alignItems: 'center', // Center items vertically
  },
  headerTitle: {
    fontSize: 28, // Header title font size
    fontWeight: 'bold', // Header title font weight
    color: '#fff', // Header title color
  },
  headerButton: {
    margin: 0, // No margin for header button
  },
  content: {
    flex: 1, // Full height for content
    padding: 16, // Padding for content
  },
  emergencyButtonContainer: {
    alignItems: 'center', // Center align emergency button
    marginVertical: 24, // Vertical margin
  },
  emergencyButton: {
    width: 200, // Button width
    height: 200, // Button height
    borderRadius: 100, // Circular button
    backgroundColor: '#fff', // Button background color
    justifyContent: 'center', // Center content
    alignItems: 'center', // Center content
    elevation: 4, // Elevation for shadow
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.25, // Shadow opacity
    shadowRadius: 3.84, // Shadow radius
  },
  emergencyButtonActive: {
    backgroundColor: '#f44336', // Active button background color
  },
  emergencyButtonText: {
    marginTop: 8, // Margin above text
    fontSize: 16, // Text font size
    fontWeight: 'bold', // Text font weight
    color: '#f44336', // Text color
    textAlign: 'center', // Center text
  },
  emergencyButtonTextActive: {
    color: '#fff', // Active text color
  },
  quickActions: {
    flexDirection: 'row', // Row layout for quick actions
    flexWrap: 'wrap', // Wrap actions to next line
    justifyContent: 'space-between', // Space between actions
    marginTop: 24, // Margin above quick actions
  },
  actionCard: {
    width: '48%', // Card width
    marginBottom: 16, // Margin below card
    borderRadius: 12, // Card border radius
    elevation: 2, // Card elevation
  },
  actionButton: {
    padding: 16, // Padding for action button
    alignItems: 'center', // Center align action button content
  },
  actionText: {
    marginTop: 8, // Margin above action text
    fontSize: 14, // Action text font size
    fontWeight: '500', // Action text font weight
  },
  statusCard: {
    padding: 16, // Padding for status card
    borderRadius: 12, // Status card border radius
    marginVertical: 24, // Vertical margin for status card
    elevation: 2, // Status card elevation
  },
  statusHeader: {
    flexDirection: 'row', // Row layout for status header
    alignItems: 'center', // Center align status header items
    marginBottom: 16, // Margin below status header
  },
  statusTitle: {
    marginLeft: 12, // Margin left for status title
    fontSize: 20, // Status title font size
    fontWeight: 'bold', // Status title font weight
  },
  statusText: {
    fontSize: 16, // Status text font size
    marginBottom: 16, // Margin below status text
  },
  estimatedTime: {
    marginTop: 8, // Margin above estimated time
  },
  estimatedTimeText: {
    fontSize: 14, // Estimated time text font size
    marginBottom: 8, // Margin below estimated time text
  },
  progressBar: {
    height: 8, // Progress bar height
    borderRadius: 4, // Progress bar border radius
  },
  modalContainer: {
    backgroundColor: '#fff', // Modal background color
    margin: 20, // Margin for modal
    borderRadius: 12, // Modal border radius
    padding: 20, // Padding for modal content
  },
  modalContent: {
    alignItems: 'center', // Center align modal content
  },
  modalTitle: {
    fontSize: 24, // Modal title font size
    fontWeight: 'bold', // Modal title font weight
    marginVertical: 16, // Vertical margin for modal title
  },
  modalText: {
    fontSize: 16, // Modal text font size
    textAlign: 'center', // Center align modal text
    marginBottom: 24, // Margin below modal text
  },
  modalButtons: {
    flexDirection: 'row', // Row layout for modal buttons
    justifyContent: 'space-around', // Space around modal buttons
    width: '100%', // Full width for modal buttons
  },
  modalButton: {
    minWidth: 120, // Minimum width for modal buttons
  },
  confirmButton: {
    backgroundColor: '#f44336', // Confirm button background color
  },
});