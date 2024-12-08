// components/Card.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import hospital from '../images/hospital.jpg';
import PointsIcon from '../images/icons/points.png';
import SearchIcon from '../images/components/searchIcon.png';

interface CardProps {
  title: string;
  time: string;
  address: string;
  points: number;
  imageURL?: string;
  onPress: () => void;
}

const Card: React.FC<CardProps> = ({ title, time, address, points, onPress, imageURL }) => {
  const isPast = new Date(time) < new Date();

  const getShortAddress = (fullAddress: string): string => {
      if (!fullAddress) return '';
      const parts = fullAddress.split(',');
      return parts[0].trim();
    };

  const shortAddress = getShortAddress(address);
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.cardContainer, isPast && styles.pastCardContainer]}>
        <Text style={styles.imageContainer}>
            <Image source={imageURL ? { uri: imageURL } : hospital}  style={styles.image} resizeMode="cover" />
        </Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.details}>{time}</Text>
          <Text style={styles.details}>{shortAddress}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.points}>{points}</Text>
                <Image source={PointsIcon} style={{ width: 16, height: 19, marginRight: 5 }} />
            </View>
        </View>
        <Image source={SearchIcon} style={{ width: 29, height: 31, alignSelf: 'center', marginRight: 10 }} />
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
    width: '100%',
    height: 130,
    alignSelf: 'center',
  },
  pastCardContainer: {
    backgroundColor: '#D9D9D9',
  },
  imageContainer: {
    marginRight: 15,
    marginTop: -45,
    borderRadius: 45,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 45,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
    color: 'black',
  },
  details: {
    fontSize: 16,
    color: '#666',
  },
  points: {
    fontSize: 18,
    color: '#838383',
    marginRight: 5,
  },
});

export default Card;
