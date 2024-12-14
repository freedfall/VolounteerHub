// ProfileScreen.tsx
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';

import { fetchUserCreatedEvents, fetchUserParticipationEvents, fetchEvents, fetchAllUsers, fetchAllEvents } from '../utils/api';
import { handleDateTime } from '../utils/dateUtils';
import Card from '../components/Card';
import QRCodeGenerator from '../components/QRCodeGenerator';
import PointsToStars from '../components/PointsToStars';
import userProfileIcon from '../images/userProfileIcon.jpg';
import AdminUserModal from '../components/AdminUserModal';
import PointsIcon from '../images/icons/points.png';
import SettingsIcon from '../images/icons/settings.png';
import ChatIcon from '../images/icons/chatIcon.png';
import UserCard from '../components/UserCard';
import SettingsModal from '../components/SettingsModal';

const ProfileScreen: React.FC = () => {
  const { user, signOut, loadUserData } = useContext(AuthContext);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [isAdmin, setIsAdmin] = useState(user?.role === 'ADMIN');
  const [selectedCategory, setSelectedCategory] = useState<'createdEvents' | 'participationEvents' | 'allEvents' | 'allUsers'>('createdEvents');
  const [createdEvents, setCreatedEvents] = useState([]);
  const [participationEvents, setParticipationEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoaded, setIsLoaded] = useState({ created: false, participation: false, allEvents: false, allUsers: false });
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  useEffect(() => {
    if (!user) {
      loadUserData();
    } else {
      loadEvents(selectedCategory);
      if (isAdmin) {
        loadAdminData();
      }
    }
  }, [loadEvents, loadUserData, selectedCategory, user, isAdmin]);

  useEffect(() => {
    if (isFocused) {
      console.log('ProfileScreen is focused, reloading data');
      setIsLoaded({ created: false, participation: false, allEvents: false, allUsers: false });
      loadUserData();
      loadEvents(selectedCategory);
      if (isAdmin) {
        loadAdminData();
      }
    }
  }, [isFocused, selectedCategory, isAdmin, loadUserData, loadEvents, loadAdminData]);

  const loadEvents = useCallback(async (category) => {
    console.log('Loading events:', category);
    try {
      if (category === 'createdEvents' && !isLoaded.created && !isAdmin) {
        const eventsData = await fetchUserCreatedEvents();
        console.log(eventsData);
        setCreatedEvents(eventsData || []);
        setIsLoaded((prev) => ({ ...prev, created: true }));
      } else if (category === 'participationEvents' && !isLoaded.participation && !isAdmin) {
        const eventsData = await fetchUserParticipationEvents();
        setParticipationEvents(eventsData || []);
        setIsLoaded((prev) => ({ ...prev, participation: true }));
      } else if (category === 'allEvents' && !isLoaded.allEvents && isAdmin) {
        const eventsData = await fetchAllEvents();
        setAllEvents(eventsData || []);
        setIsLoaded((prev) => ({ ...prev, allEvents: true }));
      } else if (category === 'allUsers' && !isLoaded.allUsers && isAdmin) {
        const usersData = await fetchAllUsers();
        setAllUsers(usersData || []);
        setIsLoaded((prev) => ({ ...prev, allUsers: true }));
      }
    } catch (error) {
      Alert.alert('Error', `Failed to load ${category === 'createdEvents' ? 'created' : 'participated'} events.`);
    }
  }, [isLoaded, isAdmin]);

  const loadAdminData = useCallback(async () => {
    try {
      const eventsData = await fetchAllEvents();
      setAllEvents(eventsData || []);
      setIsLoaded((prev) => ({ ...prev, allEvents: true }));

      const usersData = await fetchAllUsers();
      setAllUsers(usersData || []);
      setIsLoaded((prev) => ({ ...prev, allUsers: true }));
    } catch (error) {
      Alert.alert('Error', 'Failed to load admin data.');
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setIsLoaded({ created: false, participation: false, allEvents: false, allUsers: false });
    await loadEvents(selectedCategory);
    setRefreshing(false);
  };

  const currentEvents = (selectedCategory === 'createdEvents' ? createdEvents :
                         selectedCategory === 'participationEvents' ? participationEvents :
                         selectedCategory === 'allEvents' ? allEvents : [])
    .slice()
    .sort((a, b) => {
      const now = new Date();
      const aDate = new Date(a.startDateTime);
      const bDate = new Date(b.startDateTime);

      const aIsPast = aDate < now;
      const bIsPast = bDate < now;

      if (aIsPast && !bIsPast) return 1; // a - прошедшее, b - предстоящее
      if (!aIsPast && bIsPast) return -1; // a - предстоящее, b - прошедшее
      // Если оба события предстоящие или оба прошедшие, сортируем по времени
      return aDate.getTime() - bDate.getTime();
    });

  const currentUsers = selectedCategory === 'allUsers' ? allUsers : [];

  const openUserModal = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleUserUpdated = () => {
    if (isAdmin && selectedCategory === 'allUsers') {
      loadEvents('allUsers');
    }
  };

  const isEventInPast = (event) => new Date(event.startDateTime) < new Date();

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.profileHeader}>
        <Image
          source={user?.imageURL ? { uri: user.imageURL } : userProfileIcon}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.editButton} onPress={() => setSettingsModalVisible(true)}>
          <Image source={SettingsIcon} style={{ width: 34, height: 34 }} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatButton} onPress={() => navigation.navigate('ChatListScreen')}>
          <Image source={ChatIcon} style={{ width: 37, height: 34 }} />
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <View style={{ flexDirection: 'column', justifyContent: 'space-between'}}>
          <Text style={styles.userName}>{user?.name} {user?.surname}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
            <PointsToStars points={user?.pointsAsCreator} />
          </View>
          <View style={{ flexDirection: 'row', gap: 5}}>
            <Text style={styles.infoPoints}>{user?.points}</Text>
            <Image source={PointsIcon} style={{ width: 20, height: 26 }} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.infoText}>{user?.email}</Text>
          </View>
        </View>
        <QRCodeGenerator email={user?.id.toString()} />
      </View>

      {!isAdmin && (
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
              styles.participationButton,
              selectedCategory === 'participationEvents' && styles.selectedSwitchButton,
            ]}
            onPress={() => setSelectedCategory('participationEvents')}
          >
            <Text style={styles.switchButtonText}>Participation Events</Text>
          </TouchableOpacity>
        </View>
      )}

      {isAdmin && (
        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[
              styles.switchButton,
              selectedCategory === 'allEvents' && styles.selectedSwitchButton,
            ]}
            onPress={() => setSelectedCategory('allEvents')}
          >
            <Text style={styles.switchButtonText}>All Events</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.switchButton,
              selectedCategory === 'allUsers' && styles.selectedSwitchButton,
            ]}
            onPress={() => setSelectedCategory('allUsers')}
          >
            <Text style={styles.switchButtonText}>All Users</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isAdmin && (
        <View style={styles.eventHistory}>
          {currentEvents.length > 0 ? (
            currentEvents.map((event, index) => (
              <Card
                key={index}
                title={event.name}
                time={handleDateTime(event.startDateTime)}
                address={event.address}
                points={event.price}
                imageURL={event.imageURL}
                isPast={isEventInPast(event)}
                onPress={() => navigation.navigate('EventDetails', { ...event })}
              />
            ))
          ) : (
            <Text style={styles.noEventsText}>No events found in this category.</Text>
          )}
        </View>
      )}

      {isAdmin && (
        <View style={styles.eventHistory}>
          {selectedCategory === 'allUsers' ? (
            currentUsers.length > 0 ? (
              currentUsers.map((user, index) => (
                <UserCard
                  key={user.id}
                  name={user.name}
                  surname={user.surname}
                  points={user.points}
                  avatarUrl={user.avatarUrl}
                  email={user.email}
                  showActions={false}
                  id={user.id}
                  eventId={null}
                  status={user.status}
                  isAdmin={isAdmin}
                />
              ))
            ) : (
              <Text style={styles.noEventsText}>No users found.</Text>
            )
          ) : currentEvents.length > 0 ? (
            currentEvents.map((event, index) => (
              <Card
                key={index}
                title={event.name}
                time={handleDateTime(event.startDateTime)}
                address={event.address}
                points={event.price}
                imageURL={event.imageURL}
                isPast={isEventInPast(event)}
                onPress={() => navigation.navigate('EventDetails', { ...event })}
              />
            ))
          ) : (
            <Text style={styles.noEventsText}>No events found in this category.</Text>
          )}
        </View>
      )}

      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.signOutButtonText}>Log out</Text>
      </TouchableOpacity>
        <SettingsModal
                visible={settingsModalVisible}
                onClose={() => setSettingsModalVisible(false)}
              />
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
    position: 'relative',
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
    position: 'absolute',
    top: 0,
    right: 50,
  },
  chatButton: {
      position: 'absolute',
      top: 0,
      right: 0,
    },
  infoSection: {
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  infoPoints: {
    fontSize: 24,
    color: '#333',
    fontWeight: '500',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
  },
  switchButton: {
    width: 170,
    paddingVertical: 8,
    borderRadius: 40,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedSwitchButton: {
    backgroundColor: '#69B67E',
  },
  switchButtonText: {
    color: '#fff',
    fontSize: 19,
  },
  participationButton: {
    width: 190,
    borderRadius: 40,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventHistory: {
    marginTop: 10,
    marginBottom: 20,
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
    backgroundColor: '#013B14',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 100,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#555',
  },
  userPoints: {
    fontSize: 14,
    color: '#555',
  },
});

export default ProfileScreen;
