import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert, ActivityIndicator, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userProfileIcon from '../images/userProfileIcon.jpg';
import { useNavigation } from '@react-navigation/native';
import { handleDateTime } from '../utils/dateUtils';
import { fetchAdminUserCreatedEvents, fetchUserAttendedEvents, adminUpdateUserDetails } from '../utils/api';

type UserType = {
  id: number;
  name: string;
  surname: string;
  points: number;
};

type EventType = {
  id: number;
  name: string;
  startDateTime: string;
  city: string;
  address: string;
  price: number;
  occupiedQuantity: number;
};

interface AdminUserModalProps {
  visible: boolean;
  user: UserType;
  onClose: () => void;
  navigation: any;
  onUpdateAdminData?: () => void;
}

const AdminUserModal: React.FC<AdminUserModalProps> = ({ visible, user, onClose, navigation, onUpdateAdminData }) => {
  const [selectedCategory, setSelectedCategory] = useState<'createdEvents' | 'attendedEvents'>('createdEvents');
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<EventType[]>([]);

  const [userName, setUserName] = useState(user.name);
  const [userSurname, setUserSurname] = useState(user.surname);
  const [userPoints, setUserPoints] = useState<number>(user.points);
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    if (visible && user) {
      loadUserEvents();
      setUserName(user.name);
      setUserSurname(user.surname);
      setUserPoints(user.points);
      setIsEditable(false);
    }
  }, [visible, user, selectedCategory]);

  const loadUserEvents = async () => {
    setLoading(true);
    try {
      let fetchedEvents = [];
      if (selectedCategory === 'createdEvents') {
        fetchedEvents = await fetchAdminUserCreatedEvents(user.id);
      } else {
        fetchedEvents = await fetchUserAttendedEvents(user.id);
      }
      setEvents(fetchedEvents || []);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const updatedData = {
        name: userName,
        surname: userSurname,
        points: userPoints
      };
      console.log('Updated Data:', updatedData);
      await adminUpdateUserDetails(user.id, updatedData);
      setIsEditable(false);
      onUpdateAdminData();
    } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to update user data');
    }
  };

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const renderEvent = ({ item }: { item: EventType }) => (
    <TouchableOpacity
        style={styles.eventItem}
        onPress={() => {
            onClose();
            navigation.navigate('EventDetails', { ...item });
            }}
        >
      <Text style={styles.eventName}>{item.name}</Text>
      <Text style={styles.eventDetails}>{handleDateTime(item.startDateTime)}</Text>
      <Text style={styles.eventDetails}>{item.city}, {item.address}</Text>
      <Text style={styles.eventDetails}>Points: {item.price}</Text>
      <Text style={styles.eventDetails}>Occupied: {item.occupiedQuantity}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={styles.modal}
      avoidKeyboard={true}
    >
      <View style={styles.modalContent}>
        <Image
          source={user?.imageURL ? { uri: user.imageURL } : userProfileIcon}
          style={styles.modalAvatar}
        />

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={userName}
          onChangeText={setUserName}
          editable={isEditable}
        />
        <TextInput
          style={styles.input}
          placeholder="Surname"
          value={userSurname}
          onChangeText={setUserSurname}
          editable={isEditable}
        />
        <TextInput
          style={styles.input}
          placeholder="Points"
          value={userPoints?.toString()}
          onChangeText={(text) => {
            const parsed = parseInt(text);
            if (!isNaN(parsed)) {
              setUserPoints(parsed);
            } else {
              Alert.alert('Invalid Input', 'Please enter a valid number for points.');
            }
          }}
          editable={isEditable}
          keyboardType="numeric"
        />

        {!isEditable && (
          <TouchableOpacity style={styles.editButton} onPress={handleEditClick}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        )}

        {isEditable && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        )}

        <View style={styles.modalSwitchContainer}>
          <TouchableOpacity
            style={[
              styles.modalSwitchButton,
              selectedCategory === 'createdEvents' && styles.selectedModalSwitchButton,
            ]}
            onPress={() => setSelectedCategory('createdEvents')}
          >
            <Text style={styles.modalSwitchButtonText}>Created Events</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modalSwitchButton,
              selectedCategory === 'attendedEvents' && styles.selectedModalSwitchButton,
            ]}
            onPress={() => setSelectedCategory('attendedEvents')}
          >
            <Text style={styles.modalSwitchButtonText}>Attended Events</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : events.length > 0 ? (
          <FlatList
            data={events}
            renderItem={renderEvent}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.eventList}
          />
        ) : (
          <Text style={styles.noEventsText}>No events found.</Text>
        )}

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    margin: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    maxHeight: '90%',
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  modalSwitchContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    marginTop: 20,
  },
  modalSwitchButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginHorizontal: 5,
  },
  selectedModalSwitchButton: {
    backgroundColor: '#007BFF',
  },
  modalSwitchButtonText: {
    color: '#fff',
  },
  eventList: {
    width: '100%',
  },
  eventItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  eventDetails: {
    fontSize: 14,
    color: '#555',
  },
  closeButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#6c757d',
    borderRadius: 4,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  noEventsText: {
    color: '#333',
    marginVertical: 10,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 16,
    color: '#333',
  },
  editButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    marginBottom: 15,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  saveButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#28a745',
    borderRadius: 5,
    marginBottom: 15,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AdminUserModal;
