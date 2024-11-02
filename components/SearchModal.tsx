import React, { useRef } from 'react';
import { View, TextInput, Image, TouchableOpacity, Modal, ScrollView, Text, StyleSheet } from 'react-native';
import Card from './Card';
import clockIcon from '../images/components/clock.png';
import searchIcon from '../images/components/searchIcon.png';
import filterIcon from '../images/components/filterIcon.png';
import { handleDateTime } from '../utils/dateUtils';

type Props = {
  isVisible: boolean;
  closeModal: () => void;
  searchText: string;
  setSearchText: (text: string) => void;
  searchHistory: string[];
  filteredEvents: any[];
  onSelectEvent: (event: any) => void;
};

const SearchModal: React.FC<Props> = ({ isVisible, closeModal, searchText, setSearchText, searchHistory, filteredEvents, onSelectEvent }) => {
  const modalSearchInputRef = useRef<TextInput>(null);

  return (
    <Modal animationType="slide" transparent={false} visible={isVisible} onRequestClose={closeModal}>
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <View style={styles.searchContainerModal}>
            <Image source={searchIcon} style={styles.searchIcon} />
            <TextInput
              ref={modalSearchInputRef}
              style={styles.searchInputModal}
              placeholder="Search..."
              value={searchText}
              onChangeText={setSearchText}
              autoFocus={true}
            />
            <TouchableOpacity style={styles.filterButton} onPress={() => console.log("Open filters")}>
              <Image source={filterIcon} style={styles.filterIcon} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={closeModal}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.historyContainer} showsVerticalScrollIndicator={false}>
          {searchText.trim() === '' && searchHistory.map((query, index) => (
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
              onPress={() => onSelectEvent(event)}
            />
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center'
  },
  modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
      backgroundColor: '#fff'
  },
  searchContainerModal: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 40,
      borderColor: 'rgba(1, 59, 20, 1)',
      borderWidth: 2,
      paddingHorizontal: 15,
      height: 48,
      marginBottom: 20,
      width: '85%',
  },
  searchInputModal: {
    flex: 1,
    fontSize: 16,
    color: 'rgba(131, 131, 131, 1)',
    width: '100%',
  },
  searchIcon: {
      width: 22,
      height: 23,
      tintColor: '#888',
      marginRight: 5,
  },
  filterIcon: {
      width: 24,
      height: 24,
      tintColor: '#888',
  },
  closeButton: {
      fontSize: 18,
      paddingVertical: 10,
      fontWeight: 'bold',
      color: 'black'
  },
  historyContainer: {
      alignSelf: 'center',
      width: '85%',
  },
  historyItem: {
      flexDirection: 'row',
      padding: 10,
      alignItems: 'center'
  },
  historyIcon: {
      width: 20,
      height: 20,
  },
  historyText: {
      fontSize: 18,
      color: 'black',
      marginLeft: 10,
  },
});

export default SearchModal;
