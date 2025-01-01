// Import necessary libraries and components
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Text, Surface, IconButton, useTheme } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { appointmentApi } from '../../services/api/appointmentApi';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';
import Toast from 'react-native-toast-message';

// Define the structure of an Appointment object
interface Appointment {
  id: string; // Unique identifier for the appointment
  date: string; // Date of the appointment
  time: string; // Time of the appointment
  department: string; // Department for the appointment
  status: string; // Status of the appointment (e.g., confirmed, pending, cancelled)
  doctorName: string; // Name of the doctor for the appointment
  type: string; // Type of appointment (e.g., consultation, follow-up)
}

// Main component for the Appointment Screen
export const AppointmentScreen: React.FC = () => {
  // State variables for appointments, loading status, and refreshing status
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Authentication context to get the current user
  const { user } = useAuth();
  const theme = useTheme(); // Get the theme for styling

  // Function to fetch appointments from the API
  const fetchAppointments = async () => {
    try {
      // Check if user ID is available
      if (!user?.id) {
        console.error('No user ID available');
        setAppointments([]); // Set appointments to an empty array if no user ID
        return;
      }
      // Fetch appointments using the appointment API
      const fetchedAppointments = await appointmentApi.fetchAppointments(user.id);
      setAppointments(fetchedAppointments || []); // Update state with fetched appointments
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      setAppointments([]); // Set appointments to an empty array on error
      // Show error message using Toast
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch appointments'
      });
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  // Function to handle refresh action
  const onRefresh = async () => {
    setRefreshing(true); // Set refreshing to true
    await fetchAppointments(); // Fetch appointments
    setRefreshing(false); // Set refreshing to false after fetching
  };

  // Effect to fetch appointments when the component mounts or user ID changes
  useEffect(() => {
    fetchAppointments(); // Fetch appointments
  }, [user?.id]);

  // Function to get color based on appointment status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return ['#4CAF50', '#45B7AF']; // Green colors for confirmed status
      case 'pending':
        return ['#FF9800', '#F57C00']; // Orange colors for pending status
      case 'cancelled':
        return ['#F44336', '#D32F2F']; // Red colors for cancelled status
      default:
        return ['#9E9E9E', '#757575']; // Grey colors for unknown status
    }
  };

  // Show loading indicator while fetching appointments
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={36} color={theme.colors.primary} />
      </View>
    );
  }

  // Render the main component
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" /> {/* Set status bar style */}
      <LinearGradient
        colors={['#2C6EAB', '#3b5998', '#192f6a']} // Gradient colors for header
        style={styles.header}
        start={{ x: 0, y: 0 }} // Start point for gradient
        end={{ x: 1, y: 1 }} // End point for gradient
      >
        <BlurView intensity={20} style={styles.headerBlur}> {/* Blur effect for header */}
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>My Appointments</Text> {/* Header title */}
            <IconButton
              icon="plus" // Icon for adding new appointment
              iconColor="#fff" // Icon color
              size={24} // Icon size
              onPress={() => {/* Handle new appointment */}} // Handle new appointment action
              style={styles.headerButton}
            />
          </View>
        </BlurView>
      </LinearGradient>

      <ScrollView
        style={styles.content} // Main content style
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} /> // Pull-to-refresh functionality
        }
      >
        {appointments.length === 0 ? ( // Check if there are no appointments
          <Surface style={styles.emptyContainer}>
            <Icon name="calendar-blank" size={48} color={theme.colors.primary} /> {/* Icon for empty state */}
            <Text style={styles.emptyText}>No upcoming appointments</Text> {/* Empty state text */}
            <Text style={styles.emptySubtext}>
              Schedule a new appointment to get started
            </Text>
          </Surface>
        ) : (
          appointments.map((appointment) => ( // Map through appointments to render each one
            <Surface key={appointment.id} style={styles.appointmentCard}>
              <LinearGradient
                colors={getStatusColor(appointment.status) as [string, string]} // Get colors based on appointment status
                style={styles.statusBadge}
                start={{ x: 0, y: 0 }} // Start point for gradient
                end={{ x: 1, y: 1 }} // End point for gradient
              >
                <Text style={styles.statusText}>
                  {appointment.status.toUpperCase()} {/* Display appointment status */}
                </Text>
              </LinearGradient>

              <View style={styles.appointmentHeader}>
                <View style={styles.appointmentType}>
                  <Icon
                    name="stethoscope" // Icon for appointment type
                    size={24}
                    color={theme.colors.primary} // Icon color
                  />
                  <Text style={styles.typeText}>{appointment.type}</Text> {/* Display appointment type */}
                </View>
                <Text style={styles.departmentText}>
                  {appointment.department} {/* Display appointment department */}
                </Text>
              </View>

              <View style={styles.appointmentDetails}>
                <View style={styles.detailRow}>
                  <Icon name="calendar" size={20} color="#666" /> {/* Icon for date */}
                  <Text style={styles.detailText}>
                    {format(new Date(appointment.date), 'MMMM dd, yyyy')} {/* Format and display appointment date */}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Icon name="clock-outline" size={20} color="#666" /> {/* Icon for time */}
                  <Text style={styles.detailText}>{appointment.time}</Text> {/* Display appointment time */}
                </View>
                <View style={styles.detailRow}>
                  <Icon name="doctor" size={20} color="#666" /> {/* Icon for doctor */}
                  <Text style={styles.detailText}>
                    Dr. {appointment.doctorName} {/* Display doctor's name */}
                  </Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <IconButton
                  icon="pencil" // Icon for edit action
                  mode="contained"
                  size={20}
                  onPress={() => {/* Handle edit */}} // Handle edit action
                />
                <IconButton
                  icon="cancel" // Icon for cancel action
                  mode="contained"
                  size={20}
                  onPress={() => {/* Handle cancel */}} // Handle cancel action
                  containerColor={theme.colors.error} // Set container color to error color
                />
              </View>
            </Surface>
          ))
        )}
      </ScrollView>
    </View>
  );
}

