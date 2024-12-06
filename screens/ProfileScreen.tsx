import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

import { fetchUserCreatedEvents, fetchUserParticipationEvents } from '../utils/api';
import { handleDateTime } from '../utils/dateUtils';
import Card from '../components/Card';
import QRCodeGenerator from '../components/QRCodeGenerator';
import userProfileIcon from '../images/userProfileIcon.jpg';

const ProfileScreen: React.FC = () => {
  const { user, signOut, loadUserData } = useContext(AuthContext);
  const navigation = useNavigation();

  const [selectedCategory, setSelectedCategory] = useState<'createdEvents' | 'participationEvents'>('createdEvents');
  const [createdEvents, setCreatedEvents] = useState([]);
  const [participationEvents, setParticipationEvents] = useState([]);
  const [isLoaded, setIsLoaded] = useState({ created: false, participation: false });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!user) {
      loadUserData();
    } else {
      loadEvents(selectedCategory);
    }
  }, [user, selectedCategory]);

  const loadEvents = async (category: 'createdEvents' | 'participationEvents') => {
    try {
      if (category === 'createdEvents' && !isLoaded.created) {
        const eventsData = await fetchUserCreatedEvents();
        console.log(eventsData);
        setCreatedEvents(eventsData || []);
        setIsLoaded((prev) => ({ ...prev, created: true }));
      } else if (category === 'participationEvents' && !isLoaded.participation) {
        const eventsData = await fetchUserParticipationEvents();
        setParticipationEvents(eventsData || []);
        setIsLoaded((prev) => ({ ...prev, participation: true }));
      }
    } catch (error) {
      Alert.alert('Error', `Failed to load ${category === 'createdEvents' ? 'created' : 'participated'} events.`);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setIsLoaded({ created: false, participation: false });
    await loadEvents(selectedCategory);
    setRefreshing(false);
  };

  const currentEvents = (selectedCategory === 'createdEvents' ? createdEvents : participationEvents)
    .slice()
    .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.profileHeader}>
        <Image
          source={user?.avatarUrl ? { uri: user.avatarUrl } : userProfileIcon}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{user?.name} {user?.surname}</Text>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <View style={{ flexDirection: 'column', justifyContent: 'space-between'}}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.infoTitle}>Email: </Text>
            <Text style={styles.infoText}>{user?.email}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.infoTitle}>Points: </Text>
            <Text style={styles.infoText}>{user?.points}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.infoTitle}>As creator: </Text>
            <Text style={styles.infoText}>{user?.pointsAsCreator}</Text>
          </View>
        </View>
        <QRCodeGenerator email={user?.email} />
      </View>

      <View style={styles.switchContainer}>
        <TouchableOpacity
          style={[
            styles.switchButton,
            selectedCategory === 'createdEvents' && styles.selectedSwitchButton,
          ]}
          onPress={() => setSelectedCategory('createdEvents')}
        >
          <Text style={styles.switchButtonText}>Created Events</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.switchButton,
            selectedCategory === 'participationEvents' && styles.selectedSwitchButton,
          ]}
          onPress={() => setSelectedCategory('participationEvents')}
        >
          <Text style={styles.switchButtonText}>Participation Events</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.eventHistory}>
        {currentEvents.length > 0 ? (
          currentEvents.map((event, index) => (
            <Card
              key={index}
              title={event.name}
              time={handleDateTime(event.startDateTime)}
              city={event.city}
              address={event.address}
              occupiedQuantity={event.occupiedQuantity}
              points={event.price}
              imageURL={event.imageURL}
              onPress={() => navigation.navigate('EventDetails', { ...event })}
            />
          ))
        ) : (
          <Text style={styles.noEventsText}>No events found in this category.</Text>
        )}
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F0F4F8',
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  editButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  infoSection: {
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoTitle: {
    fontSize: 16,
    color: '#666',
  },
  infoText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  switchButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#ddd',
  },
  selectedSwitchButton: {
    backgroundColor: '#4CAF50',
  },
  switchButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  eventHistory: {
    marginVertical: 20,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  noEventsText: {
    fontSize: 16,
    color: '#999',
  },
  signOutButton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: '#FF6347',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 100,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default ProfileScreen;
