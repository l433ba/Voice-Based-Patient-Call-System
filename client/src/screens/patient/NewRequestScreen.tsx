import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Surface,
  useTheme,
  IconButton,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

export const NewRequestScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const theme = useTheme();
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('normal');

  const handleSubmit = async () => {
    try {
      // Add API call to submit request
      Toast.show({
        type: 'success',
        text1: 'Request Submitted',
        text2: 'A nurse will be assigned to your request shortly.',
      });
      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to submit request. Please try again.',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.content}>
        <Surface style={styles.card}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            mode="outlined"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your needs..."
            style={styles.input}
          />

          <Text style={styles.label}>Urgency</Text>
          <View style={styles.urgencyContainer}>
            {['low', 'normal', 'high'].map((level) => (
              <Button
                key={level}
                mode={urgency === level ? 'contained' : 'outlined'}
                onPress={() => setUrgency(level)}
                style={styles.urgencyButton}
                labelStyle={styles.buttonLabel}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Button>
            ))}
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitButton}
            disabled={!description.trim()}
          >
            Submit Request
          </Button>
        </Surface>
      </ScrollView>
      <Toast />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    elevation: 4,
    margin: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  urgencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 8,
  },
  urgencyButton: {
    flex: 1,
  },
  buttonLabel: {
    fontSize: 14,
  },
  submitButton: {
    marginTop: 8,
    paddingVertical: 6,
  },
});