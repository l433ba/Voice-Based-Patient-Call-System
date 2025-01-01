import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Card, Title, Paragraph, Chip, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/contexts/AuthContext';

interface Shift {
  id: string;
  date: string;
  shiftType: 'morning' | 'afternoon' | 'night';
  startTime: string;
  endTime: string;
  assignedPatients: number;
  department: string;
}

export const ScheduleScreen = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    generateWeekDates();
    fetchShifts();
  }, []);

  const generateWeekDates = () => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const dates = Array.from({ length: 7 }, (_, i) => addDays(start, i));
    setWeekDates(dates);
  };

  const fetchShifts = async () => {
    try {
      setShifts([
        {
          id: '1',
          date: new Date().toISOString(),
          shiftType: 'morning',
          startTime: '07:00',
          endTime: '15:00',
          assignedPatients: 5,
          department: 'General Ward'
        },
        {
          id: '2',
          date: new Date().toISOString(),
          shiftType: 'night',
          startTime: '23:00',
          endTime: '07:00',
          assignedPatients: 3,
          department: 'ICU'
        }
      ]);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch shifts',
      });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchShifts();
    setRefreshing(false);
  };

  const getShiftColor = (shiftType: Shift['shiftType']) => {
    switch (shiftType) {
      case 'morning':
        return ['#4CAF50', '#2E7D32'];
      case 'afternoon':
        return ['#FF9800', '#F57C00'];
      case 'night':
        return ['#2196F3', '#1976D2'];
      default:
        return ['#9E9E9E', '#757575'];
    }
  };

  const renderWeekView = () => (
    <View style={styles.weekContainer}>
      {weekDates.map((date, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.dateButton,
            isSameDay(date, selectedDate) && styles.selectedDate
          ]}
          onPress={() => setSelectedDate(date)}
        >
          <Text style={styles.dayText}>
            {format(date, 'EEE')}
          </Text>
          <Text style={[
            styles.dateText,
            isSameDay(date, selectedDate) && styles.selectedDateText
          ]}>
            {format(date, 'd')}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderShifts = () => (
    <View style={styles.shiftsContainer}>
      <Text style={styles.sectionTitle}>
        Shifts for {format(selectedDate, 'MMMM d, yyyy')}
      </Text>
      {shifts.map((shift) => (
        <Card key={shift.id} style={styles.shiftCard}>
          <LinearGradient
            colors={getShiftColor(shift.shiftType)}
            style={styles.shiftHeader}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Title style={styles.shiftTitle}>
              {shift.shiftType.charAt(0).toUpperCase() + shift.shiftType.slice(1)} Shift
            </Title>
            <Icon name="access-time" size={24} color="#fff" />
          </LinearGradient>
          <Card.Content>
            <View style={styles.shiftDetails}>
              <View style={styles.timeContainer}>
                <Text style={styles.timeLabel}>Time:</Text>
                <Text style={styles.timeText}>{shift.startTime} - {shift.endTime}</Text>
              </View>
              <View style={styles.departmentContainer}>
                <Text style={styles.departmentLabel}>Department:</Text>
                <Text style={styles.departmentText}>{shift.department}</Text>
              </View>
              <Chip icon="account-group" style={styles.patientChip}>
                {shift.assignedPatients} Patients Assigned
              </Chip>
            </View>
          </Card.Content>
        </Card>
      ))}
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {renderWeekView()}
      {renderShifts()}
      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#fff',
    elevation: 2,
  },
  dateButton: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
  },
  selectedDate: {
    backgroundColor: '#4c669f',
  },
  dayText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedDateText: {
    color: '#fff',
  },
  shiftsContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  shiftCard: {
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
  },
  shiftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  shiftTitle: {
    color: '#fff',
    marginBottom: 0,
  },
  shiftDetails: {
    marginTop: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
    width: 80,
  },
  timeText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  departmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  departmentLabel: {
    fontSize: 14,
    color: '#666',
    width: 80,
  },
  departmentText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  patientChip: {
    alignSelf: 'flex-start',
  },
});