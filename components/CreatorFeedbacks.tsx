// components/CreatorFeedbacks.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { fetchFeedbacksForCreator } from '../utils/api';
import FeedbackCard from './FeedbackCard';
import FeedbackModal from './FeedbackModal';

interface CreatorFeedbacksProps {
  creatorId: string;
  onUpdateFeedback?: () => void;
}

const CreatorFeedbacks: React.FC<CreatorFeedbacksProps> = ({ creatorId, onUpdateFeedback }) => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);

  const loadFeedbacks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchFeedbacksForCreator(creatorId);
      setFeedbacks(data || []);
    } catch (err) {
      console.error('Error loading creator feedbacks', err);
      setError('Unable to load feedbacks.');
    } finally {
      setLoading(false);
    }
  }, [creatorId]);

  useEffect(() => {
    loadFeedbacks();
  }, [loadFeedbacks]);

  const renderItem = ({ item }: { item: any }) => (
    <FeedbackCard key={item.id} feedback={item} onFeedbackUpdated={loadFeedbacks, onUpdateFeedback} />
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
        <Text style={styles.messageText}>There are no feedbacks about this user</Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      <Text style={styles.title}>User feedbacks</Text>
      <FlatList
        data={feedbacks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.feedbackList}
      />
      <View style={styles.container}>
        <FeedbackModal
          visible={feedbackModalVisible}
          onClose={() => setFeedbackModalVisible(false)}
          creatorId={creatorId}
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
    height: 50,
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
    marginBottom: 10,
  },
  feedbackList: {
    paddingBottom: 20,
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

export default CreatorFeedbacks;
