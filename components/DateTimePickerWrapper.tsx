// DateTimePickerWrapper.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const formatDisplayValue = (value, mode) => {
  if (mode === 'date') {
    return value.toLocaleDateString(); // Форматируем только дату
  } else if (mode === 'time') {
    return value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Форматируем только время
  }
  return value.toString();
};

const DateTimePickerWrapper = ({ label, value, showPicker, setShowPicker, onChange, mode }) => {
  return (
    <View>
      <Text>{label}</Text>
      <TouchableOpacity onPress={() => setShowPicker(true)} style={{ padding: 10, borderColor: '#ccc', borderWidth: 1, marginBottom: 15}}>
        <Text>{formatDisplayValue(value, mode)}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={value}
          mode={mode} // Передаем режим выбора (date или time)
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

export default DateTimePickerWrapper;
