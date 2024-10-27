import React from 'react';
import { View, ScrollView, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LocationPicker from './LocationPicker';
import DateTimePickerWrapper from './DateTimePickerWrapper';
import DurationPicker from './DurationPicker';

const EventForm = ({
  title,
  setTitle,
  city,
  setCity,
  address,
  setAddress,
  date,
  setDate,
  startTime,
  setStartTime,
  duration,
  handleDurationChange,
  maxPeople,
  setMaxPeople,
  description,
  setDescription,
  addressFieldHeight,
  cityLocation,
  cityBounds,
  handleCreateEvent,
  hasError,
  setShowDatePicker,
  setShowStartTimePicker,
  showDatePicker, // добавлено для использования внутри DateTimePickerWrapper
  showStartTimePicker, // добавлено для использования внутри DateTimePickerWrapper
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Event Title</Text>
      <TextInput
        style={[styles.input, !title.trim() && styles.inputError]}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter event title"
      />

      <LocationPicker
        onCitySelect={(cityName, location) => {
          setCity(cityName);
          cityLocation = location;
        }}
        onAddressSelect={setAddress}
        addressFieldHeight={addressFieldHeight}
        cityLocation={cityLocation}
        cityBounds={cityBounds}
      />

      <DateTimePickerWrapper
        label="Date"
        value={date}
        showPicker={showDatePicker}
        setShowPicker={setShowDatePicker}
        onChange={setDate}
        mode="date"
      />

      <DateTimePickerWrapper
        label="Start Time"
        value={startTime}
        showPicker={showStartTimePicker}
        setShowPicker={setShowStartTimePicker}
        onChange={setStartTime}
        mode="time"
      />

      <DurationPicker hours={duration.hours} minutes={duration.minutes} onChange={handleDurationChange} />

      <Text style={styles.titleText}>Max People</Text>
      <TextInput
        style={[styles.input, (parseInt(maxPeople) <= 0 || parseInt(maxPeople) > 100) && styles.inputError]}
        value={maxPeople}
        onChangeText={setMaxPeople}
        keyboardType="numeric"
        placeholder="Enter max number of people"
      />

      <Text style={styles.titleText}>Description</Text>
      <TextInput
        style={styles.textArea}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
        multiline
        maxLength={500}
      />

      <TouchableOpacity style={[styles.button, hasError && styles.buttonDisabled]} onPress={handleCreateEvent} disabled={hasError}>
        <Text style={styles.buttonText}>Create</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  titleText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    color: '#000',
  },
  inputError: {
    borderColor: 'red',
  },
  textArea: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default EventForm;
