// screens/CreateEventScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert, Platform, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventForm from '../components/EventForm';
import { geocodeAddress } from '../utils/geocode';
import { useRoute, useNavigation } from '@react-navigation/native';
import { adminUpdateEventDetails, fetchEvents } from '../utils/api';
import { useEventContext } from '../context/EventContext';

const CreateEventScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { setEvents } = useEventContext();

  const event = route.params?.event;
  const isUpdateMode = !!event;

  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [duration, setDuration] = useState({ hours: 0, minutes: 30 });
  const [maxPeople, setMaxPeople] = useState('');
  const [description, setDescription] = useState('');
  const [hasError, setHasError] = useState(false);
  const [addressFieldHeight] = useState(new Animated.Value(0));
  const [cityLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [cityBounds] = useState<any>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    if (isUpdateMode && event) {
      setTitle(event.name);
      setCity(event.city);
      setAddress(event.address);
      setMaxPeople(String(event.capacity));
      setDescription(event.description);

      const start = new Date(event.startDateTime);
      const end = new Date(event.endDateTime);
      setDate(start);
      setStartTime(start);

      const diffMs = end - start;
      const diffMins = diffMs / 60000;
      const hours = Math.floor(diffMins / 60);
      const minutes = diffMins % 60;
      setDuration({ hours, minutes });
    }
  }, [isUpdateMode, event]);

  useEffect(() => {
    validateForm();
  }, [date, startTime, maxPeople, title, city, address]);

  const reloadEvents = async () => {
      try {
        const data = await fetchEvents();
        if (data) {
          setEvents(data);
        }
      } catch (error) {
        console.error('Failed to reload events:', error);
      }
    };

  const validateForm = useCallback(() => {
    const currentDateTime = new Date();
    let errors = false;

    const startDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      startTime.getHours(),
      startTime.getMinutes()
    );

    if (startDateTime < currentDateTime) {
      errors = true;
    }

    if (!title.trim() || !city.trim() || !address.trim()) {errors = true;}
    if (isNaN(parseInt(maxPeople)) || parseInt(maxPeople) <= 0 || parseInt(maxPeople) > 100) {errors = true;}

    setHasError(errors);
  }, [date, title, city, address, maxPeople]);

  const formatLocalTime = (time: Date): string => {
    const year = time.getFullYear();
    const month = String(time.getMonth() + 1).padStart(2, '0');
    const day = String(time.getDate()).padStart(2, '0');
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const getImageUri = (uri: string) => {
    if (Platform.OS === 'android' && !uri.startsWith('file://')) {
      return `file://${uri}`;
    }
    return uri;
  };

  const prepareEventData = () => {
    const startDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      startTime.getHours(),
      startTime.getMinutes()
    );

    const totalDuration = duration.hours * 60 + duration.minutes;
    const eventEndTime = new Date(startDateTime);
    eventEndTime.setMinutes(eventEndTime.getMinutes() + totalDuration);

    const formattedStartTime = formatLocalTime(startDateTime);
    const formattedEndTime = formatLocalTime(eventEndTime);

    return {
      name: title,
      description: description,
      city: city,
      address: address,
      startDateTime: formattedStartTime,
      endDateTime: formattedEndTime,
      capacity: parseInt(maxPeople, 10),
    };
  };

  const handleCreateEvent = async () => {

    if (!city || !address) {
      Alert.alert('Invalid Location', 'You must provide a valid city and address.');
      return;
    }

    const startDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      startTime.getHours(),
      startTime.getMinutes()
    );

    const totalDuration = duration.hours * 60 + duration.minutes;

    const eventEndTime = new Date(startDateTime);
    eventEndTime.setMinutes(eventEndTime.getMinutes() + totalDuration);

    const formattedStartTime = formatLocalTime(startDateTime);
    const formattedEndTime = formatLocalTime(eventEndTime);

    const fullAddress = `${city}, ${address}`;
    const coords = await geocodeAddress(fullAddress);

    if (!coords) {
      Alert.alert('Invalid Location', 'The provided address could not be geocoded.');
      return;
    }

    console.log('coords:', coords);

    const newEvent = {
      name: title,
      description,
      city,
      address,
      startDateTime: formattedStartTime,
      endDateTime: formattedEndTime,
      capacity: parseInt(maxPeople),
      coordinates: `${coords.latitude},${coords.longitude}`,
    };

    try {
      const token = await AsyncStorage.getItem('userToken');

      const response = await fetch('https://itu-215076752298.europe-central2.run.app/api/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newEvent),
      });

      console.log('First Response Status:', response.status);
      const firstResponseBody = await response.text();
      console.log('First Response Body:', firstResponseBody);

      if (response.ok) {
        const eventId = firstResponseBody;

        Alert.alert('Success', 'Event created successfully');

        if (imageUri) {
          const formData = new FormData();
          const uriParts = imageUri.split('.');
          const fileType = uriParts[uriParts.length - 1].toLowerCase();

          formData.append('image', {
            uri: getImageUri(imageUri),
            name: `image.${fileType}`,
            type: `image/${fileType === 'jpg' ? 'jpeg' : fileType}`,
          });

          const uploadResponse = await fetch(`https://itu-215076752298.europe-central2.run.app/api/event/${eventId}/upload-image`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: formData,
          });

          console.log('Image Upload Response Status:', uploadResponse.status);
          const uploadResponseBody = await uploadResponse.text();
          console.log('Image Upload Response Body:', uploadResponseBody);

          if (uploadResponse.ok) {
            console.log('Image uploaded successfully');
          } else {
            console.error('Error uploading image:', uploadResponseBody);
          }
        }
        await reloadEvents();
        onClose();
      } else {
        console.error('Error creating event:', firstResponseBody);
        Alert.alert('Error', `Failed to create event: ${firstResponseBody}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      Alert.alert('Error', 'Network error occurred');
    }

    setTitle('');
    setCity('');
    setAddress('');
    setDate(new Date());
    setStartTime(new Date());
    setDuration({ hours: 0, minutes: 30 });
    setMaxPeople('');
    setDescription('');
    setImageUri(null);
  };

  const onClose = () => {
    navigation.goBack();
  }

  const handleUpdateEvent = async () => {
    const updatedEventData = prepareEventData();

    try {
      await adminUpdateEventDetails(event.id, updatedEventData);
      await reloadEvents();
      Alert.alert('Success', 'Event details updated successfully');
    } catch (error) {
      console.error('Network error:', error);
      Alert.alert('Error', 'Network error occurred');
    }

    onClose();
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>

      <EventForm
        title={title}
        setTitle={setTitle}
        city={city}
        setCity={setCity}
        address={address}
        setAddress={setAddress}
        date={date}
        setDate={setDate}
        startTime={startTime}
        setStartTime={setStartTime}
        duration={duration}
        handleDurationChange={(value, type) => {
          setDuration((prevState) => ({ ...prevState, [type]: value }));
        }}
        maxPeople={maxPeople}
        setMaxPeople={setMaxPeople}
        description={description}
        setDescription={setDescription}
        addressFieldHeight={addressFieldHeight}
        cityLocation={cityLocation}
        cityBounds={cityBounds}
        handleCreateEvent={handleCreateEvent}
        hasError={hasError}
        setShowDatePicker={setShowDatePicker}
        setShowStartTimePicker={setShowStartTimePicker}
        showDatePicker={showDatePicker}
        showStartTimePicker={showStartTimePicker}
        imageUri={imageUri}
        setImageUri={setImageUri}
        isUpdateMode={isUpdateMode}
        handleCreateEvent={isUpdateMode ? handleUpdateEvent : handleCreateEvent}
        buttonText={isUpdateMode ? 'Update' : 'Create'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 10,
    zIndex: 10,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 30,
    color: '#000',
  },
});

export default CreateEventScreen;
