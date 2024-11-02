import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SquareCard from './SquareCard';
import rightArrow from '../images/components/rightArrow.png';
import { handleDateTime } from '../utils/dateUtils';

type Props = {
  title: string;
  events: any[];
};

const CategorySection: React.FC<Props> = ({ title, events }) => {
  const navigation = useNavigation();

  if (events.length < 5) return null;

  return (
    <View style={styles.categoryContainer}>
      <TouchableOpacity
        style={styles.categoryHeader}
        onPress={() => navigation.navigate('CategoryDetails', { category: title, events })}
      >
        <Text style={styles.categoryTitle}>{title}</Text>
        <Image source={rightArrow} style={styles.viewAllText} />
      </TouchableOpacity>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {events.slice(0, 5).map((event, index) => (
          <SquareCard
            key={index}
            title={event.name}
            time={handleDateTime(event.startDateTime)}
            city={event.city}
            address={event.address}
            points={event.price}
            onPress={() => navigation.navigate('EventDetails', { ...event })}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
      marginBottom: 20,
      paddingHorizontal: 20,
    },
    categoryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    categoryTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'black',
    },
    viewAllText: {
      width: 14,
      height: 16,
    },
});

export default CategorySection;
