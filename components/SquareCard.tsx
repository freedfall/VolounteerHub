import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import hospital from '../images/hospital.jpg'; // Use your own image

interface SquareCardProps {
  title: string;
  time: string;
  city: string;
  address: string;
  points: number;
  onPress: () => void;
}

const SquareCard: React.FC<SquareCardProps> = ({ title, time, city, address, points, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.cardContainer}>
        <Image source={hospital} style={styles.image} />
        <Text style={styles.title}>{title}</Text>
        <View style={styles.textContainer}>
            <Text style={styles.details}>{time}</Text>
            <Text style={styles.points}>{points}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: 158,
    height: 150,
    borderRadius: 10,
    marginRight: 10,
  },
  image: {
    width: '100%',
    height: 97,
    borderRadius: 15,
//     marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    textAlign: 'left',
    color: 'black',
  },
  details: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3,
  },
  points: {
    fontSize: 12,
    color: '#28a745',
    textAlign: 'center',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
});

export default SquareCard;
