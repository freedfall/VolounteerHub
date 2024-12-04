import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { handleDateTimeWithoutDate } from '../utils/dateUtils';
import { AuthContext } from '../context/AuthContext';
import hospital from '../images/hospital.jpg';
import EventRegistrationStatus from '../components/EventRegistrationStatus';
import { fetchParticipants, deleteEvent } from '../utils/api';
import UserCard from '../components/UserCard';

const EventDetails: React.FC = ({ route }) => {
  const {
    name,
    startDateTime,
    endDateTime,
    city,
    address,
    price,
    description,
    capacity,
    occupiedQuantity,
    creator,
    id,
  } = route.params;

  const { user } = useContext(AuthContext);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [participants, setParticipants] = useState([]);

  const isCreator = creator.id === user.id;

  useEffect(() => {
    const loadParticipants = async () => {
      try {
        const participantsData = await fetchParticipants(id);
        setParticipants(participantsData);

        const participant = participantsData.find((p) => p.id === user.id);
        if (participant) {
          setIsRegistered(true);
          setIsConfirmed(participant.status === 'confirmed');
        } else {
          setIsRegistered(false);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load participants.');
      }
    };

    loadParticipants();
  }, [id, user.id]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={hospital} style={styles.image} />
      <View style={styles.detailsContainer}>
          <Text style={styles.title}>{name}</Text>
          <View style={styles.timeContainer}>
            <View style={styles.dataContainer}>
              <Text style={styles.details}>Start Time</Text>
              <Text style={styles.dataBlock}>{handleDateTimeWithoutDate(startDateTime)}</Text>
            </View>
            <View style={styles.dataContainer}>
              <Text style={styles.details}>End Time</Text>
              <Text style={styles.dataBlock}>{handleDateTimeWithoutDate(endDateTime)}</Text>
            </View>
            <View style={styles.dataContainer}>
              <Text style={styles.details}>City</Text>
              <Text style={styles.dataBlock}>{city}</Text>
            </View>
          </View>
          <Text style={styles.details}>Address: {address}</Text>
          <Text style={styles.details}>Points: {price}</Text>
          <Text style={styles.details}>Capacity: {occupiedQuantity}/{capacity}</Text>
          <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.userList}>
          <Text style={styles.participantsTitle}>Event creator</Text>
          <View style={styles.participantsContainer}>
              <UserCard
                name={creator.name}
                points={creator.points}
                avatarUrl={creator.avatarUrl}
                email={creator.email}
                id={creator.id}
                eventId={id}
              />
          </View>
      </View>
      {isCreator ? (
        <View style={styles.userList}>
          <Text style={styles.participantsTitle}>Participants</Text>
          <View style={styles.participantsContainer}>
          {participants.map((participant) => (
            <UserCard
              key={participant.id}
              name={participant.name}
              points={participant.points}
              avatarUrl={participant.avatarUrl}
              email={participant.email}
              showActions={isCreator}
              id={participant.id}
              eventId={id}
              status={participant.status}
            />
          ))}
          </View>
          <TouchableOpacity style={styles.deleteButton} onPress={() => deleteEvent(id)}>
              <Text style={styles.deleteButtonText}>Delete Event</Text>
            </TouchableOpacity>
        </View>
      ) : (
        <EventRegistrationStatus
          eventId={id}
          isRegistered={isRegistered}
          isConfirmed={isConfirmed}
          onStatusChange={(newStatus, confirmation) => {
            setIsRegistered(newStatus);
            setIsConfirmed(confirmation);
          }}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  detailsContainer: {
    paddingHorizontal: 24,
  },
  dataContainer: {
      alignItems: 'center',
  },
  timeContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 20,
  },
    dataBlock: {
        width: 115,
        fontSize: 20,
        color: '#333',
        borderRadius: 40,
        borderColor: '013B14',
        borderWidth: 1,
        textAlign: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#ffffff',
    },
  title: {
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 10,
    color: 'black',
  },
  details: {
    fontSize: 20,
    color: 'black',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
    marginBottom: 40,
  },
  participantsContainer: {
    marginTop: 20,
  },
  participantsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  userList:{
      paddingHorizontal: 24,
  },
  participantsContainer: {
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 40,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default EventDetails;
