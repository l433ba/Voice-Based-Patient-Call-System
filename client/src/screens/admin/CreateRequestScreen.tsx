/**
 * CreateRequestScreen.tsx
 * Screen component for creating new requests in the admin interface.
 * Allows selection of patient, nurse, priority, department and adding description.
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Card, Title, HelperText, Divider, Menu } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { departmentApi, userApi, Request } from '../../services/api';
import { useNavigation } from '@react-navigation/native';

// Type definitions for data models
interface Department {
  id: string;
  name: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

// Form validation schema using Yup
const validationSchema = Yup.object().shape({
  patient: Yup.string().required('Patient is required'),
  nurse: Yup.string().required('Nurse is required'),
  priority: Yup.string().oneOf(['low', 'medium', 'high']).required('Priority is required'),
  description: Yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
  department: Yup.string().required('Department is required'),
});

export default function CreateRequestScreen() {
  // State management for form data and UI
  const [departments, setDepartments] = useState<Department[]>([]);
  const [patients, setPatients] = useState<User[]>([]);
  const [nurses, setNurses] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const navigation = useNavigation();

  // Fetch initial data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Fetches departments, patients and approved nurses data
   * Uses Promise.all for concurrent API calls
   */
  const fetchData = async () => {
    try {
      const [deptResponse, patientsResponse, nursesResponse] = await Promise.all([
        departmentApi.getAll(),
        userApi.getUsersByRole('patient'),
        userApi.getUsersByRole('nurse', 'approved'),
      ]);

      setDepartments(deptResponse.departments);
      setPatients(patientsResponse);
      setNurses(nursesResponse);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch required data');
    }
  };

  /**
   * Handles form submission
   * Converts department ID to name before sending request
   */
  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      // Convert department id back to proper enum value
      const requestData = {
        ...values,
        department: departments.find(d => d.id === values.department)?.name
      };
      await userApi.createRequest(requestData);
      Alert.alert('Success', 'Request created successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Create New Request</Title>
          <Divider style={styles.divider} />

          {/* Formik form wrapper for handling form state and validation */}
          <Formik
            initialValues={{
              patient: '',
              nurse: '',
              priority: '',
              description: '',
              department: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
              <View>
                {/* Patient Selection Menu */}
                <Menu
                  visible={values.showPatientMenu}
                  onDismiss={() => setFieldValue('showPatientMenu', false)}
                  anchor={
                    <TextInput
                      mode="outlined"
                      label="Select Patient"
                      value={patients.find(p => p._id === values.patient)?.firstName || ''}
                      onFocus={() => setFieldValue('showPatientMenu', true)}
                      error={touched.patient && !!errors.patient}
                    />
                  }
                >
                  {patients.map((patient) => (
                    <Menu.Item
                      key={patient._id}
                      onPress={() => {
                        setFieldValue('patient', patient._id);
                        setFieldValue('showPatientMenu', false);
                      }}
                      title={`${patient.firstName} ${patient.lastName}`}
                    />
                  ))}
                </Menu>
                <HelperText type="error" visible={touched.patient && !!errors.patient}>
                  {errors.patient}
                </HelperText>

                {/* Nurse Selection Menu */}
                <Menu
                  visible={values.showNurseMenu}
                  onDismiss={() => setFieldValue('showNurseMenu', false)}
                  anchor={
                    <TextInput
                      mode="outlined"
                      label="Select Nurse"
                      value={nurses.find(n => n._id === values.nurse)?.firstName || ''}
                      onFocus={() => setFieldValue('showNurseMenu', true)}
                      error={touched.nurse && !!errors.nurse}
                    />
                  }
                >
                  {nurses.map((nurse) => (
                    <Menu.Item
                      key={nurse._id}
                      onPress={() => {
                        setFieldValue('nurse', nurse._id);
                        setFieldValue('showNurseMenu', false);
                      }}
                      title={`${nurse.firstName} ${nurse.lastName}`}
                    />
                  ))}
                </Menu>
                <HelperText type="error" visible={touched.nurse && !!errors.nurse}>
                  {errors.nurse}
                </HelperText>

                {/* Priority Selection Menu */}
                <Menu
                  visible={showPriorityMenu}
                  onDismiss={() => setShowPriorityMenu(false)}
                  anchor={
                    <TextInput
                      mode="outlined"
                      label="Priority"
                      value={values.priority}
                      onFocus={() => setShowPriorityMenu(true)}
                      error={touched.priority && !!errors.priority}
                    />
                  }
                >
                  {['low', 'medium', 'high'].map((priority) => (
                    <Menu.Item
                      key={priority}
                      onPress={() => {
                        setFieldValue('priority', priority);
                        setShowPriorityMenu(false);
                      }}
                      title={priority.charAt(0).toUpperCase() + priority.slice(1)}
                    />
                  ))}
                </Menu>
                <HelperText type="error" visible={touched.priority && !!errors.priority}>
                  {errors.priority}
                </HelperText>

                {/* Department Selection Menu */}
                <Menu
                  visible={values.showDepartmentMenu}
                  onDismiss={() => setFieldValue('showDepartmentMenu', false)}
                  anchor={
                    <TextInput
                      mode="outlined"
                      label="Select Department"
                      value={departments.find(d => d.id === values.department)?.name || ''}
                      onFocus={() => setFieldValue('showDepartmentMenu', true)}
                      error={touched.department && !!errors.department}
                    />
                  }
                >
                  {departments.map((department) => (
                    <Menu.Item
                      key={department.id}
                      onPress={() => {
                        setFieldValue('department', department.id);
                        setFieldValue('showDepartmentMenu', false);
                      }}
                      title={department.name}
                    />
                  ))}
                </Menu>
                <HelperText type="error" visible={touched.department && !!errors.department}>
                  {errors.department}
                </HelperText>

                {/* Description Input Field */}
                <TextInput
                  mode="outlined"
                  label="Description"
                  value={values.description}
                  onChangeText={handleChange('description')}
                  multiline
                  numberOfLines={4}
                  error={touched.description && !!errors.description}
                />
                <HelperText type="error" visible={touched.description && !!errors.description}>
                  {errors.description}
                </HelperText>

                {/* Submit Button */}
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  loading={loading}
                  style={styles.submitButton}
                >
                  Create Request
                </Button>
              </View>
            )}
          </Formik>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

// Styles for component layout and appearance
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  divider: {
    marginVertical: 16,
  },
  submitButton: {
    marginTop: 24,
  },
});
