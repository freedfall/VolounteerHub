import React, { useEffect, useState } from 'react';
import { View, PermissionsAndroid, Platform, Alert, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import LoadingBar from '../components/LoadingBar';

const MapScreen = () => {
  const [location, setLocation] = useState(null);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Grant Location Permission',
            message: 'Application needs access to your location.',
            buttonNeutral: 'Ask later',
            buttonNegative: 'Reject',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true;
    }
  };

  useEffect(() => {
    const getLocation = async () => {
      const hasPermission = await requestLocationPermission();

      if (!hasPermission) {
        Alert.alert('Permission denied', 'Unable to get geolocation.');
        return;
      }

      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        },
        (error) => {
          console.log(error);
          Alert.alert(`Error parsing geolocation: ${error.message}`);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          forceRequestLocation: true,
          showLocationDialog: true,
        },
      );
    };

    getLocation();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {location ? (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          initialRegion={location}
          showsUserLocation={true}
        />
      ) : (
        <LoadingBar />
      )}
    </View>
  );
};

export default MapScreen;
