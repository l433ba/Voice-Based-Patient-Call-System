import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Surface,
  IconButton,
  useTheme,
  Searchbar,
  Chip,
  Modal,
  Button,
  List,
  Divider,
  SegmentedButtons,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';

interface MedicalRecord {
  id: string;
  date: string;
  type: 'diagnosis' | 'procedure' | 'test' | 'vaccination';
  title: string;
  description: string;
  doctor: string;
  department: string;
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
  notes?: string;
  followUp?: {
    date: string;
    instructions: string;
  };
  results?: {
    key: string;
    value: string;
    unit?: string;
    normalRange?: string;
  }[];
}

export const MedicalRecordsScreen: React.FC = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  const theme = useTheme();

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    // Mock data - replace with actual API call
    const mockRecords: MedicalRecord[] = [
      {
        id: '1',
        date: '2024-03-15',
        type: 'diagnosis',
        title: 'Acute Bronchitis',
        description: 'Patient presented with persistent cough and fever...',
        doctor: 'Dr. Sarah Johnson',
        department: 'Pulmonology',
        notes: 'Prescribed antibiotics and recommended rest',
        followUp: {
          date: '2024-03-22',
          instructions: 'Return if symptoms persist',
        },
        attachments: [
          {
            id: 'a1',
            name: 'Chest X-Ray',
            type: 'image/jpeg',
            url: 'https://example.com/xray.jpg',
          },
        ],
        results: [
          {
            key: 'Temperature',
            value: '38.5',
            unit: '°C',
            normalRange: '36.5-37.5',
          },
          {
            key: 'WBC Count',
            value: '11.5',
            unit: 'K/µL',
            normalRange: '4.5-11.0',
          },
        ],
      },
      // Add more mock records...
    ];
    setRecords(mockRecords);
    setFilteredRecords(mockRecords);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterRecords(query, selectedType, timeRange);
  };

  const filterRecords = (query: string, type: string, range: string) => {
    let filtered = records.filter(record => {
      const matchesSearch = (
        record.title.toLowerCase() +
        record.description.toLowerCase() +
        record.doctor.toLowerCase()
      ).includes(query.toLowerCase());

      const matchesType = type === 'all' || record.type === type;

      const recordDate = new Date(record.date);
      const now = new Date();
      let matchesTimeRange = true;

      switch (range) {
        case '3months':
          matchesTimeRange = recordDate >= new Date(now.setMonth(now.getMonth() - 3));
          break;
        case '6months':
          matchesTimeRange = recordDate >= new Date(now.setMonth(now.getMonth() - 6));
          break;
        case '1year':
          matchesTimeRange = recordDate >= new Date(now.setFullYear(now.getFullYear() - 1));
          break;
      }

      return matchesSearch && matchesType && matchesTimeRange;
    });

    setFilteredRecords(filtered);
  };

  const getRecordIcon = (type: MedicalRecord['type']) => {
    switch (type) {
      case 'diagnosis':
        return 'stethoscope';
      case 'procedure':
        return 'medical-bag';
      case 'test':
        return 'test-tube';
      case 'vaccination':
        return 'needle';
      default:
        return 'file-document';
    }
  };

  const renderRecord = (record: MedicalRecord) => (
    <View key={record.id}>
      <Surface style={styles.recordCard}>
        <TouchableOpacity
          onPress={() => {
            setSelectedRecord(record);
            setModalVisible(true);
          }}
        >
          <View style={styles.cardHeader}>
            <View style={styles.headerLeft}>
              <Icon
                name={getRecordIcon(record.type)}
                size={24}
                color={theme.colors.primary}
              />
              <View style={styles.recordInfo}>
                <Text style={styles.recordTitle}>{record.title}</Text>
                <Text style={styles.recordDate}>
                  {format(new Date(record.date), 'MMM dd, yyyy')}
                </Text>
              </View>
            </View>
            <Chip mode="outlined">
              {record.type}
            </Chip>
          </View>

          <View style={styles.cardContent}>
            <Text numberOfLines={2} style={styles.description}>
              {record.description}
            </Text>
            <View style={styles.doctorInfo}>
              <Icon name="doctor" size={16} color="#666" />
              <Text style={styles.doctorText}>{record.doctor}</Text>
              <Text style={styles.departmentText}>• {record.department}</Text>
            </View>
          </View>

          {record.attachments && record.attachments.length > 0 && (
            <View style={styles.attachments}>
              <Icon name="paperclip" size={16} color="#666" />
              <Text style={styles.attachmentsText}>
                {record.attachments.length} attachment{record.attachments.length !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </Surface>
    </View>
  );

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
            <Text style={styles.headerTitle}>Medical Records</Text>
            <IconButton
              icon="download"
              iconColor="#fff"
              size={24}
              onPress={() => {/* Handle download all */}}
              style={styles.headerButton}
            />
          </View>
          <Searchbar
            placeholder="Search records..."
            onChangeText={handleSearch}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={styles.searchInput}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtersContainer}
          >
            <SegmentedButtons
              value={selectedType}
              onValueChange={value => {
                setSelectedType(value);
                filterRecords(searchQuery, value, timeRange);
              }}
              buttons={[
                { value: 'all', label: 'All' },
                { value: 'diagnosis', label: 'Diagnoses' },
                { value: 'procedure', label: 'Procedures' },
                { value: 'test', label: 'Tests' },
                { value: 'vaccination', label: 'Vaccinations' },
              ]}
              style={styles.segmentedButtons}
            />
          </ScrollView>
          <View style={styles.timeRangeContainer}>
            <Button
              mode={timeRange === 'all' ? 'contained' : 'outlined'}
              onPress={() => {
                setTimeRange('all');
                filterRecords(searchQuery, selectedType, 'all');
              }}
              style={styles.timeRangeButton}
            >
              All Time
            </Button>
            <Button
              mode={timeRange === '3months' ? 'contained' : 'outlined'}
              onPress={() => {
                setTimeRange('3months');
                filterRecords(searchQuery, selectedType, '3months');
              }}
              style={styles.timeRangeButton}
            >
              3 Months
            </Button>
            <Button
              mode={timeRange === '6months' ? 'contained' : 'outlined'}
              onPress={() => {
                setTimeRange('6months');
                filterRecords(searchQuery, selectedType, '6months');
              }}
              style={styles.timeRangeButton}
            >
              6 Months
            </Button>
            <Button
              mode={timeRange === '1year' ? 'contained' : 'outlined'}
              onPress={() => {
                setTimeRange('1year');
                filterRecords(searchQuery, selectedType, '1year');
              }}
              style={styles.timeRangeButton}
            >
              1 Year
            </Button>
          </View>
        </BlurView>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {filteredRecords.map(renderRecord)}
      </ScrollView>

      <Modal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        contentContainerStyle={styles.modalContent}
      >
        {selectedRecord && (
          <ScrollView>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedRecord.title}</Text>
              <IconButton
                icon="close"
                size={24}
                onPress={() => setModalVisible(false)}
              />
            </View>

            <View style={styles.modalBody}>
              <Surface style={styles.detailsCard}>
                <List.Section>
                  <List.Item
                    title="Date"
                    description={format(new Date(selectedRecord.date), 'MMMM dd, yyyy')}
                    left={props => <List.Icon {...props} icon="calendar" />}
                  />
                  <List.Item
                    title="Doctor"
                    description={selectedRecord.doctor}
                    left={props => <List.Icon {...props} icon="doctor" />}
                  />
                  <List.Item
                    title="Department"
                    description={selectedRecord.department}
                    left={props => <List.Icon {...props} icon="hospital-building" />}
                  />
                </List.Section>

                <Divider style={styles.divider} />

                <View style={styles.descriptionSection}>
                  <Text style={styles.sectionTitle}>Description</Text>
                  <Text style={styles.descriptionText}>
                    {selectedRecord.description}
                  </Text>
                </View>

                {selectedRecord.results && selectedRecord.results.length > 0 && (
                  <>
                    <Divider style={styles.divider} />
                    <View style={styles.resultsSection}>
                      <Text style={styles.sectionTitle}>Results</Text>
                      {selectedRecord.results.map((result, index) => (
                        <View key={index} style={styles.resultItem}>
                          <Text style={styles.resultKey}>{result.key}</Text>
                          <View style={styles.resultValue}>
                            <Text style={styles.valueText}>
                              {result.value} {result.unit}
                            </Text>
                            {result.normalRange && (
                              <Text style={styles.normalRange}>
                                Normal: {result.normalRange}
                              </Text>
                            )}
                          </View>
                        </View>
                      ))}
                    </View>
                  </>
                )}

                {selectedRecord.followUp && (
                  <>
                    <Divider style={styles.divider} />
                    <View style={styles.followUpSection}>
                      <Text style={styles.sectionTitle}>Follow-up</Text>
                      <Surface style={styles.followUpCard}>
                        <View style={styles.followUpHeader}>
                          <Icon name="calendar-clock" size={20} color={theme.colors.primary} />
                          <Text style={styles.followUpDate}>
                            {format(new Date(selectedRecord.followUp.date), 'MMMM dd, yyyy')}
                          </Text>
                        </View>
                        <Text style={styles.followUpInstructions}>
                          {selectedRecord.followUp.instructions}
                        </Text>
                      </Surface>
                    </View>
                  </>
                )}

                {selectedRecord.attachments && selectedRecord.attachments.length > 0 && (
                  <>
                    <Divider style={styles.divider} />
                    <View style={styles.attachmentsSection}>
                      <Text style={styles.sectionTitle}>Attachments</Text>
                      {selectedRecord.attachments.map((attachment, index) => (
                        <Surface key={index} style={styles.attachmentItem}>
                          <View style={styles.attachmentInfo}>
                            <Icon
                              name={attachment.type.includes('image') ? 'image' : 'file-document'}
                              size={24}
                              color={theme.colors.primary}
                            />
                            <Text style={styles.attachmentName}>{attachment.name}</Text>
                          </View>
                          <IconButton
                            icon="download"
                            size={20}
                            onPress={() => {/* Handle download */}}
                          />
                        </Surface>
                      ))}
                    </View>
                  </>
                )}
              </Surface>

              <View style={styles.modalActions}>
                <Button
                  mode="contained"
                  onPress={() => {/* Handle share */}}
                  style={styles.actionButton}
                  icon="share-variant"
                >
                  Share Record
                </Button>
                <Button
                  mode="contained"
                  onPress={() => {/* Handle download */}}
                  style={styles.actionButton}
                  icon="download"
                >
                  Download
                </Button>
              </View>
            </View>
          </ScrollView>
        )}
      </Modal>
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
    paddingBottom: 7,
  },
  headerBlur: {
    padding: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  searchBar: {
    marginBottom: 12,
    elevation: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  searchInput: {
    fontSize: 16,
  },
  filtersContainer: {
    marginBottom: 12,
  },
  segmentedButtons: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  timeRangeButton: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  recordCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recordInfo: {
    flex: 1,
  },
  recordTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recordDate: {
    fontSize: 14,
    color: '#666',
  },
  cardContent: {
    padding: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 12,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  doctorText: {
    fontSize: 14,
    color: '#666',
  },
  departmentText: {
    fontSize: 14,
    color: '#666',
  },
  attachments: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  attachmentsText: {
    fontSize: 14,
    color: '#666',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 20,
  },
  detailsCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  descriptionSection: {
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  resultsSection: {
    marginBottom: 16,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultKey: {
    fontSize: 16,
    color: '#333',
  },
  resultValue: {
    alignItems: 'flex-end',
  },
  valueText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  normalRange: {
    fontSize: 12,
    color: '#666',
  },
  followUpSection: {
    marginBottom: 16,
  },
  followUpCard: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
  },
  followUpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  followUpDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  followUpInstructions: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  attachmentsSection: {
    marginBottom: 16,
  },
  attachmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  attachmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  attachmentName: {
    fontSize: 16,
    color: '#333',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  actionButton: {
    flex: 1,
  },
}); 