import React, { useEffect, useState, useRef, useContext } from 'react';
import { View, PermissionsAndroid, Platform, Alert, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Region } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { useEventContext } from '../context/EventContext';
import { parseCoordinates } from '../utils/geocode';
import haversine from 'haversine';
import Card from '../components/Card';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { handleDateTime } from '../utils/dateUtils';

type Event = {
  id: string;
  title: string;
  time: string;
  city: string;
  address: string;
  points: number;
  description: string;
  creator: string;
  imageURL?: string;
  coordinates: string;
};

const MapScreen = () => {
  const { user } = useContext(AuthContext);
  const { events } = useEventContext();
  const [location, setLocation] = useState<Region | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [nearestEvent, setNearestEvent] = useState<Event | null>(null);
  const mapRef = useRef<MapView>(null);
  const navigation = useNavigation();

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
        setLoading(false);
        return;
      }

      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          setLocation({
            latitude,
            longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
          console.log('Location:', position);
          setLoading(false);
        },
        (error) => {
          console.log(error);
          Alert.alert(`Error parsing geolocation: ${error.message}`);
          setLoading(false);
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

  useEffect(() => {
    if (location && events.length > 0) {
      let minDistance = Infinity;
      let closestEvent: Event | null = null;

      events.forEach(event => {
        const eventCoords = parseCoordinates(event.coordinates);
        const distance = haversine(
          { latitude: location.latitude, longitude: location.longitude },
          { latitude: eventCoords.latitude, longitude: eventCoords.longitude },
          { unit: 'meter' }
        ) || Infinity;

        if (distance < minDistance) {
          minDistance = distance;
          closestEvent = event;
        }
      });

      setNearestEvent(closestEvent);
    }
  }, [location, events]);

  useEffect(() => {
    if (nearestEvent && mapRef.current) {
      const coords = parseCoordinates(nearestEvent.coordinates);
      mapRef.current.animateToRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 1000);
    }
  }, [nearestEvent]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4caf50" />
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.loader}>
        <Text>Unable to get location</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={location}
        showsUserLocation={true}
      >
        {events.map(event => {
          const coords = parseCoordinates(event.coordinates);
          const isCreator = (event.creator.id == user.id)
          const color = isCreator ? "aqua" : "#69B67E"
          return (
            <Marker
              key={event.id}
              coordinate={{ latitude: coords.latitude, longitude: coords.longitude }}
              title={event.title}
              description={event.description}
              pinColor={color}
            >
              <Callout tooltip onPress={() => { navigation.navigate('EventDetails', { ...event }); }}>
                <View style={styles.calloutContainer}>
                  <Card
                      key={event.id}
                      title={event.name}
                      time={handleDateTime(event.startDateTime)}
                      city={event.city}
                      address={event.address}
                      points={event.price}
                      imageURL={event.imageURL}
                      onPress={() => navigation.navigate('EventDetails', { ...event })}
                    />
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calloutContainer: {
    width: 350,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 15,
  },
});

export default MapScreen;
