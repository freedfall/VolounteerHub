// components/UserFeedbacks.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { fetchUserFeedbacksForEvent } from '../utils/api';
import FeedbackCard from './FeedbackCard';
import FeedbackModal from './FeedbackModal';

interface UserFeedbacksProps {
  eventId: number;
}

const UserFeedbacks: React.FC<UserFeedbacksProps> = ({ eventId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);

  const loadFeedbacks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchUserFeedbacksForEvent(eventId);
      setFeedbacks(data || []);
    } catch (err) {
      console.error('Error loading feedbacks', err);
      setError('Unable to load feedbacks.');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    loadFeedbacks();
  }, [loadFeedbacks]);

  const handleLeaveFeedback = () => {
      setFeedbackModalVisible(true);
  };

  const renderItem = ({ item }: { item: any }) => (
    <FeedbackCard feedback={item} onFeedbackUpdated={loadFeedbacks} />
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#69B67E" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{error}</Text>
      </View>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>Add your feedback to see it here!</Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>

    <Text style={styles.title}>Your feedbacks</Text>
      {feedbacks.map((feedback: any) => (
        <FeedbackCard key={feedback.id} feedback={feedback} onFeedbackUpdated={loadFeedbacks} />
      ))}
      <View style={styles.container}>
        <TouchableOpacity style={styles.joinButton} onPress={handleLeaveFeedback}>
            <Text style={styles.joinButtonText}>Leave Feedback</Text>
        </TouchableOpacity>
        <FeedbackModal
            visible={feedbackModalVisible}
            onClose={() => setFeedbackModalVisible(false)}
            eventId={eventId}
            onCreateFeedback={loadFeedbacks}
          />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  container: {
      marginTop: 20,
      marginBottom: 20,
    },
  messageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  messageText: {
    fontSize: 16,
    color: '#555',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
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
});

export default UserFeedbacks;
