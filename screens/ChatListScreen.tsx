// ChatListScreen.tsx
import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, ActivityIndicator, Alert, RefreshControl, } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import userIcon from '../images/userProfileIcon.jpg';
import { fetchMessageWriters, fetchSentMessages, fetchReceivedMessages } from '../utils/api';

interface Message {
  id: number;
  senderId: number;
  recipientId: number;
  content: string;
  sentAt: string;
  isRead: boolean;
}

interface UserInfo {
  id: number;
  name: string;
  surname: string;
  email: string;
  points: number;
  pointsAsCreator: number;
  imageURL: string;
  role: string;
}

interface ChatItem {
  userInfo: UserInfo;
  hasUnread: boolean;
  lastMessageSenderId: number | null;
}

const ChatListScreen: React.FC = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchChats = useCallback(async () => {
    try {
      const users = await fetchMessageWriters();
      console.log('Fetched Users:', users);

      // Fetch all sent and received messages for each user
      const allMessagesSent = [];
      const allMessagesReceived = [];

      const messagesPromises = users.map(async (userInfo) => {
        const sentMessages = await fetchSentMessages(user.id, userInfo.id);
        const receivedMessages = await fetchReceivedMessages(user.id, userInfo.id);
        allMessagesSent.push(...sentMessages);
        allMessagesReceived.push(...receivedMessages);
      });

      await Promise.all(messagesPromises);

      const allMessages = [...allMessagesSent, ...allMessagesReceived];

      // Group messages by user
      const chatMap = {};

      users.forEach((userInfo) => {
        chatMap[userInfo.id] = { messages: [], userInfo };
      });

      allMessages.forEach((msg) => {
        const otherUserId = msg.senderId === user.id ? msg.recipientId : msg.senderId;
        if (chatMap[otherUserId]) {
          chatMap[otherUserId].messages.push(msg);
        }
      });

      // Create chat items with necessary data
      const chatItems = Object.values(chatMap).map(({ messages, userInfo }) => {
        // Determine if there are unread messages
        const hasUnread = messages.some(
          (msg) => msg.senderId === userInfo.id && !msg.isRead
        );

        // Determine the sender of the last message
        const sortedMessages = messages.sort(
          (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
        );
        const lastMessage = sortedMessages[0];
        const lastMessageSenderId = lastMessage
          ? lastMessage.senderId
          : null;

        return {
          userInfo,
          hasUnread,
          lastMessageSenderId,
        };
      });

      setChats(chatItems);
    } catch (error) {
      console.error('Error fetching chats:', error);
      Alert.alert('Error', 'Failed to load chats.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user.id]);

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      fetchChats();
    }
  }, [isFocused, fetchChats]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchChats();
  }, [fetchChats]);

  const renderChat = ({ item }: { item: ChatItem }) => {
    let statusText = '';
    let chatBackground = '#FFF';

    if (item.hasUnread) {
      statusText = 'New message!';
      chatBackground = '#eee';
    } else {
      if (item.lastMessageSenderId === user.id) {
        statusText = 'Sent';
      } else if (item.lastMessageSenderId !== null) {
        statusText = 'Seen';
      }
    }

    return (
      <TouchableOpacity
        style={[styles.chatItem, { backgroundColor: chatBackground }]}
        onPress={() =>
          navigation.navigate('ChatScreen', {
            recipientId: item.userInfo.id,
            recipientName: `${item.userInfo.name} ${item.userInfo.surname}`,
          })
        }
      >
        <Image
          source={item.userInfo.imageURL ? { uri: item.userInfo.imageURL } : userIcon}
          style={styles.avatar}
        />
        <View style={styles.chatInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.chatName}>
              {item.userInfo.name} {item.userInfo.surname}
            </Text>
            {item.hasUnread && <View style={styles.unreadIndicator} />}
          </View>
          <Text style={styles.statusText}>{statusText}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#006400" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {chats.length > 0 ? (
        <FlatList
          data={chats}
          renderItem={renderChat}
          keyExtractor={(item) => item.userInfo.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No chats found.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF6347',
    marginLeft: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
  },
});

export default ChatListScreen;
