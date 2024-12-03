import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { requestApi } from '../../services/api';
import Toast from 'react-native-toast-message';
import type { NavigationProp } from '../../types/navigation';

export const NewRequestScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    try {
      await requestApi.createRequest({
        description,
        priority: 'medium',
      });

      Toast.show({
        type: 'success',
        text1: 'Request Created',
        text2: 'Your request has been submitted successfully',
      });

      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to create request',
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Request</Text>
      <TextInput
        style={styles.input}
        placeholder="Describe your request..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Request</Text>
      </TouchableOpacity>
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    minHeight: 100,
  },
  button: {
    backgroundColor: '#4c669f',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 