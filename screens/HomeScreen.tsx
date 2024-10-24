import React, { useEffect, useState, useRef } from 'react';
import {
  View, ScrollView, StyleSheet, TextInput, Text, RefreshControl, Image, Modal, TouchableOpacity
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import SquareCard from '../components/SquareCard';
import Card from '../components/Card';
import { useEventContext } from '../context/EventContext';
import rightArrow from '../images/components/rightArrow.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import clockIcon from '../images/components/clock.png';

type RootStackParamList = {
  Home: undefined;
  EventDetails: { title: string; time: string; city: string; address: string; points: number; description: string };
  CategoryDetails: { category: string; events: any[] };
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
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const searchInputRef = useRef<TextInput>(null);
  const modalSearchInputRef = useRef<TextInput>(null);

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
        if (history) {
          setSearchHistory(JSON.parse(history));
        }
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    };

  useEffect(() => {
    loadEvents();
    loadSearchHistory();
  }, []);

  const handleSearchBlur = () => {
      if (searchText.trim() !== '') {
        setSearchHistory((prevHistory) => {
          const updatedHistory = [searchText, ...prevHistory.filter((item) => item !== searchText)];
          saveSearchHistory(updatedHistory.slice(0, 3));
          return updatedHistory.slice(0, 3);
        });
      }
    };

    const handleSearchTextChange = (text: string) => {
      setSearchText(text);
    };

  const filteredEvents = searchText.trim() === '' ? [] : events.filter((event) =>
    event.name.toLowerCase().includes(searchText.toLowerCase()) ||
    event.city.toLowerCase().includes(searchText.toLowerCase()) ||
    event.address.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderCategory = (title: string, filteredEvents: any[]) => {
    if (filteredEvents.length < 5) return null;

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

  const renderAllEvents = (allEvents: any[]) => {
      return (
        <View style={styles.allEventsContainer}>
          <Text style={styles.allEventsTitle}>All Events</Text>
          {allEvents.map((event, index) => (
            <Card
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
        </View>
      );
    };

  return (
    <View style={styles.container}>
      <TextInput
        ref={searchInputRef}
        style={styles.searchInput}
        placeholder="Search..."
        value={searchText}
        onPress={() => {
          setModalVisible(true);
        }}
        onFocus={() => {
            searchInputRef.current?.blur();
        }}
        onChangeText={handleSearchTextChange}
        onBlur={handleSearchBlur}
      />
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadEvents} />}
      >
        {renderCategory('With good reviews', events)}
        {renderCategory('Closest to you', events.filter(event => event.distance < 10))}
        {renderCategory('Many points', events.filter(event => event.price >= 50))}

        {renderAllEvents(events)}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          searchInputRef.current?.blur();
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TextInput
              ref={modalSearchInputRef}
              style={styles.searchInputModal}
              placeholder="Search..."
              value={searchText}
              onChangeText={handleSearchTextChange}
              autoFocus={true}
              onBlur={handleSearchBlur}
            />
            <TouchableOpacity onPress={() => {
              setModalVisible(false);
              setSearchText('');
            }}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            {searchText.trim() === '' &&
                searchHistory.map((query, index) => (
                <TouchableOpacity key={index} onPress={() => setSearchText(query)} style={styles.historyItem}>
                  <Image source={clockIcon} style={styles.historyIcon} />
                  <Text style={styles.historyText}>{query}</Text>
                </TouchableOpacity>
            ))}
            {filteredEvents.map((event, index) => (
              <Card
                key={index}
                title={event.name}
                time={handleDateTime(event.startDateTime)}
                city={event.city}
                address={event.address}
                points={event.price}
                onPress={() => {
                  setModalVisible(false);
                  setSearchText('');
                  navigation.navigate('EventDetails', {
                    title: event.name,
                    time: handleDateTime(event.startDateTime),
                    city: event.city,
                    address: event.address,
                    points: event.price,
                    description: event.description,
                  });
                }}
              />
            ))}
          </ScrollView>
        </View>
      </Modal>
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
    color: 'black',
  },
  viewAllText: {
    width: 14,
    height: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    justifyContent: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: '#fff',
    paddingBottom: 10,
  },
  searchInputModal: {
    flex: 1,
    height: 48,
    paddingHorizontal: 10,
    borderRadius: 40,
    fontSize: 16,
    borderColor: 'rgba(1, 59, 20, 1)',
    borderWidth: 2,
    marginRight: 10,
  },
  closeButton: {
    fontSize: 18,
    paddingVertical: 10,
  },
  historyItem: {
    padding: 10,
    marginLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignSelf: 'start',
    width: '75%',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
    historyIcon: {
        width: 20,
        height: 20,
    },
    historyText: {
        fontSize: 18,
        color: 'black',
    },
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

export default HomeScreen;
