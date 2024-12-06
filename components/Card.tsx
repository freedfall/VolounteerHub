// components/Card.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import hospital from '../images/hospital.jpg';
import { useNavigation } from '@react-navigation/native';

interface CardProps {
  title: string;
  time: string;
  city: string;
  address: string;
  points: number;
  imageURL?: string;
  onPress: () => void;
}

const Card: React.FC<CardProps> = ({ title, time, city, address, points, onPress, imageURL }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.cardContainer}>
        <Text style={styles.imageContainer}>
            <Image source={imageURL ? { uri: imageURL } : hospital}  style={styles.image} resizeMode="cover" />
        </Text>
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
    width: '100%',
    height: 130,
    alignSelf: 'center',
  },
  imageContainer: {
    marginRight: 15,
    marginTop: -45,
    borderRadius: 15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 15,
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
