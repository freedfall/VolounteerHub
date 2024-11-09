import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { fetchEvents } from '../utils/api';
import CategorySection from '../components/CategorySection';
import AllEventsSection from '../components/AllEventsSection';
import SearchBar from '../components/SearchBar';
import SearchModal from '../components/SearchModal';
import { useEventContext } from '../context/EventContext';
import Card from '../components/Card';
import { handleDateTime } from '../utils/dateUtils';


type RootStackParamList = {
  Home: undefined;
  EventDetails: { title: string; time: string; city: string; address: string; points: number; description: string };
  CategoryDetails: { category: string; events: any[] };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { setEvents, events } = useEventContext();
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const loadEvents = async () => {
    setRefreshing(true);
    try {
      const data = await fetchEvents();
      if (data) setEvents(data);
    } finally {
      setRefreshing(false);
    }
  };

  const saveSearchHistory = async (history: string[]) => {
    try {
      await AsyncStorage.setItem('searchHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('searchHistory');
      if (history) setSearchHistory(JSON.parse(history));
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  useEffect(() => {
    loadEvents();
    loadSearchHistory();
  }, []);

  const filteredEvents = events.filter(event => event.name.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <View style={styles.container}>
      <SearchBar searchText={searchText} setSearchText={setSearchText} openModal={() => setModalVisible(true)} />
      <SearchModal
        isVisible={isModalVisible}
        closeModal={() => setModalVisible(false)}
        searchText={searchText}
        setSearchText={setSearchText}
        searchHistory={searchHistory}
        filteredItems={filteredEvents}
        renderItem={(event, index) => (
          <Card
            key={index}
            title={event.name}
            time={handleDateTime(event.startDateTime)}
            city={event.city}
            address={event.address}
            points={event.price}
            onPress={() => {
              setModalVisible(false);
              navigation.navigate('EventDetails', { ...event });
            }}
          />
        )}
      />

      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadEvents} />} showsVerticalScrollIndicator={false}>
        <CategorySection title="Popular Events" events={events} />
        <CategorySection title="Many Points" events={events.filter(event => event.price > 60)} />
        <AllEventsSection events={events} onPressEvent={(event) => navigation.navigate('EventDetails', { ...event })} />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 10,
      backgroundColor: '#f5f5f5',
      marginBottom: 80,
  },
});
