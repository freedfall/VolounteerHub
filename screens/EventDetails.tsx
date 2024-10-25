// screens/EventDetailsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import hospital from '../images/hospital.jpg'

const EventDetails: React.FC = ({ route }) => {
  const { title, time, city, address, points, description } = route.params;

  return (
    <View style={styles.container}>
      <Image source={hospital} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.details}>Time: {time}</Text>
      <Text style={styles.details}>City: {city}</Text>
      <Text style={styles.details}>Address: {address}</Text>
      <Text style={styles.details}>Points: {points}</Text>
      <Text style={styles.description}>{description}</Text>
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
});


export default EventDetails;
