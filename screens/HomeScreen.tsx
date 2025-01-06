// File: HomeScreen.tsx
// Author: Kininbayev Timur (xkinin00)
// Description: Main screen showing all events, with filtering, sorting, and searching.
// Uses filterAndSortEvents utility to avoid code duplication.

import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchEvents, fetchAllEvents } from '../utils/api';
import { handleDateTime } from '../utils/dateUtils';
import { useEventContext } from '../context/EventContext';
import CategorySection from '../components/CategorySection';
import AllEventsSection from '../components/AllEventsSection';
import SearchBar from '../components/SearchBar';
import FiltersModal from '../components/FiltersModal';
import SearchModal from '../components/SearchModal';
import Card from '../components/Card';
import { filterAndSortEvents } from '../utils/filterEvents';

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
      const data = await fetchAllEvents();
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
    setSortingMethod('date');
  };

  // Use the utility function to filter and sort events
  const filteredEvents = filterAndSortEvents(events, activeFilters, sortingMethod, searchText);

  const eventsHighPoints = filteredEvents.filter((event) => event.price >= 60);
  const eventsFewPlaces = filteredEvents.filter((event) => {
    const freePlaces = event.capacity - event.occupiedQuantity;
    return freePlaces <= 10;
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
          isSearchingEvents = {true}
          closeModal={() => {
              setSearchModalVisible(false);
              setSearchText('');
            }}
          openFiltersModal={() => setFiltersModalVisible(true)}
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
        events={filteredEvents}
      />
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadEvents} />}
        showsVerticalScrollIndicator={false}
      >
        <CategorySection title="Popular" events={filteredEvents} />
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
