// File: CategoryDetailsScreen.tsx
// Author: Kininbayev Timur (xkinin00)
// Description: This screen shows events belonging to a specific category

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Card from '../components/Card';
import { handleDateTime } from '../utils/dateUtils';
import SearchBar from '../components/SearchBar';
import SearchModal from '../components/SearchModal';
import FiltersModal from '../components/FiltersModal';
import Arrow from '../images/components/rightArrow.png'
import { filterAndSortEvents } from '../utils/filterEvents'; // Import the utility

type RootStackParamList = {
  CategoryDetails: { category: string; events: any[] };
};

type Props = NativeStackScreenProps<RootStackParamList, 'CategoryDetails'>;

const CategoryDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  // Extract category name and events passed via route
  const { category, events } = route.params;

  // State for handling search text and modal visibility
  const [searchText, setSearchText] = useState('');
  const [isSearchModalVisible, setSearchModalVisible] = useState(false);
  const [isFiltersModalVisible, setFiltersModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});
  const [sortingMethod, setSortingMethod] = useState('date');

  // Maintain a search history if needed
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Use the same utility function to filter by search (and also handle filters if needed)
  const filteredEvents = filterAndSortEvents(events, activeFilters, sortingMethod, searchText);

  const goBack = () => {
    navigation.goBack();
  }

  const applyFilters = (filters: any, sorting: string) => {
      setActiveFilters(filters);
      setSortingMethod(sorting);
      setFiltersModalVisible(false);
    };

    const clearFilters = () => {
      setActiveFilters({});
      setSortingMethod('rating');
    };

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
      {/* SearchBar to initiate search and open the search modal */}
      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        openSearchModal={() => setSearchModalVisible(true)}
        openFiltersModal={() => setFiltersModalVisible(true)}
        isSearchingEvents={true}
      />

      {/* A modal that allows the user to search events with a dedicated interface */}
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

      <View>
        <TouchableOpacity style={styles.headerContainer} onPress={goBack}>
            <Image source={Arrow} style={{ width: 14, height: 16, transform: [{ scaleX: -1 }] }} resizeMode="cover" />
            <Text style={styles.header}>{category}</Text>
        </TouchableOpacity>
      </View>

      {/* Displays a scrollable list of filtered events as cards */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredEvents.map((event, index) => (
          <Card
            key={index}
            title={event.name}
            time={handleDateTime(event.startDateTime)}
            city={event.city}
            address={event.address}
            points={event.price}
            imageURL={event.imageURL}
            onPress={() => navigation.navigate('EventDetails', { ...event })}
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
      backgroundColor: '#f5f5f5'
  },
  headerContainer: {
      marginLeft: 10,
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
  },
  header: {
      fontSize: 24,
      color: 'black',
      marginBottom: 2,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

export default CategoryDetailsScreen;
