// components/EventForm.tsx
import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import LocationPicker from './LocationPicker';
import DateTimePickerWrapper from './DateTimePickerWrapper';
import DurationPicker from './DurationPicker';
import ImagePicker from './ImagePicker';

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
  cityLocation: any;
  cityBounds: any;
  handleCreateEvent: () => void;
  hasError: boolean;
  setShowDatePicker: (show: boolean) => void;
  setShowStartTimePicker: (show: boolean) => void;
  showDatePicker: boolean;
  showStartTimePicker: boolean;
  imageUri: string | null;
  setImageUri: (uri: string | null) => void;
  isUpdateMode?: boolean;
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
  imageUri,
  setImageUri,
  buttonText,
  isUpdateMode,
}) => {
  const formFields = [
    {
      key: 'title',
      label: 'Event Title',
      component: (
        <TextInput
          style={[styles.input]}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter event title"
        />
      ),
    },
    ...(!isUpdateMode
      ? [
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
        ]
      : []),
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
            label="Duration"
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
          {!isUpdateMode &&
          <View style={styles.imagePickerWrapper}>
            <Text style={styles.label}>Event Image</Text>
            <ImagePicker imageUri={imageUri} setImageUri={setImageUri} />
          </View>
          }
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
            <Text style={styles.buttonText}>{buttonText}</Text>
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
    paddingHorizontal: 25,
    color: 'black',
    borderRadius: 40,
    fontSize: 18,
  },
  inputError: {
    borderColor: 'red',
  },
  textArea: {
    height: 165,
    borderColor: '#013B14',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    textAlignVertical: 'top',
    fontSize: 18,
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
    marginLeft: 60,
  },
  imagePickerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    marginBottom: 0,
    alignSelf: 'center',
    fontSize: 18,
    color: 'black',
  },
});

export default EventForm;
