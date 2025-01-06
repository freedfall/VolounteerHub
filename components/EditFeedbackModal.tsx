// File: EditFeedbackModal.tsx
// Author: john doe
// Description: Modal component for editing or deleting existing feedback. After successful update or deletion
// of the feedback, it reloads the events in the global event context.

import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator, Image } from 'react-native';
import { updateFeedback, deleteFeedback, fetchAllEvents } from '../utils/api';
import filledStar from '../images/icons/filledStar.png';
import emptyStar from '../images/icons/emptyStar.png';
import { useEventContext } from '../context/EventContext';

interface EditFeedbackModalProps {
  visible: boolean;
  onClose: () => void;
  feedback: {
    id: string;
    text: string;
    rating: number;
    creator: {
      id: string;
      name: string;
      surname: string;
      email: string;
      points: number;
      pointsAsCreator: number;
      imageURL: string;
      role: string;
    };
    eventId: number;
    target: {
      id: string;
      name: string;
      surname: string;
      email: string;
      points: number;
      pointsAsCreator: number;
      imageURL: string;
      role: string;
    };
    createdAt: string;
  };
  onFeedbackUpdated: () => void;
}

const EditFeedbackModal: React.FC<EditFeedbackModalProps> = ({ visible, onClose, feedback, onFeedbackUpdated }) => {
  const [rating, setRating] = useState<number>(feedback.rating);
  const [text, setText] = useState<string>(feedback.text);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  // Get the event context to update events after changes
  const { setEvents } = useEventContext();

  // Helper function to reload events
  const reloadEvents = async () => {
    try {
      const updatedData = await fetchAllEvents();
      if (updatedData) {
        setEvents(updatedData);
      }
    } catch (error) {
      console.error('Error reloading events:', error);
    }
  };

  const handleUpdate = async () => {
    if (rating < 1 || rating > 5) {
      Alert.alert('Wrong rating', 'Please, select a rating from 1 to 5.');
      return;
    }
    if (text.length > 150) {
      Alert.alert('Wrong feedback', 'Feedback should be less than 150 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await updateFeedback(feedback.id, feedback.eventId, text, rating);
      Alert.alert('Success', 'Feedback updated successfully.');
      onFeedbackUpdated();
      onClose();

      // Reload events after successful update
      await reloadEvents();
    } catch (error) {
      Alert.alert('Error', 'Failed to update feedback. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete feedback',
      'Are you sure you want to delete this feedback?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: confirmDelete },
      ]
    );
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteFeedback(feedback.id);
      Alert.alert('Success', 'Feedback has been deleted successfully.');
      onFeedbackUpdated();
      onClose();

      // Reload events after successful deletion
      await reloadEvents();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete feedback. Please try again later.');
    } finally {
      setDeleting(false);
    }
  };

  const renderStars = () => {
    let stars = [];
    for(let i = 0; i < 5; i++){
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i+1)}>
          <Image
            source={i < rating ? filledStar : emptyStar}
            style={styles.star}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity onPress={onClose} style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Edit feedback</Text>
          <View style={styles.starsContainer}>
            {renderStars()}
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="Share your thoughts"
            value={text}
            onChangeText={setText}
            maxLength={150}
            multiline
          />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdate} disabled={submitting}>
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Update</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} disabled={deleting}>
              {deleting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Delete</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};


const styles = StyleSheet.create({
  modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius:15,
    padding:20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 15,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#000',
  },
  modalTitle: {
    fontSize:20,
    fontWeight:'bold',
    marginBottom:15,
    textAlign:'center',
    color: '#000',
  },
  starsContainer: {
    flexDirection:'row',
    justifyContent:'center',
    marginBottom:15,
  },
  star: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  textInput: {
    height: 100,
    borderColor: '#013B14',
    borderWidth:1,
    borderRadius:15,
    padding:10,
    paddingHorizontal:20,
    textAlignVertical: 'top',
    marginBottom:15,
    color: '#000',
  },
  buttonsContainer: {
    flexDirection:'row',
    justifyContent:'space-between',
  },
  updateButton: {
    backgroundColor: '#69B67E',
    paddingVertical:10,
    paddingHorizontal:20,
    borderRadius:40,
    flex:1,
    marginRight:5,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF6A6A',
    paddingVertical:10,
    paddingHorizontal:20,
    borderRadius:40,
    flex:1,
    marginLeft:5,
    alignItems: 'center',
  },
  buttonText: {
    color:'#fff',
    fontSize:16,
    textAlign:'center',
  },
});

export default EditFeedbackModal;
