import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';
import { handleDateTime } from '../utils/dateUtils';

type Props = {
  events: any[];
  onPressEvent: (event: any) => void;
};

const AllEventsSection: React.FC<Props> = ({ events, onPressEvent }) => {
  return (
    <View style={styles.allEventsContainer}>
      <Text style={styles.allEventsTitle}>All Events</Text>
      {events.map((event, index) => (
        <Card
          key={index}
          title={event.name}
          time={handleDateTime(event.startDateTime)}
          city={event.city}
          address={event.address}
          points={event.price}
          onPress={() => onPressEvent(event)}
        />
      ))}
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
