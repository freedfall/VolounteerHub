// DateTimePickerWrapper.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const formatDisplayValue = (value, mode) => {
  if (mode === 'date') {
    return value.toLocaleDateString();
  } else if (mode === 'time') {
    return value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return value.toString();
};

const DateTimePickerWrapper = ({ label, value, showPicker, setShowPicker, onChange, mode }) => {
  return (
    <View>
      <Text style={styles.title}>{label}</Text>
      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.input}>
        <Text>{formatDisplayValue(value, mode)}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={value}
          mode={mode}
          display="default"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) {
              onChange(selectedDate);
            }
          }}
        />
      )}
    </View>
  );
};

const styles = {
    title: {
        marginBottom: 5,
        alignSelf: 'center',
        color: '#000',
        fontSize: 18,
    },
  input: {
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    marginBottom: 10,
  },
};

export default DateTimePickerWrapper;
