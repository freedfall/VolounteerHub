// ../components/LocationPicker.js

import React, { useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';

const GOOGLE_PLACES_API_KEY = 'AIzaSyDAjiDOE8glvLdp12DuWoDI82wH_AXfBSI';

const LocationPicker = ({ onCitySelect, onAddressSelect, addressFieldHeight, cityLocation, cityBounds }) => {
  const [isCitySelected, setIsCitySelected] = useState(false);

  const handleCitySelect = (data, details) => {
    const cityName = data.terms[0].value;
    setIsCitySelected(true);
    if (details && details.geometry) {
      const { lat, lng } = details.geometry.location;
      onCitySelect(cityName, { lat, lng });
    }

    Animated.timing(addressFieldHeight, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
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

      {isCitySelected && (
        <Animated.View style={{ opacity: addressFieldHeight }}>
          <Text style={styles.title}>Address</Text>
          <GooglePlacesAutocomplete
            placeholder="Enter address"
            fetchDetails={true}
            onPress={(data, details) => onAddressSelect(data.description)}
            query={{
              key: GOOGLE_PLACES_API_KEY,
              language: 'en',
              types: 'address',
//               locationbias: `circle:20000@${cityLocation.lat},${cityLocation.lng}`,
            }}
            styles={{
              textInput: styles.input,
              listView: styles.listView,
              container: styles.autoCompleteContainer,
            }}
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = {
    title: {
        fontSize: 18,
        marginBottom: 5,
        color: '#000',
        alignSelf: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    listView: {
        marginTop: 40,
        minHeight: 200,
        borderWidth: 1,
        borderColor: '#ccc',
        zIndex: 1000,
    },
    autoCompleteContainer: {
        backgroundColor: '#fff',
        flex: 1,
        zIndex: 1,
        marginBottom: 60,
    },
};

export default LocationPicker;
