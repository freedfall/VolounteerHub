// AdminUserModal.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert, ActivityIndicator, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userProfileIcon from '../images/userProfileIcon.jpg';
import { handleDateTime } from '../utils/dateUtils';

const BASE_URL = 'https://itu-215076752298.europe-central2.run.app/api';

type UserType = {
  id: number;
  name: string;
  surname: string;
  email: string;
  points: number;
  imageURL?: string;
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
}

const AdminUserModal: React.FC<AdminUserModalProps> = ({ visible, user, onClose, navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState<'createdEvents' | 'participationEvents'>('createdEvents');
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<EventType[]>([]);

  // Локальные стейты для редактирования данных пользователя
  const [userName, setUserName] = useState(user.name);
  const [userSurname, setUserSurname] = useState(user.surname);
  const [userEmail, setUserEmail] = useState(user.email);
  const [userPoints, setUserPoints] = useState(user.points.toString());
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    if (visible && user) {
      loadUserEvents();
    }
  }, [visible, user, selectedCategory]);

  const loadUserEvents = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      let url;
      if (selectedCategory === 'createdEvents') {
        url = `${BASE_URL}/event/my-as-creator`;
      } else {
        url = `${BASE_URL}/event/my-as-participant`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data || []);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const updatedData = {
        name: userName,
        surname: userSurname,
      };
      console.log('Updated Data:', updatedData);
      const response = await fetch(`${BASE_URL}/user/${user.id}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const respData = await response.json();
        console.log('Error response:', errorData);
        throw new Error(respData.message || 'Failed to update user data');
      }

      Alert.alert('Success', 'User data updated successfully');
      setIsEditing(false);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleEditClick = () => {
      setIsEditable(true);
    };

  const renderEvent = ({ item }: { item: EventType }) => (
    <TouchableOpacity style={styles.eventItem} onPress={() => navigation.navigate('EventDetails', { ...item })}>
      <Text style={styles.eventName}>{item.name}</Text>
      <Text style={styles.eventDetails}>{handleDateTime(item.startDateTime)}</Text>
      <Text style={styles.eventDetails}>{item.city}, {item.address}</Text>
      <Text style={styles.eventDetails}>Points: {item.price}</Text>
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

        {/* Редактирование данных пользователя */}
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


        {/* Edit Button */}
        {!isEditable && (
          <TouchableOpacity style={styles.editButton} onPress={handleEditClick}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        )}

        {/* Save Button */}
        {isEditable && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        )}

        {/* Переключение между созданными и посещёнными событиями */}
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
              selectedCategory === 'participationEvents' && styles.selectedModalSwitchButton,
            ]}
            onPress={() => setSelectedCategory('participationEvents')}
          >
            <Text style={styles.modalSwitchButtonText}>Participation Events</Text>
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
    noEventsText: {
      fontSize: 16,
      color: '#777',
      textAlign: 'center',
      marginTop: 20,
    },
  });

  export default AdminUserModal;
