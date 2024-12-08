import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import LocationPicker from './LocationPicker';
import DateTimePickerWrapper from './DateTimePickerWrapper';
import DurationPicker from './DurationPicker';

const EventForm = ({
  title,
  setTitle,
  setCity,
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
  showDatePicker,
  showStartTimePicker,
}) => {
  const formFields = [
    {
      key: 'title',
      label: 'Event Title',
      component: (
        <TextInput
          style={[styles.input, !title.trim() && styles.inputError]}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter event title"
        />
      ),
    },
    {
      key: 'locationPicker',
      label: '',
      component: (
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
      ),
    },
    {
      key: 'datePicker',
      label: '',
      component: (
        <DateTimePickerWrapper
          label="Date"
          value={date}
          showPicker={showDatePicker}
          setShowPicker={setShowDatePicker}
          onChange={setDate}
          mode="date"
        />
      ),
    },
    {
      key: 'timePicker',
      label: '',
      component: (
        <DateTimePickerWrapper
          label="Start Time"
          value={startTime}
          showPicker={showStartTimePicker}
          setShowPicker={setShowStartTimePicker}
          onChange={setStartTime}
          mode="time"
        />
      ),
    },
    {
      key: 'durationPicker',
      label: '',
      component: <DurationPicker hours={duration.hours} minutes={duration.minutes} onChange={handleDurationChange} />,
    },
    {
      key: 'maxPeople',
      label: 'Max People',
      component: (
        <TextInput
          style={[styles.input, (parseInt(maxPeople) <= 0 || parseInt(maxPeople) > 100) && styles.inputError]}
          value={maxPeople}
          onChangeText={setMaxPeople}
          keyboardType="numeric"
          placeholder="Enter max number of people"
        />
      ),
    },
    {
      key: 'description',
      label: 'Description',
      component: (
        <TextInput
          style={styles.textArea}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
          multiline
          maxLength={500}
        />
      ),
    },
    {
      key: 'createButton',
      label: '',
      component: (
        <TouchableOpacity
          style={[styles.button, hasError && styles.buttonDisabled]}
          onPress={handleCreateEvent}
          disabled={hasError}
        >
          <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>
      ),
    },
  ];

  return (
    <FlatList
      data={formFields}
      renderItem={({ item }) => (
        <View key={item.key} style={styles.formField}>
          {item.label ? <Text style={styles.titleText}>{item.label}</Text> : null}
          {item.component}
        </View>
      )}
      keyExtractor={(item) => item.key}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 5,
  },
  formField: {
    marginBottom: 15,
  },
  titleText: {
    fontSize: 18,
    marginBottom: 5,
    color: '#000',
    alignSelf: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 20,
    color: '#000',
    borderRadius: 25,
  },
  inputError: {
    borderColor: 'red',
  },
  textArea: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
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
