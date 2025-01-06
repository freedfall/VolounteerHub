// components/FeedbackCard.tsx

import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Alert } from 'react-native';
import filledStar from '../images/icons/filledStar.png';
import emptyStar from '../images/icons/emptyStar.png';
import EditFeedbackModal from './EditFeedbackModal';
import { AuthContext } from '../context/AuthContext';

interface FeedbackCardProps {
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

const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback, onFeedbackUpdated }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useContext(AuthContext);
  const handleEdit = () => {
      if (user.id === feedback.creator.id){
        setModalVisible(true);
      }
  };

  return (
    <>
      <TouchableOpacity style={styles.cardContainer} onPress={() => handleEdit()}>
        <View style={styles.header}>
          <Image
            source={feedback.creator.imageURL ? { uri: feedback.creator.imageURL } : require('../images/userProfileIcon.jpg')}
            style={styles.avatar}
          />
          <Text style={styles.creatorName}>{`${feedback.creator.name} ${feedback.creator.surname}`}</Text>
        </View>
        <View style={styles.ratingContainer}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Image
              key={index}
              source={index < feedback.rating ? filledStar : emptyStar}
              style={styles.star}
            />
          ))}
        </View>
        <Text style={styles.feedbackText}>{feedback.text}</Text>
      </TouchableOpacity>

      {modalVisible && (
        <EditFeedbackModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          feedback={feedback}
          onFeedbackUpdated={onFeedbackUpdated}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 5,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  creatorName: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    color: '#333',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  star: {
    width: 20,
    height: 20,
    marginRight: 2,
  },
  feedbackText: {
    fontSize: 16,
    color: '#555',
  },
});

export default FeedbackCard;
