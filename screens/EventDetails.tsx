// screens/EventDetailsScreen.tsx
import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import hospital from '../images/hospital.jpg'

const EventDetails: React.FC = ({ route }) => {
  const {
      title,
      startTime,
      endTime,
      city,
      address,
      points,
      description,
      capacity,
      creator,
      participants,
    } = route.params;

  const { user } = useContext(AuthContext);

  const isCreator = creator.email === user.email;

  return (
       <View style={styles.container}>
       <Image source={hospital} style={styles.image} />
         <Text style={styles.title}>{title}</Text>
         <Text style={styles.details}>Start Time: {startTime}</Text>
         <Text style={styles.details}>End Time: {endTime}</Text>
         <Text style={styles.details}>City: {city}</Text>
         <Text style={styles.details}>Address: {address}</Text>
         <Text style={styles.details}>Points: {points}</Text>
         <Text style={styles.details}>Capacity: {capacity}</Text>
         <Text style={styles.details}>Creator: {`${creator.name} ${creator.surname}`}</Text>
         <Text style={styles.description}>{description}</Text>

         {!isCreator ? (
           <TouchableOpacity style={styles.joinButton}>
             <Text style={styles.joinButtonText}>Join Event</Text>
           </TouchableOpacity>
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
    joinButton: {
        backgroundColor: '#4CAF50',
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
    joinButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
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
