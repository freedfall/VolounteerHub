import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, TextInput, Text, RefreshControl, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import SquareCard from '../components/SquareCard';
import { useEventContext } from '../context/EventContext';
import rightArrow from '../images/components/rightArrow.png';

type RootStackParamList = {
  Home: undefined;
  EventDetails: { title: string; time: string; city: string; address: string; points: number; description: string };
  CategoryDetails: { category: string; events: any[] }; // New screen for category details
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const fetchEvents = async () => {
  try {
    const response = await fetch('https://fitexamprep.site/itu/api/event', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log('Events:', data);
    return data;
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

const handleDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month} - ${hours}:${minutes}`;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { setEvents, events } = useEventContext();
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  const loadEvents = async () => {
    setRefreshing(true);
    try {
      const data = await fetchEvents();
      if (data) {
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setRefreshing(false);
    }
  };


  useEffect(() => {
    loadEvents();
  }, []);

  const renderCategory = (title: string, filteredEvents: any[]) => {
    return (
      <View style={styles.categoryContainer}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryTitle}>{title}</Text>
          <Image source={rightArrow} style={styles.viewAllText} onPress={() => navigation.navigate('CategoryDetails', { category: title, events: filteredEvents })}>
          </Image>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filteredEvents.slice(0, 5).map((event, index) => (
            <SquareCard
              key={index}
              title={event.name}
              time={handleDateTime(event.startDateTime)}
              city={event.city}
              address={event.address}
              points={event.price}
              onPress={() =>
                navigation.navigate('EventDetails', {
                  title: event.name,
                  time: handleDateTime(event.startDateTime),
                  city: event.city,
                  address: event.address,
                  points: event.price,
                  description: event.description,
                })
              }
            />
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        value={searchText}
        onChangeText={setSearchText}
      />
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadEvents} />}
      >
        {renderCategory('All events', events)}
        {renderCategory('With good reviews', events.filter(event => event.reviews >= 4))}
        {renderCategory('Closest to you', events.filter(event => event.distance < 10))}
        {renderCategory('Many points', events.filter(event => event.points >= 50))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  searchInput: {
    height: 48,
    paddingHorizontal: 10,
    borderRadius: 40,
    fontSize: 16,
    borderColor: 'rgba(1, 59, 20, 1)',
    borderWidth: 2,
    marginBottom: 20,
  },
  categoryContainer: {
    marginBottom: 20,
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
  },
  viewAllText: {
    width: 14,
    height: 16,
  },
});

export default HomeScreen;
