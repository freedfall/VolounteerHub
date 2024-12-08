import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';

import { fetchUserCreatedEvents, fetchUserParticipationEvents, fetchEvents, fetchAllUsers, fetchAllEvents } from '../utils/api';
import { handleDateTime } from '../utils/dateUtils';
import Card from '../components/Card';
import QRCodeGenerator from '../components/QRCodeGenerator';
import userProfileIcon from '../images/userProfileIcon.jpg';
import AdminUserModal from '../components/AdminUserModal';

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
  const [isLoaded, setIsLoaded] = useState({ created: false, participation: false });
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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
}, [isFocused, selectedCategory, isAdmin]);

  const loadEvents = async (category: 'createdEvents' | 'participationEvents' | 'allEvents' | 'allUsers') => {
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
  };

  const loadAdminData = async () => {
    await loadEvents('allEvents');
    await loadEvents('allUsers');
  };

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
    .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());

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
              styles.switchButton,
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
                city={event.city}
                address={event.address}
                occupiedQuantity={event.occupiedQuantity}
                points={event.price}
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
                <TouchableOpacity key={index} onPress={() => openUserModal(user)}>
                  <View style={styles.userCard}>
                    <Image
                      source={user.imageURL ? { uri: user.imageURL } : userProfileIcon}
                      style={styles.userAvatar}
                    />
                    <View style={styles.userInfo}>
                      <Text style={styles.userNameText}>{user.name} {user.surname}</Text>
                      <Text style={styles.userEmail}>{user.email}</Text>
                      <Text style={styles.userPoints}>Points: {user.points}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
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
                city={event.city}
                address={event.address}
                occupiedQuantity={event.occupiedQuantity}
                points={event.price}
                onPress={() => navigation.navigate('EventDetails', { ...event })}
              />
            ))
          ) : (
            <Text style={styles.noEventsText}>No events found in this category.</Text>
          )}
        </View>
      )}

      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
      {isAdmin && selectedUser && (
              <AdminUserModal
                visible={modalVisible}
                user={selectedUser}
                onClose={() => setModalVisible(false)}
                navigation={navigation}
              />
            )}
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
  // Внутри StyleSheet.create({...})
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
