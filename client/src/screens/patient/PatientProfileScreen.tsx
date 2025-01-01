import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Text, Surface, IconButton, useTheme, Avatar } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

interface ProfileSection {
  title: string;
  data: { label: string; value: string; icon: string }[];
}

export const PatientProfileScreen: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);

  const profileSections: ProfileSection[] = [
    {
      title: 'Personal Information',
      data: [
        { label: 'Full Name', value: user?.fullName || 'Not provided', icon: 'account' },
        { label: 'Email', value: user?.email || 'Not provided', icon: 'email' },
        { label: 'Phone', value: user?.contactNumber || 'Not provided', icon: 'phone' },
        { label: 'Date of Birth', value: user?.dateOfBirth || 'Not provided', icon: 'calendar' },
      ],
    },
    {
      title: 'Medical Information',
      data: [
        { label: 'Blood Type', value: user?.bloodType || 'Not provided', icon: 'water' },
        { label: 'Allergies', value: user?.allergies?.join(', ') || 'None', icon: 'alert-circle' },
        { label: 'Emergency Contact', value: user?.emergencyContact || 'Not provided', icon: 'phone-alert' },
        { label: 'Insurance', value: user?.insurance || 'Not provided', icon: 'shield-check' },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#2C6EAB', '#3b5998', '#192f6a']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <BlurView intensity={20} style={styles.headerBlur}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Profile</Text>
            <IconButton
              icon={isEditing ? 'check' : 'pencil'}
              iconColor="#fff"
              size={24}
              onPress={() => setIsEditing(!isEditing)}
              style={styles.editButton}
            />
          </View>
        </BlurView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Surface style={styles.profileHeader}>
          <Avatar.Image
            size={100}
            source={{ uri: user?.avatar || 'https://via.placeholder.com/100' }}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user?.fullName || 'Not provided'}</Text>
            <Text style={styles.patientId}>ID: {user?.id}</Text>
          </View>
        </Surface>

        {profileSections.map((section, sectionIndex) => (
          <Surface key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.data.map((item, index) => (
              <View key={index} style={styles.infoRow}>
                <View style={styles.iconContainer}>
                  <Icon name={item.icon} size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.label}>{item.label}</Text>
                  <Text style={styles.value}>{item.value}</Text>
                </View>
              </View>
            ))}
          </Surface>
        ))}

        <Surface style={[styles.section, styles.actionsSection]}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="file-document" size={24} color={theme.colors.primary} />
            <Text style={styles.actionText}>Download Medical Records</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="printer" size={24} color={theme.colors.primary} />
            <Text style={styles.actionText}>Print Profile</Text>
          </TouchableOpacity>
        </Surface>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 1,
    paddingBottom: 12,
  },
  headerBlur: {
    padding: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  editButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  patientId: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginTop: 2,
  },
  actionsSection: {
    padding: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
});
