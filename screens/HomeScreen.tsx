import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Card from '../components/Card';
import { useEventContext } from '../context/EventContext';

type RootStackParamList = {
  Home: undefined;
  EventDetails: { title: string; time: string; city: string; address: string; points: number; description: string };
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

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { setEvents, events } = useEventContext();
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState(''); // Состояние для отслеживания текста поиска
  const [filteredEvents, setFilteredEvents] = useState(events); // Состояние для фильтрованных событий

  const loadEvents = async () => {
    setRefreshing(true);
    try {
      const data = await fetchEvents();
      if (data) {
        setEvents(data);
        setFilteredEvents(data); // Изначально отобразим все события
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

  // Фильтрация событий на основе текста поиска
  useEffect(() => {
    if (searchText) {
      const filtered = events.filter((event) =>
        event.name.toLowerCase().includes(searchText.toLowerCase()) ||
        event.city.toLowerCase().includes(searchText.toLowerCase()) ||
        event.address.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events); // Если нет текста, отображаем все события
    }
  }, [searchText, events]);

  const handleScroll = (event: any) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    if (yOffset <= -10 && !refreshing) {
      loadEvents();
    }
  };

  const handleDateTime = (date: string) => {
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    return `${day}.${month} - ${hours}:${minutes}`;
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
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {filteredEvents.map((event, index) => (
          <Card
            key={index}
            title={event.name}
            time={handleDateTime(event.startDateTime)}
            city={event.city}
            address={event.address}
            points={event.price}
            onPress={() =>
              navigation.navigate('EventDetails', {
                title: event.title,
                time: event.time,
                city: event.city,
                address: event.address,
                points: event.points,
                description: event.description,
              })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    height: 48,
    paddingHorizontal: 10,
    borderRadius: 40,
    width: 364,
    alignSelf: 'center',
    fontSize: 16,
    borderColor: 'rgba(1, 59, 20, 1)',
    borderWidth: 2,
    paddingHorizontal: 20,
  },

});

export default HomeScreen;
