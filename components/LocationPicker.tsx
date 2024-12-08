import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';

const GOOGLE_PLACES_API_KEY = 'AIzaSyDAjiDOE8glvLdp12DuWoDI82wH_AXfBSI';

const LocationPicker = ({ onCitySelect, onAddressSelect }) => {
  const [isCitySelected, setIsCitySelected] = useState(false);
  const [cityLocation, setCityLocation] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');

  const handleCitySelect = (data, details) => {
    const cityName = data.terms[0].value;
    setIsCitySelected(true);
    setSelectedCity(cityName);

    if (details && details.geometry) {
      const { lat, lng } = details.geometry.location;
      setCityLocation({ lat, lng });
      onCitySelect(cityName, { lat, lng });
    }
  };

  const filterAddresses = (data) => {
    return data.filter((item) => item.description.includes(selectedCity));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>City</Text>
      <GooglePlacesAutocomplete
        placeholder="Enter city"
        fetchDetails={true}
        onPress={handleCitySelect}
        query={{
          key: GOOGLE_PLACES_API_KEY,
          language: 'en',
          types: '(cities)',
          components: 'country:CZ',
        }}
        styles={{
          textInput: styles.input,
          listView: styles.listView,
          container: styles.autoCompleteContainer,
        }}
      />

      {isCitySelected && cityLocation && (
        <View>
          <Text style={styles.title}>Address</Text>
          <GooglePlacesAutocomplete
            placeholder="Enter address"
            fetchDetails={true}
            onPress={(data, details) => onAddressSelect(data.description)}
            query={{
              key: GOOGLE_PLACES_API_KEY,
              language: 'en',
              types: 'address',
              location: `${cityLocation.lat},${cityLocation.lng}`,
              radius: 20000,
              components: 'country:CZ',
            }}
            styles={{
              textInput: styles.input,
              listView: styles.listView,
              container: styles.autoCompleteContainer,
            }}
            onFail={(error) => console.error(error)}
            predefinedPlacesAlwaysVisible={false}
            filterReverseGeocodingByTypes={['street_address']}
            renderRow={(data) => {
              const filteredData = filterAddresses([data])[0];
              return filteredData ? (
                <Text style={styles.listItem}>{filteredData.description}</Text>
              ) : null;
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = {
  title: {
    fontSize: 18,
    marginBottom: 5,
    color: '#000',
    paddingHorizontal: 20,
  },
  input: {
    height: 50,
    borderColor: '#013B14',
    borderWidth: 1,
    borderRadius: 40,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 18,
  },
  listView: {
    minHeight: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    zIndex: 1000,
  },
  listItem: {
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  autoCompleteContainer: {
    backgroundColor: '#fff',
    flex: 1,
    zIndex: 1,
    marginBottom: 0,
  },
};

export default LocationPicker;
