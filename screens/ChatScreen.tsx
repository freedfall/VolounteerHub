// ChatScreen.tsx

import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useIsFocused, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';

const BASE_URL = 'https://itu-215076752298.europe-central2.run.app/api';

const ChatScreen: React.FC = () => {
  const isFocused = useIsFocused();
  const { user } = useContext(AuthContext);
  const route = useRoute<any>();
  const { recipientId, recipientName } = route.params; // ID и имя получателя
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const [responseSent, responseReceived] = await Promise.all([
        fetch(`${BASE_URL}/message/${user.id}/${recipientId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch(`${BASE_URL}/message/${recipientId}/${user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
      ]);

      if (!responseSent.ok || !responseReceived.ok) {
        throw new Error('Failed to fetch messages');
      }

      const [dataSent, dataReceived] = await Promise.all([responseSent.json(), responseReceived.json()]);
      console.log("DATA SENT:", dataSent);
      console.log("DATA RECEIVED:", dataReceived);

      // Объединяем сообщения и сортируем по времени отправки
      const allMessages = [...dataSent, ...dataReceived];
      const sorted = allMessages.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
      setMessages(sorted);
    } catch (error) {
      console.error('Error fetching messages:', error);
      Alert.alert('Error', 'Failed to load messages.');
    } finally {
      setLoading(false);
    }
  }, [user.id, recipientId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${BASE_URL}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          senderId: user.id,
          recipientId: recipientId,
          content: newMessage.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setNewMessage('');
      // Оптимистичное добавление сообщения
      setMessages(prev => [
        ...prev,
        {
          senderId: user.id,
          recipientId: recipientId,
          content: newMessage.trim(),
          sentAt: new Date().toISOString(),
          isRead: false,
          id: Math.random() // Временный id
        }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message.');
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchMessages();
    }
  }, [isFocused, fetchMessages]);

  const renderMessage = ({ item }) => {
    const isMine = item.senderId === user.id;
    return (
      <View style={[styles.messageContainer, isMine ? styles.myMessage : styles.theirMessage]}>
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.messageTime}>{new Date(item.sentAt).toLocaleTimeString()}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#006400" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={styles.messagesContainer}
        inverted={false}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={{ color: '#fff' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      flex:1,
      backgroundColor:'#fff'
  },
  loaderContainer: {
      flex:1, justifyContent:'center',
      alignItems:'center'
      },
  messagesContainer: {
      padding: 10
      },
  messageContainer: {
      marginVertical:5, maxWidth:'80%',
      padding:10,
      borderRadius:10 },
  myMessage: {
      alignSelf:'flex-end',
  backgroundColor:'#DCF8C6'
  },
  theirMessage: {
      alignSelf:'flex-start',
  backgroundColor:'#eee'
  },
  messageText: {
      fontSize:16
      },
  messageTime: {
      fontSize:12,
      color:'#999',
      marginTop:5,
      textAlign:'right'
      },
  inputContainer: {
      flexDirection:'row',
      padding:10,
      borderTopWidth:1,
      borderColor:'#ccc',
      backgroundColor:'#fff'
      },
  textInput: {
      flex:1, borderWidth:1,
      borderColor:'#ccc',
      borderRadius:20,
      paddingHorizontal:15
      },
  sendButton: {
      backgroundColor:'#006400',
      justifyContent:'center',
      alignItems:'center',
      padding:10,
      borderRadius:20,
      marginLeft:10
      },
});

export default ChatScreen;
