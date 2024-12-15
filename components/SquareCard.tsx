import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import hospital from '../images/hospital.jpg';
import PointsIcon from '../images/icons/points.png';

interface SquareCardProps {
  title: string;
  time: string;
  city: string;
  address: string;
  points: number;
  imageURL?: string;
  onPress: () => void;
}

const SquareCard: React.FC<SquareCardProps> = ({ title, time, city, address, points, onPress, imageURL }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.cardContainer}>
        <Image source={imageURL ? { uri: imageURL } : hospital} style={styles.image} resizeMode="cover"/>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.textContainer}>
            <Text style={styles.details}>{time}</Text>
            <View style={styles.pointsWrapper}>
                <Text style={styles.points}>{points}</Text>
                <Image source={PointsIcon} style={{ width: 12, height: 15, marginTop: 1 }} resizeMode="cover" />
            </View>
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
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    textAlign: 'left',
    color: 'black',
  },
  details: {
    fontSize: 13,
    color: 'rgba(131, 131, 131, 1)',
    marginBottom: 3,
  },
  points: {
    fontSize: 13,
    color: 'rgba(131, 131, 131, 1)',
    textAlign: 'center',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  pointsWrapper: {
    flexDirection: 'row',
    gap: 5,
  },
});

export default SquareCard;
