import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerUserForEvent, cancelUserRegistration } from '../utils/api';

type EventRegistrationStatusProps = {
  eventId: string;
  isRegistered: boolean;
  isConfirmed: boolean;
  onStatusChange: (newStatus: boolean, confirmation: boolean) => void;
};

const EventRegistrationStatus: React.FC<EventRegistrationStatusProps> = ({
  eventId,
  isRegistered,
  isConfirmed,
  onStatusChange,
}) => {
  const registerForEvent = async () => {
    try {
      const response = await registerUserForEvent(eventId);
      if (response.ok) {
        onStatusChange(true, false);
        Alert.alert('Success', 'Registration pending confirmation.');
      } else {
        Alert.alert('Error', 'Failed to register for the event.');
      }
    } catch (error) {
      console.error('Error registering for event:', error);
    }
  };

  const cancelRegistration = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const { id: userId } = JSON.parse(userData);

      const response = await cancelUserRegistration(eventId, userId);
      if (response.ok) {
        onStatusChange(false, false);
        Alert.alert('Success', 'You have successfully canceled your registration.');
      } else {
        Alert.alert('Error', 'Failed to cancel registration.');
      }
    } catch (error) {
      console.error('Error canceling registration:', error);
    }
  };

  return (
    <View style={styles.container}>
      {isRegistered ? (
        <TouchableOpacity style={styles.cancelButton} onPress={cancelRegistration}>
          <Text style={styles.cancelButtonText}>
            {isConfirmed ? 'Unregister (Confirmed)' : 'Cancel Registration'}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.joinButton} onPress={registerForEvent}>
          <Text style={styles.joinButtonText}>Join Event</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  joinButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default EventRegistrationStatus;
