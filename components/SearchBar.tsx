import React, { useRef } from 'react';
import { View, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import searchIcon from '../images/components/searchIcon.png';
import filterIcon from '../images/components/filterIcon.png';

type Props = {
  searchText: string;
  setSearchText: (text: string) => void;
  openFiltersModal: () => void;
  openSearchModal: () => void;
  hasActiveFilters: boolean;
  isSearchingEvents: boolean;
};

const SearchBar: React.FC<Props> = ({ searchText, setSearchText, openFiltersModal, openSearchModal, hasActiveFilters, isSearchingEvents }) => {
  const searchInputRef = useRef<TextInput>(null);

  return (
    <View style={styles.searchContainer}>
      <Image source={searchIcon} style={styles.searchIcon} />
      <TextInput
        ref={searchInputRef}
        style={styles.searchInput}
        placeholder="Search..."
        value={searchText}
        onPressIn={openSearchModal}
        onFocus={() => {
          searchInputRef.current?.blur();
        }}
        onChangeText={setSearchText}
      />
      {isSearchingEvents &&
          <TouchableOpacity style={styles.filterButton} onPress={openFiltersModal}>
            <Image source={filterIcon} style={styles.filterIcon} />
            {hasActiveFilters && <View style={styles.activeIndicator}/>}
          </TouchableOpacity>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 40,
    borderColor: 'rgba(1, 59, 20, 1)',
    borderWidth: 2,
    paddingHorizontal: 15,
    height: 48,
    marginBottom: 20,
    width: '94%',
    alignSelf: 'center',
  },
  searchIcon: {
    width: 22,
    height: 23,
    tintColor: '#888',
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 20,
    color: 'rgba(131, 131, 131, 1)',
    width: '100%',
  },
  filterButton: {
    padding: 8,
    position: 'relative',
  },
  filterIcon: {
    width: 24,
    height: 24,
    tintColor: '#888',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 50,
    backgroundColor: '#69B67E',
  }
});

export default SearchBar;
