import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TextInput, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Card from '../components/Card';
import { handleDateTime } from '../utils/dateUtils';
import SearchBar from '../components/SearchBar';
import SearchModal from '../components/SearchModal';

type RootStackParamList = {
  CategoryDetails: { category: string; events: any[] };
};

type Props = NativeStackScreenProps<RootStackParamList, 'CategoryDetails'>;

const CategoryDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { category, events } = route.params;
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <SearchBar searchText={searchText} setSearchText={setSearchText} openModal={() => setModalVisible(true)} />
      <SearchModal
          isVisible={isModalVisible}
          closeModal={() => setModalVisible(false)}
          searchText={searchText}
          setSearchText={setSearchText}
          searchHistory={searchHistory}
          filteredEvents={filteredEvents}
          onSelectEvent={(event) => {
            setModalVisible(false);
            navigation.navigate('EventDetails', { ...event });
          }}
      />
      <Text style={styles.header}>{category}</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredEvents.map((event, index) => (
          <Card
            key={index}
            title={event.name}
            time={handleDateTime(event.startDateTime)}
            city={event.city}
            address={event.address}
            points={event.price}
            onPress={() => navigation.navigate('EventDetails', { ...event })}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f5f5f5' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, alignSelf: 'center', color: 'black' },
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
