import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { fetchEvents } from '../utils/api';
import {handleDateTime} from '../utils/dateUtils';
import { useEventContext } from '../context/EventContext';
import CategorySection from '../components/CategorySection';
import AllEventsSection from '../components/AllEventsSection';
import SearchBar from '../components/SearchBar';
import FiltersModal from '../components/FiltersModal';
import SearchModal from '../components/SearchModal';
import Card from '../components/Card';

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
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isSearchModalVisible, setSearchModalVisible] = useState(false);
  const [isFiltersModalVisible, setFiltersModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});
  const [sortingMethod, setSortingMethod] = useState('date');

  const loadEvents = async () => {
    setRefreshing(true);
    try {
      const data = await fetchEvents();
      if (data) {
        setEvents(data);
      }
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const applyFilters = (filters: any, sorting: string) => {
    setActiveFilters(filters);
    setSortingMethod(sorting);
    setFiltersModalVisible(false);
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSortingMethod('rating');
  };

  const filteredEvents = events
    .filter((event) => {
      // city filters
      if (activeFilters.city && activeFilters.city.length > 0 && !activeFilters.city.includes(event.city)) return false;

      // rating filters
      if (activeFilters.rating && event.creator.pointsAsCreator !== null) {
        if (event.creator.pointsAsCreator < activeFilters.rating) return false;
      }

      // duration filters
      if (activeFilters.duration) {
        const durationInMinutes =
          (new Date(event.endDateTime).getTime() - new Date(event.startDateTime).getTime()) / 60000;

        // if duration preset is picked
        if (activeFilters.duration.preset) {
          switch (activeFilters.duration.preset) {
            case 'less2h':
              if (durationInMinutes >= 120) return false;
              break;
            case 'more3h':
              if (durationInMinutes <= 180) return false;
              break;
            case 'more30min':
              if (durationInMinutes <= 30) return false;
              break;
          }
        }

        if (activeFilters.duration.custom) {
          const { min, max } = activeFilters.duration.custom;
          if (durationInMinutes < min || durationInMinutes > max) return false;
        }
      }

      return true;
    })
    .filter((event) => {
        if (!searchText.trim()) return true;
        return event.name.toLowerCase().includes(searchText.toLowerCase());
      })
    .sort((a, b) => {
      if (sortingMethod === 'rating') {
        const aVal = a.creator.pointsAsCreator !== null ? a.creator.pointsAsCreator : 0;
        const bVal = b.creator.pointsAsCreator !== null ? b.creator.pointsAsCreator : 0;
        return bVal - aVal;
      }
      if (sortingMethod === 'date') {
        return new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime();
      }
      if (sortingMethod === 'points') {
        return b.price - a.price;
      }
      return 0;
    });

  const eventsHighPoints = filteredEvents.filter((event) => event.price >= 60);

  const eventsFewPlaces = filteredEvents.filter((event) => {
    const freePlaces = event.capacity - event.occupiedQuantity;
    return freePlaces <= 5;
  });

  const now = new Date().getTime();
  const twoDays = 48 * 60 * 60 * 1000;
  const eventsSoon = filteredEvents.filter((event) => {
    const startTime = new Date(event.startDateTime).getTime();
    return startTime - now < twoDays && startTime > now;
  });

  return (
    <View style={styles.container}>
      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        openFiltersModal={() => setFiltersModalVisible(true)}
        openSearchModal={() => setSearchModalVisible(true)}
        hasActiveFilters={Object.keys(activeFilters).length > 0}
        isSearchingEvents={true}
      />
      <SearchModal
          isVisible={isSearchModalVisible}
          closeModal={() => {
              setSearchModalVisible(false);
              setSearchText('');
            }}
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
              imageURL={event.imageURL}
              onPress={() => {
                setSearchModalVisible(false);
                navigation.navigate('EventDetails', { ...event });
              }}
            />
          )}
        />
      <FiltersModal
        isVisible={isFiltersModalVisible}
        onClose={() => setFiltersModalVisible(false)}
        onApply={applyFilters}
        onClear={clearFilters}
        currentFilters={activeFilters}
        currentSorting={sortingMethod}
        events={events}
      />
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadEvents} />}
        showsVerticalScrollIndicator={false}
      >
        <CategorySection title="Filtered Events" events={filteredEvents} />
        <CategorySection title="A lot of points" events={eventsHighPoints} />
        <CategorySection title="Few Free Places" events={eventsFewPlaces} />
        <CategorySection title="Starting Soon" events={eventsSoon} />
        <AllEventsSection events={filteredEvents} onPressEvent={(event) => navigation.navigate('EventDetails', { ...event })} />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
    marginBottom: 80,
  },
});
