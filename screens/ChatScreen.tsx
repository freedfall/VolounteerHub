// ChatScreen.tsx
import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { View, Image, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Alert, RefreshControl, Animated } from 'react-native';
import { useIsFocused, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import { fetchSentMessages, fetchReceivedMessages, sendMessageApi, markMessageAsReadApi } from '../utils/api';
import SendIcon from '../images/icons/sendIcon.png';
import userIcon from '../images/userProfileIcon.jpg';

const ChatScreen: React.FC = () => {
  const isFocused = useIsFocused();
  const { user } = useContext(AuthContext);
  const route = useRoute<any>();
  const { recipientId, recipientName, recipientAvatar } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const sendButtonOpacity = useRef(new Animated.Value(0)).current;
  const sendButtonScale = useRef(new Animated.Value(0.8)).current;

  const avatarSource = recipientAvatar ? { uri: recipientAvatar } : userIcon;

  useEffect(() => {
      if (newMessage.trim().length > 0) {
        Animated.parallel([
          Animated.timing(sendButtonOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.spring(sendButtonScale, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        Animated.parallel([
          Animated.timing(sendButtonOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(sendButtonScale, {
            toValue: 0.8,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }, [newMessage, sendButtonOpacity, sendButtonScale]);

  const fetchMessages = useCallback(async () => {
    try {
      const [dataSent, dataReceived] = await Promise.all([
        fetchSentMessages(user.id, recipientId),
        fetchReceivedMessages(user.id, recipientId),
      ]);

      console.log("DATA SENT:", dataSent);
      console.log("DATA RECEIVED:", dataReceived);

      const allMessages = [...dataSent, ...dataReceived];
      const sorted = allMessages.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
      setMessages(sorted);

      const unreadMessages = allMessages.filter(message =>
        message.recipientId === user.id && !message.isRead
      );

      if (unreadMessages.length > 0) {
        await Promise.all(
          unreadMessages.map(message => markMessageAsReadApi(message.id))
        );

        setMessages(prevMessages =>
          prevMessages.map(msg =>
            (msg.recipientId === user.id && !msg.isRead) ? { ...msg, isRead: true } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      Alert.alert('Error', 'Failed to load messages.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user.id, recipientId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await sendMessageApi(user.id, recipientId, newMessage);
      setMessages(prev => [
        ...prev,
        {
          senderId: user.id,
          recipientId: recipientId,
          content: newMessage.trim(),
          sentAt: new Date().toISOString(),
          isRead: false,
          id: Math.random(),
        }
      ]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message.');
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      fetchMessages();
    }
  }, [isFocused, fetchMessages]);

  const renderMessage = ({ item }) => {
    const isMine = item.senderId === user.id;
    return (
      <View style={[styles.messageContainer, isMine ? styles.myMessage : styles.theirMessage]}>
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.messageTime}>{new Date(item.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        {isMine && !item.isRead && <View style={styles.unreadIndicator} />}
      </View>
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
      <View style={styles.headerContainer}>
        <Image source={avatarSource} style={styles.headerAvatar} />
        <Text style={styles.headerName}>{recipientName}</Text>
      </View>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={styles.messagesContainer}
        inverted={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
        />
        {newMessage.trim().length > 0 && (
          <Animated.View style={{ opacity: sendButtonOpacity, transform: [{ scale: sendButtonScale }] }}>
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Image source={SendIcon} style={{ width: 25, height: 24 }} />
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      flex:1,
      backgroundColor:'#fff'
  },
  headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      backgroundColor: '#F9F9F9',
      borderBottomWidth: 1,
      borderColor: '#ccc'
    },
    headerAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10
    },
    headerName: {
      fontSize: 18,
      fontWeight: '600',
      color: '#000000'
    },
  loaderContainer: {
      flex:1, justifyContent:'center',
      alignItems:'center'
      },
  messagesContainer: {
      padding: 15,
      borderRadius: 15,
  },
  messageContainer: {
      marginVertical:5, maxWidth:'80%',
      padding:10,
      borderRadius:10 },
  myMessage: {
      alignSelf:'flex-end',
      backgroundColor:'#D9D9D9',
  },
  theirMessage: {
      alignSelf:'flex-start',
      backgroundColor:'#9CD0AA'
  },
  messageText: {
      fontSize:16,
      color: '#000'
  },
  messageTime: {
      fontSize:12,
      color:'#999',
      marginTop:5,
      textAlign:'left',
      },
  inputContainer: {
      flexDirection:'row',
      padding:10,
      borderTopWidth:1,
      borderColor:'#ccc',
      backgroundColor:'#fff'
      },
  textInput: {
      flex:1,
      borderWidth:1,
      borderColor:'#ccc',
      borderRadius:20,
      paddingHorizontal:15
      },
  sendButton: {
      backgroundColor:'#fff',
      justifyContent:'center',
      alignItems:'center',
      padding:10,
      borderRadius:20,
      marginLeft:10,
      borderWidth: 1,
      borderColor: '#00ff15'
      },
unreadIndicator: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 7,
      height: 7,
      borderRadius: 5,
      backgroundColor: '#013B14',
  },
});

export default ChatScreen;
