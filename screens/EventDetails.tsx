import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { handleDateTimeWithoutDate } from '../utils/dateUtils';
import { AuthContext } from '../context/AuthContext';
import hospital from '../images/hospital.jpg';
import EventRegistrationStatus from '../components/EventRegistrationStatus';
import { fetchParticipants } from '../utils/api';
import UserCard from '../components/UserCard';

const EventDetails: React.FC = ({ route }) => {
  const {
    title,
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
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.details}>Start Time: {handleDateTimeWithoutDate(startDateTime)}</Text>
      <Text style={styles.details}>End Time: {handleDateTimeWithoutDate(endDateTime)}</Text>
      <Text style={styles.details}>City: {city}</Text>
      <Text style={styles.details}>Address: {address}</Text>
      <Text style={styles.details}>Points: {price}</Text>
      <Text style={styles.details}>Capacity: {occupiedQuantity}/{capacity}</Text>
      <Text style={styles.description}>{description}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <UserCard
            name={creator.name}
            points={creator.points}
            avatarUrl={creator.avatarUrl}
            email={creator.email}
          />
      </View>
      {isCreator ? (
        <View style={styles.participantsContainer}>
          <Text style={styles.participantsTitle}>Participants</Text>
          {participants.map((participant) => (
            <UserCard
              key={participant.id}
              name={participant.name}
              points={participant.points}
              avatarUrl={participant.avatarUrl}
              email={participant.email}
              showActions={isCreator}
            />
          ))}
          <TouchableOpacity style={styles.deleteButton}>
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
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  details: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
  },
  participantsContainer: {
    marginTop: 20,
  },
  participantsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
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
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default EventDetails;
