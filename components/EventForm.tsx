// components/EventForm.tsx
import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import LocationPicker from './LocationPicker';
import DateTimePickerWrapper from './DateTimePickerWrapper';
import DurationPicker from './DurationPicker';
import ImagePicker from './ImagePicker'; // Импортируем ImagePicker

interface EventFormProps {
  title: string;
  setTitle: (title: string) => void;
  setCity: (city: string) => void;
  setAddress: (address: string) => void;
  date: Date;
  setDate: (date: Date) => void;
  startTime: Date;
  setStartTime: (time: Date) => void;
  duration: { hours: number; minutes: number };
  handleDurationChange: (duration: { hours: number; minutes: number }) => void;
  maxPeople: string;
  setMaxPeople: (max: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  addressFieldHeight: number;
  cityLocation: any; // Замените `any` на соответствующий тип
  cityBounds: any; // Замените `any` на соответствующий тип
  handleCreateEvent: () => void;
  hasError: boolean;
  setShowDatePicker: (show: boolean) => void;
  setShowStartTimePicker: (show: boolean) => void;
  showDatePicker: boolean;
  showStartTimePicker: boolean;
  imageUri: string | null; // Добавляем пропс для imageUri
  setImageUri: (uri: string | null) => void; // Добавляем пропс для setImageUri
}

const EventForm: React.FC<EventFormProps> = ({
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
  imageUri, // Принимаем imageUri
  setImageUri, // Принимаем setImageUri
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
          }}
          onAddressSelect={setAddress}
          addressFieldHeight={addressFieldHeight}
          cityLocation={cityLocation}
          cityBounds={cityBounds}
        />
      ),
    },
    {
      key: 'dateTimeDuration',
      label: '',
      component: (
        <View style={styles.rowContainer}>
          <DateTimePickerWrapper
            label="Date"
            value={date}
            showPicker={showDatePicker}
            setShowPicker={setShowDatePicker}
            onChange={setDate}
            mode="date"
            containerStyle={styles.pickerContainer}
          />
          <DateTimePickerWrapper
            label="Start Time"
            value={startTime}
            showPicker={showStartTimePicker}
            setShowPicker={setShowStartTimePicker}
            onChange={setStartTime}
            mode="time"
            containerStyle={styles.pickerContainer}
          />
          <DurationPicker
            hours={duration.hours}
            minutes={duration.minutes}
            onChange={handleDurationChange}
            containerStyle={styles.pickerContainer}
          />
        </View>
      ),
    },
    {
      key: 'maxPeopleImagePicker',
      label: '',
      component: (
        <View style={styles.rowContainer}>
          <View style={styles.pickerWrapper}>
            <Text style={styles.label}>Max People</Text>
            <TextInput
              style={[
                styles.maxPeople,
                (parseInt(maxPeople) <= 0 || parseInt(maxPeople) > 100) && styles.inputError,
              ]}
              value={maxPeople}
              onChangeText={setMaxPeople}
              keyboardType="numeric"
              placeholder="0-100"
            />
          </View>
          <View style={styles.imagePickerWrapper}>
            <ImagePicker imageUri={imageUri} setImageUri={setImageUri} />
          </View>
        </View>
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
  },
  formField: {
    marginBottom: 15,
  },
  titleText: {
    fontSize: 18,
    marginBottom: 5,
    color: '#000',
    paddingHorizontal: 20,
  },
  input: {
    height: 48,
    borderColor: '#013B14',
    borderWidth: 1,
    paddingHorizontal: 20,
    color: '#000',
    borderRadius: 40,
    fontSize: 18,
  },
  maxPeople: {
    height: 48,
    borderColor: '#013B14',
    borderWidth: 1,
    paddingHorizontal: 20,
    color: '#000',
    borderRadius: 40,
    fontSize: 18,
    width: 100,
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
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#013B14',
    width: 212,
    alignSelf: 'center',
    padding: 15,
    borderRadius: 40,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerContainer: {
    flex: 1,
    marginRight: 10,
  },
  durationPickerContainer: {
    flex: 1,
    marginLeft: 10,
  },
  pickerWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginRight: 10,
  },
  imagePickerWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    marginTop: 5,
    fontSize: 14,
    color: '#333',
  },
});

export default EventForm;
