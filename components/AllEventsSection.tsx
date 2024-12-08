import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';
import { handleDateTime } from '../utils/dateUtils';

const AllEventsSection: React.FC<Props> = ({ events, onPressEvent }) => {
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
      fontFamily: 'Gilroy-Regular',
      color: 'black',
      marginBottom: 10,
      marginLeft: 15,
  },
});

export default AllEventsSection;
