import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerUserForEvent, cancelUserRegistration } from '../utils/api';
import FeedbackModal from './FeedbackModal';

type EventRegistrationStatusProps = {
  eventId: string;
  isRegistered: boolean;
  isConfirmed: boolean;
  isPast: boolean;
  onStatusChange: (newStatus: boolean, confirmation: boolean) => void;
  onCreateFeedback: () => void;
};

const EventRegistrationStatus: React.FC<EventRegistrationStatusProps> = ({
  eventId,
  isRegistered,
  isConfirmed,
  onStatusChange,
  isPast,
  onCreateFeedback,
}) => {
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);

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

  const handleLeaveFeedback = () => {
    setFeedbackModalVisible(true);
  };
  if (isPast){
      return null;
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
    marginBottom: 20,
  },
  joinButton: {
    backgroundColor: '#69B67E',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF6A6A',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default EventRegistrationStatus;
