// components/FeedbackModal.tsx

import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator, Image } from 'react-native';
import { createFeedback } from '../utils/api';
import filledStar from '../images/icons/filledStar.png';
import emptyStar from '../images/icons/emptyStar.png';

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
  eventId: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ visible, onClose, eventId }) => {
  const [rating, setRating] = useState<number>(0);
  const [text, setText] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (rating < 0 || rating > 5) {
      Alert.alert('Wrong rating', 'Please select a rating from 1 to 5.');
      return;
    }
    if (text.length > 150) {
      Alert.alert('Wrong feedback', 'Feedback should be less than 150 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await createFeedback(eventId, text, rating);
      Alert.alert('Great!', 'Thanks for your feedback!');
      onClose();
      setRating(0);
      setText('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send feedback. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    let stars = [];
    for(let i = 0; i < 5; i++){
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i + 1)}>
          <Image
            source={i < rating ? filledStar : emptyStar}
            style={{ width: 40, height: 40 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )
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
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>×</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Your feedback</Text>
          <View style={styles.starsContainer}>
            {renderStars()}
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="Write your thoughts here"
            value={text}
            onChangeText={setText}
            maxLength={150}
            multiline
          />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.sendButton} onPress={handleSubmit} disabled={submitting}>
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send</Text>
              )}
            </TouchableOpacity>

          </View>
        </View>
      </View>
      </TouchableOpacity>
    </Modal>
  );
};


const styles = StyleSheet.create({
  modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
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
  textInput: {
    height: 100,
    borderColor: '#013B14',
    borderWidth:1,
    borderRadius:30,
    padding:10,
    paddingHorizontal:20,
    textAlignVertical: 'top',
    marginBottom:15,
    color: '#000',
  },
  buttonsContainer: {
    flexDirection:'row',
    justifyContent:'space-around',
  },
  sendButton: {
    width: '50%',
    backgroundColor: '#69B67E',
    paddingVertical:10,
    paddingHorizontal:20,
    borderRadius:40,
    alignItems: 'center',
  },
  cancelButton: {
    position: 'absolute',
    top: 0,
    right: 20,
    color: '#000',
    alignItems: 'center',
  },
  cancelButtonText: {
    color:'black',
    fontSize:30,
    textAlign:'center',
  },
  buttonText: {
    color:'#fff',
    fontSize:16,
    textAlign:'center',
  },
});

export default FeedbackModal;
