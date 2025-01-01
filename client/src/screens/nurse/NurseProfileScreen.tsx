import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Surface,
  IconButton,
  useTheme,
  Button,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../contexts/AuthContext';

interface NurseUser {
  id: string;
  fullName: string;
  email: string;
  contactNumber?: string;
  nurseRole: string;
}

export const NurseProfileScreen = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);

  const nurseUser = user as NurseUser;

  const getContactNumber = () => {
    return nurseUser?.contactNumber || 'Not provided';
  };

  const handlePhotoUpload = () => {
    // Placeholder for photo upload functionality
    console.log("Photo upload functionality to be implemented");
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#2C6EAB', '#4c669f']}
        style={styles.header}
      >
        <View style={styles.profileImageContainer}>
          <TouchableOpacity onPress={handlePhotoUpload}>
            <View style={styles.imageWrapper}>
              {photo ? (
                <Image source={{ uri: photo }} style={styles.profileImage} />
              ) : (
                <Icon name="account-circle" size={120} color="#fff" />
              )}
            </View>
          </TouchableOpacity>
          <IconButton
            icon={isEditing ? "check" : "pencil"}
            iconColor="#fff"
            size={24}
            onPress={() => setIsEditing(!isEditing)}
            style={styles.editButton}
          />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Surface style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.infoRow}>
            <Icon name="account" size={24} color={theme.colors.primary} />
            <Text style={styles.infoText}>{nurseUser?.fullName || 'Not provided'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="email" size={24} color={theme.colors.primary} />
            <Text style={styles.infoText}>{nurseUser?.email || 'Not provided'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="phone" size={24} color={theme.colors.primary} />
            <Text style={styles.infoText}>{getContactNumber()}</Text>
          </View>
        </Surface>

        <Surface style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Professional Information</Text>
          <View style={styles.infoRow}>
            <Icon name="doctor" size={24} color={theme.colors.primary} />
            <Text style={styles.infoText}>{nurseUser?.nurseRole || 'Not specified'}</Text>
          </View>
        </Surface>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    paddingTop: 40,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  editButton: {
    position: 'absolute',
    right: -50,
    top: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  content: {
    padding: 16,
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
}); 