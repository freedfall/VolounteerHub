import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { handleDateTimeWithoutDate } from '../utils/dateUtils';
import { AuthContext } from '../context/AuthContext';
import hospital from '../images/hospital.jpg';
import EventRegistrationStatus from '../components/EventRegistrationStatus';

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
    creator,
    id,
  } = route.params;

  const { user } = useContext(AuthContext);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const isCreator = creator.email === user.email;

  useEffect(() => {
    // Получаем список зарегистрированных пользователей и обновляем статус
    const fetchParticipants = async () => {
      try {
        const response = await fetch('https://fitexamprep.site/itu/api/event/users-registered/' + id, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const participants = await response.json();

          const participant = participants.find(participant => participant.id === user.id);
          console.log('Participant:', participants);

          if (participant) {
            setIsRegistered(true);
            setIsConfirmed(participant.status === 'confirmed');
          } else {
            setIsRegistered(false);
          }
        } else {
          Alert.alert('Error', 'Failed to load participants.');
        }
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    };

    fetchParticipants();
  }, [id, user.email]);

  return (
    <View style={styles.container}>
      <Image source={hospital} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.details}>Start Time: {handleDateTimeWithoutDate(startDateTime)}</Text>
      <Text style={styles.details}>End Time: {handleDateTimeWithoutDate(endDateTime)}</Text>
      <Text style={styles.details}>City: {city}</Text>
      <Text style={styles.details}>Address: {address}</Text>
      <Text style={styles.details}>Points: {price}</Text>
      <Text style={styles.details}>Capacity: {capacity}</Text>
      <Text style={styles.details}>Creator: {`${creator.name} ${creator.surname}`}</Text>
      <Text style={styles.description}>{description}</Text>

      {!isCreator ? (
        <EventRegistrationStatus
          eventId={id}
          isRegistered={isRegistered}
          isConfirmed={isConfirmed}
          onStatusChange={(newStatus, confirmation) => {
            setIsRegistered(newStatus);
            setIsConfirmed(confirmation);
          }}
        />
      ) : (
        <>
          <TouchableOpacity style={styles.viewParticipantsButton}>
            <Text style={styles.viewParticipantsButtonText}>View Participants</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete Event</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
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
  viewParticipantsButton: {
    backgroundColor: '#2196F3',
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
  viewParticipantsButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
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
