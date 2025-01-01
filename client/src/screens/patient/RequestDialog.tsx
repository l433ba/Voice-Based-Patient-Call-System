import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  List,
  Divider,
  SegmentedButtons,
} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '@/contexts/AuthContext';
import { DISEASES } from '@/constants/diseases';
import { requestService } from '@/services/api/requestService';
import Toast from 'react-native-toast-message';

interface RequestDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (data: any) => void;
}

export const RequestDialog = ({ visible, onDismiss, onSubmit }: RequestDialogProps) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('new');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    contactNumber: user?.contactNumber || '',
    roomNumber: '',
    bedNumber: '',
    disease: '',
  });

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your full name',
        position: 'top',
        visibilityTime: 4000,
      });
      return false;
    }
    if (!formData.contactNumber.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your contact number',
        position: 'top',
        visibilityTime: 4000,
      });
      return false;
    }
    if (!formData.roomNumber.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your room number',
        position: 'top',
        visibilityTime: 4000,
      });
      return false;
    }
    if (!formData.disease) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please select a disease',
        position: 'top',
        visibilityTime: 4000,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) return;
      
      setIsSubmitting(true);
      const response = await requestService.createRequest(formData);
      
      if (response.data.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Request submitted successfully',
          position: 'top',
          topOffset: 60,
          visibilityTime: 4000,
        });
        
    setFormData({
      fullName: user?.fullName || '',
      contactNumber: user?.contactNumber || '',
      roomNumber: '',
      bedNumber: '',
      disease: '',
    });
        
        onSubmit(response.data.data);
        onDismiss();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.data.message || 'Failed to submit request',
          position: 'top',
          visibilityTime: 4000,
        });
      }
    } catch (error: any) {
      console.error('Error submitting request:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to submit request',
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <Modal visible={visible} onDismiss={onDismiss} animationType="slide">
      <View style={styles.container}>
        <SegmentedButtons
          value={activeTab}
          onValueChange={setActiveTab}
          buttons={[
            { value: 'new', label: 'New Request' },
            { value: 'past', label: 'Past Requests' },
          ]}
          style={styles.tabs}
        />

        {activeTab === 'new' ? (
          <ScrollView style={styles.form}>
            <TextInput
              label="Full Name"
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
              style={styles.input}
            />
            <TextInput
              label="Contact Number"
              value={formData.contactNumber}
              onChangeText={(text) => setFormData({ ...formData, contactNumber: text })}
              style={styles.input}
              keyboardType="phone-pad"
            />
            <TextInput
              label="Room Number"
              value={formData.roomNumber}
              onChangeText={(text) => setFormData({ ...formData, roomNumber: text })}
              style={styles.input}
            />
            <TextInput
              label="Bed Number (Optional)"
              value={formData.bedNumber}
              onChangeText={(text) => setFormData({ ...formData, bedNumber: text })}
              style={styles.input}
            />
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Disease</Text>
              <Picker
                selectedValue={formData.disease}
                onValueChange={(value) => setFormData({ ...formData, disease: value })}
                style={styles.picker}
              >
                <Picker.Item label="Select Disease" value="" />
                {DISEASES.map((disease, index) => (
                  <Picker.Item 
                    key={index} 
                    label={`${disease.english} / ${disease.hindi}`} 
                    value={disease.english} 
                  />
                ))}
              </Picker>
            </View>
            <Button 
              mode="contained" 
              onPress={handleSubmit}
              style={styles.submitButton}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </ScrollView>
        ) : (
          <ScrollView>
            <List.Section>
              <List.Subheader>Previous Requests</List.Subheader>
              {/* Past requests will be mapped here */}
            </List.Section>
          </ScrollView>
        )}
        <TouchableOpacity
          onPress={onDismiss}
          style={styles.closeButton}
        >
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
      </View>
    </Modal>
      <Toast position="top" topOffset={60} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 20,
    position: 'relative',
  },
  tabs: {
    marginBottom: 16,
  },
  form: {
    flex: 1,
  },
  input: {
    marginBottom: 16,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  picker: {
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  submitButton: {
    marginTop: 16,
    marginBottom: 32,
  },
  closeButton: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 50,
  },
  closeButtonText: {
    fontSize: 20,
    color: 'red',
  },
});