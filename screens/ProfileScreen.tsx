import React, { useContext, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useEventContext } from '../context/EventContext';
import { useNavigation } from '@react-navigation/native';

import Card from '../components/Card';
import QRCodeGenerator from '../components/QRCodeGenerator';

import userProfileIcon from '../images/userProfileIcon.jpeg';

const ProfileScreen: React.FC = () => {
  const { user, signOut, loadUserData } = useContext(AuthContext);
  const { events } = useEventContext();
  const navigation = useNavigation();

  useEffect(() => {
    if (!user) {
      loadUserData();
    }
  }, [user]);

  const userEvents = events.filter(event => event.creator?.email === user.email);

  return (
    <ScrollView contentContainerStyle={styles.container}>
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

      <View style={styles.eventHistory}>
              <Text style={styles.historyTitle}>Your Events</Text>
              {userEvents.length > 0 ? (
                userEvents.map((event, index) => (
                  <Card
                    key={index}
                    title={event.name}
                    time={new Date(event.startDateTime).toDateString()}
                    city={event.city}
                    address={event.address}
                    points={event.price}
                    onPress={() =>
                      navigation.navigate('EventDetails', {
                        title: event.name,
                        startTime: event.startDateTime,
                        endTime: event.endDateTime,
                        city: event.city,
                        address: event.address,
                        points: event.price,
                        description: event.description,
                        capacity: event.capacity,
                        creator: event.creator,
                        participants: event.participants,
                      })
                    }
                  />
                ))
              ) : (
                <Text style={styles.noEventsText}>You haven't created or joined any events yet.</Text>
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
  eventHistory: {
    marginVertical: 20,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  eventItem: {
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 10,
  },
  eventName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  eventDetails: {
    fontSize: 16,
    color: '#555',
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
