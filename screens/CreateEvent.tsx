import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useEventContext } from '../context/EventContext';
import { calculateEventPoints } from '../utils/calculateEventPoints';
import 'react-native-get-random-values';

const GOOGLE_PLACES_API_KEY = 'AIzaSyDAjiDOE8glvLdp12DuWoDI82wH_AXfBSI';

const CreateEventScreen: React.FC = () => {
  const { addEvent } = useEventContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [endTime, setEndTime] = useState(new Date());
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [maxPeople, setMaxPeople] = useState('');
  const [description, setDescription] = useState('');

  const [addressFieldHeight] = useState(new Animated.Value(0));
  const [isCitySelected, setIsCitySelected] = useState(false);
  const [cityLocation, setCityLocation] = useState<{ lat: number, lng: number } | null>(null);

  const formatLocalTime = (time: Date): string => {
    // Преобразуем объект времени в строку формата 'yyyy-MM-ddTHH:mm:ss'
    const year = time.getFullYear();
    const month = String(time.getMonth() + 1).padStart(2, '0'); // Месяцы в JavaScript считаются с 0
    const day = String(time.getDate()).padStart(2, '0');
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`; // Формат LocalDateTime
  };

  const handleCreateEvent = async () => {
      const currentDateTime = new Date();
      if (date < currentDateTime) {
        Alert.alert('Invalid Date', 'The event date cannot be in the past.');
        return;
      }
      if (endTime <= startTime) {
        Alert.alert('Invalid Time', 'The end time must be after the start time.');
        return;
      }
      if (!city || !address) {
        Alert.alert('Invalid Location', 'You must provide a valid city and address.');
        return;
      }

      const formattedStartTime = formatLocalTime(startTime);
      const formattedEndTime = formatLocalTime(endTime);



      const points = calculateEventPoints(formattedStartTime);

      // Создаем объект события для отправки на сервер
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
        const response = await fetch('https://fitexamprep.site/itu/api/event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEvent),
        });

        console.log("New event", newEvent);
        console.log("Json stringify event: ", JSON.stringify(newEvent));
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

  const showDatepicker = () => setShowDatePicker(true);
  const showStartTimepicker = () => setShowStartTimePicker(true);
  const showEndTimepicker = () => setShowEndTimePicker(true);

  const handleCitySelect = (data: any, details: any) => {
    setCity(data.description);
    if (details && details.geometry) {
      setCityLocation(details.geometry.location);
    }
    setIsCitySelected(true);

    Animated.timing(addressFieldHeight, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Button title="Create Event" onPress={() => setModalVisible(true)} />
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.formContainer}>
          <Text style={styles.label}>Event Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter event title"
          />

          <Text style={styles.label}>City</Text>
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
              listView: styles.listView, // Стили для выпадающего списка
              container: styles.autoCompleteContainer, // Контейнер для автодополнения
            }}
          />

          {/* Поле с адресом, скрыто до выбора города */}
          <Animated.View style={{ opacity: addressFieldHeight }}>
            {cityLocation && (
              <>
                <Text style={styles.label}>Address</Text>
                <GooglePlacesAutocomplete
                  placeholder="Enter address"
                  fetchDetails={true}
                  onPress={(data, details = null) => {
                    setAddress(data.description);
                  }}
                  query={{
                    key: GOOGLE_PLACES_API_KEY,
                    language: 'en',
                    types: 'address',
                    location: cityLocation,
                    radius: 50000,
                    components: 'country:CZ',
                  }}
                  styles={{
                    textInput: styles.input,
                    listView: styles.listView, // Стили для выпадающего списка
                    container: styles.autoCompleteContainer, // Контейнер для автодополнения
                  }}
                />
              </>
            )}
          </Animated.View>

          <Text style={styles.label}>Date</Text>
          <TouchableOpacity onPress={showDatepicker} style={styles.input}>
            <Text>{date.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          )}

          <Text style={styles.label}>Start Time</Text>
          <TouchableOpacity onPress={showStartTimepicker} style={styles.input}>
            <Text>{`${startTime.getHours()}:${startTime.getMinutes()}`}</Text>
          </TouchableOpacity>
          {showStartTimePicker && (
            <DateTimePicker
              value={startTime}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowStartTimePicker(false);
                if (selectedTime) {
                  setStartTime(selectedTime);
                }
              }}
            />
          )}

          <Text style={styles.label}>End Time</Text>
          <TouchableOpacity onPress={showEndTimepicker} style={styles.input}>
            <Text>{`${endTime.getHours()}:${endTime.getMinutes()}`}</Text>
          </TouchableOpacity>
          {showEndTimePicker && (
            <DateTimePicker
              value={endTime}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowEndTimePicker(false);
                if (selectedTime) {
                  setEndTime(selectedTime);
                }
              }}
            />
          )}

          <Text style={styles.label}>Max People</Text>
          <TextInput
            style={styles.input}
            value={maxPeople}
            onChangeText={setMaxPeople}
            keyboardType="numeric"
            placeholder="Enter max number of people"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description"
            multiline
            maxLength={500}
          />

          <TouchableOpacity style={styles.button} onPress={handleCreateEvent}>
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    marginBottom: 15,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  textArea: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 100,
    marginBottom: 15,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  listView: {
    minHeight: 200, // Ограничиваем высоту выпадающего списка
    borderWidth: 1,
    borderColor: '#ccc',
  },
  autoCompleteContainer: {
    flex: 1,
    zIndex: 1, // Поднятие контейнера для выпадающего списка над другими элементами
    marginBottom: 40,
    backgroundColor: 'black',
  },
});

export default CreateEventScreen;
