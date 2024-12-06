import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';
import { handleDateTime } from '../utils/dateUtils';
import { useNavigation } from '@react-navigation/native';

const AllEventsSection: React.FC<Props> = ({ events, onPressEvent }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.allEventsContainer}>
      {events.length > 0 && (
          <>
            <Text style={styles.allEventsTitle}>All Events</Text>
            {events.map((event, index) => (
              <Card
                key={index}
                title={event.name}
                time={handleDateTime(event.startDateTime)}
                city={event.city}
                address={event.address}
                points={event.price}
                imageURL={event.imageURL}
                onPress={() => onPressEvent(event)}
              />
            ))}
            </>
     )}
     {events.length === 0 && <Text style={styles.allEventsTitle}>There are no events :(</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  allEventsContainer: {
          marginBottom: 20,
  },
  allEventsTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'black',
      marginBottom: 10,
      alignSelf: 'center',
  },
});

export default AllEventsSection;
