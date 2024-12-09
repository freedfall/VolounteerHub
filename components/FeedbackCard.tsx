// components/FeedbackCard.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Alert } from 'react-native';
import filledStar from '../images/icons/filledStar.png';
import emptyStar from '../images/icons/emptyStar.png';
import EditFeedbackModal from './EditFeedbackModal';

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
  onFeedbackUpdated: () => void; // Callback для обновления списка отзывов
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback, onFeedbackUpdated }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleEdit = () => {
    setModalVisible(true);
  };

  const handleDelete = () => {
    Alert.alert(
      'Удалить отзыв',
      'Вы уверены, что хотите удалить этот отзыв?',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Удалить', style: 'destructive', onPress: confirmDelete },
      ]
    );
  };

  const confirmDelete = async () => {
    try {
      // Вызовите функцию удаления отзыва из utils/api
      const response = await deleteFeedback(feedback.id);
      if (response.ok) {
        Alert.alert('Успех', 'Отзыв успешно удален.');
        onFeedbackUpdated();
      } else {
        Alert.alert('Ошибка', 'Не удалось удалить отзыв.');
      }
    } catch (error) {
      console.error('Ошибка при удалении отзыва:', error);
      Alert.alert('Ошибка', 'Произошла ошибка при удалении отзыва.');
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.cardContainer} onPress={() => setModalVisible(true)}>
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
    marginVertical: 10,
    width: 380,
    alignSelf: 'center',
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