// Define styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Background color for the container
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center', // Center loading indicator
    alignItems: 'center', // Center loading indicator
  },
  header: {
    paddingTop: 48, // Padding for header top
    paddingBottom: 16, // Padding for header bottom
  },
  headerBlur: {
    padding: 16, // Padding for header blur view
  },
  headerContent: {
    flexDirection: 'row', // Arrange header content in a row
    justifyContent: 'space-between', // Space between header title and button
    alignItems: 'center', // Center items vertically
  },
  headerTitle: {
    fontSize: 28, // Font size for header title
    fontWeight: 'bold', // Bold font weight for header title
    color: '#fff', // White color for header title
  },
  headerButton: {
    backgroundColor: 'rgba(255,255,255,0.1)', // Semi-transparent background for header button
  },
  content: {
    flex: 1, // Flex to fill available space
    padding: 16, // Padding for content
  },
  emptyContainer: {
    padding: 32, // Padding for empty state container
    alignItems: 'center', // Center items in empty state
    borderRadius: 16, // Rounded corners for empty state
    marginTop: 32, // Margin top for empty state
  },
  emptyText: {
    fontSize: 18, // Font size for empty state text
    fontWeight: 'bold', // Bold font weight for empty state text
    marginTop: 16, // Margin top for empty state text
    color: '#333', // Dark color for empty state text
  },
  emptySubtext: {
    fontSize: 14, // Font size for empty state subtext
    color: '#666', // Grey color for empty state subtext
    marginTop: 8, // Margin top for empty state subtext
  },
  appointmentCard: {
    borderRadius: 16, // Rounded corners for appointment card
    marginBottom: 16, // Margin bottom for appointment card
    overflow: 'hidden', // Hide overflow for rounded corners
    elevation: 4, // Elevation for shadow effect
  },
  statusBadge: {
    paddingHorizontal: 12, // Horizontal padding for status badge
    paddingVertical: 6, // Vertical padding for status badge
    borderTopLeftRadius: 16, // Rounded corner for top left
    borderBottomRightRadius: 16, // Rounded corner for bottom right
    alignSelf: 'flex-start', // Align badge to the start
  },
  statusText: {
    color: '#fff', // White color for status text
    fontWeight: 'bold', // Bold font weight for status text
    fontSize: 12, // Font size for status text
  },
  appointmentHeader: {
    padding: 16, // Padding for appointment header
    borderBottomWidth: 1, // Bottom border width
    borderBottomColor: '#eee', // Bottom border color
  },
  appointmentType: {
    flexDirection: 'row', // Arrange appointment type in a row
    alignItems: 'center', // Center items vertically
    marginBottom: 8, // Margin bottom for appointment type
  },
  typeText: {
    fontSize: 18, // Font size for appointment type text
    fontWeight: 'bold', // Bold font weight for appointment type text
    marginLeft: 8, // Margin left for appointment type text
  },
  departmentText: {
    fontSize: 14, // Font size for department text
    color: '#666', // Grey color for department text
  },
  appointmentDetails: {
    padding: 16, // Padding for appointment details
  },
  detailRow: {
    flexDirection: 'row', // Arrange detail row in a row
    alignItems: 'center', // Center items vertically
    marginBottom: 12, // Margin bottom for detail row
  },
  detailText: {
    marginLeft: 12, // Margin left for detail text
    fontSize: 16, // Font size for detail text
    color: '#333', // Dark color for detail text
  },
  actionButtons: {
    flexDirection: 'row', // Arrange action buttons in a row
    justifyContent: 'flex-end', // Align buttons to the end
    padding: 8, // Padding for action buttons
    borderTopWidth: 1, // Top border width for action buttons
    borderTopColor: '#eee', // Top border color for action buttons
  },
});
