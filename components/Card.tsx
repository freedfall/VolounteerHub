// components/Card.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import hospital from '../images/hospital.jpg';

interface CardProps {
  title: string;
  time: string;
  city: string;
  address: string;
  points: number;
  onPress: () => void;
}

const Card: React.FC<CardProps> = ({ title, time, city, address, points, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.cardContainer}>
        <Image source={hospital} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.details}>{time}</Text>
          <Text style={styles.details}>{address}</Text>
          <Text style={styles.points}>{points}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    backgroundColor: 'rgba(200, 237, 210, 1)',
    width: 364,
    height: 130,
    alignSelf: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  points: {
    fontSize: 14,
    color: '#28a745',
  },
});

export default Card;
