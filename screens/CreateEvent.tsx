import React, { useState, useEffect, useCallback } from 'react';
import { View, Modal, StyleSheet, Button, Animated, Alert } from 'react-native';
import { useEventContext } from '../context/EventContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventForm from '../components/EventForm';

const CreateEventScreen: React.FC = () => {
  const { addEvent } = useEventContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [duration, setDuration] = useState({ hours: 0, minutes: 30 });
  const [maxPeople, setMaxPeople] = useState('');
  const [description, setDescription] = useState('');
  const [hasError, setHasError] = useState(false);
  const [addressFieldHeight] = useState(new Animated.Value(0));
  const [cityLocation, setCityLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [cityBounds, setCityBounds] = useState(null);

  useEffect(() => {
    validateForm();
  }, [date, startTime, maxPeople, title, city, address]);

  const validateForm = useCallback(() => {
    const currentDateTime = new Date();
    let errors = false;

    if (date < currentDateTime) errors = true;
    if (!title.trim() || !city.trim() || !address.trim()) errors = true;
    if (isNaN(parseInt(maxPeople)) || parseInt(maxPeople) <= 0 || parseInt(maxPeople) > 100) errors = true;

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


  const handleCreateEvent = async () => {
      const currentDateTime = new Date();
      if (date < currentDateTime) {
        Alert.alert('Invalid Date', 'The event date cannot be in the past.');
        return;
      }

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

      // Создаем конечное время события, добавляя общую длительность
      const eventEndTime = new Date(startDateTime);
      eventEndTime.setMinutes(eventEndTime.getMinutes() + totalDuration);

      // Форматируем даты для отправки на сервер
      const formattedStartTime = formatLocalTime(startDateTime);
      const formattedEndTime = formatLocalTime(eventEndTime);

      const newEvent = {
        name: title,
        description,
        city,
        address,
        startDateTime: formattedStartTime,
        endDateTime: formattedEndTime,
        capacity: parseInt(maxPeople),
      };

      try {
        const token = await AsyncStorage.getItem('userToken');

        console.log("New event", newEvent);
        console.log("Json stringify event: ", JSON.stringify(newEvent));

        const response = await fetch('https://fitexamprep.site/itu/api/event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(newEvent),
        });

        console.log("Response: ", response);

        if (response.ok) {
          const data = await response.json();
          Alert.alert('Success', 'Event created successfully');
        } else {
          const errorText = await response.text();
          console.error('Error creating event:', errorText);
          Alert.alert('Error', 'Failed to create event');
        }
      } catch (error) {
        console.error('Network error:', error);
        Alert.alert('Error', 'Network error occurred');
      }

      setModalVisible(false);
      setTitle('');
      setCity('');
      setAddress('');
      setDate(new Date());
      setStartTime(new Date());
      setEndTime(new Date());
      setMaxPeople('');
      setDescription('');
    };

return (
    <View style={styles.container}>
      <Button title="Create Event" onPress={() => setModalVisible(true)} />
      <Modal visible={modalVisible} animationType="slide">
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
        />
        <Button title="Close" onPress={() => setModalVisible(false)} />
      </Modal>
    </View>
  );
};

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 20,
    },
  });

  export default CreateEventScreen;