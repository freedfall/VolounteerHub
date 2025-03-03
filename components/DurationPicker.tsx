import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';

const DurationPicker = ({ label, hours, minutes, onChange }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const hourValues = Array.from({ length: 13 }, (_, i) => i);
  const minuteValues = Array.from({ length: 12 }, (_, i) => i * 5);

  const handleConfirm = () => {
    setModalVisible(false);
  };

  return (
    <View>
        <Text style={styles.label}>{label}</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.selectButton}>
        <Text style={styles.selectButtonText}>
          {`${hours}h ${minutes < 10 ? `0${minutes}` : minutes}m`}
        </Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent={true} animationType="slide" style={styles.modalContainer}>
        <View style={styles.modalContainer}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickers}>

              <View style={styles.picker}>
                <Text style={styles.pickerLabel}>Hours</Text>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  snapToInterval={50}
                  contentContainerStyle={styles.scrollContainer}
                >
                  {hourValues.map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      onPress={() => onChange(hour, 'hours')}
                      style={[
                        styles.item,
                        hours === hour && styles.selectedItem,
                      ]}
                    >
                      <Text style={[
                        styles.itemText,
                        hours === hour && styles.selectedItemText,
                      ]}>
                        {hour}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.picker}>
                <Text style={styles.pickerLabel}>Minutes</Text>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  snapToInterval={50}
                  decelerationRate="fast"
                  contentContainerStyle={styles.scrollContainer}
                >
                  {minuteValues.map((minute) => (
                    <TouchableOpacity
                      key={minute}
                      onPress={() => onChange(minute, 'minutes')}
                      style={[
                        styles.item,
                        minutes === minute && styles.selectedItem,
                      ]}
                    >
                      <Text style={[
                        styles.itemText,
                        minutes === minute && styles.selectedItemText,
                      ]}>
                        {minute < 10 ? `0${minute}` : minute}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectButton: {
    borderColor: '#013B14',
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 40,
    marginBottom: 10,
  },
  selectButtonText: {
    fontSize: 16,
    color: '#838383',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    alignSelf: 'center',
    width: '70%',
  },
  label: {
    marginBottom: 5,
    alignSelf: 'center',
    color: '#000',
    fontSize: 18,
  },
  pickers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  picker: {
    flex: 1,
    alignItems: 'center',
    height: 300,
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#000',
  },
  scrollContainer: {
    alignItems: 'center',
  },
  item: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  itemText: {
    fontSize: 18,
    color: '#000',
  },
  selectedItem: {
    backgroundColor: '#69B67E',
  },
  selectedItemText: {
    color: '#FFF',
  },
  confirmButton: {
    width: 100,
    borderRadius: 40,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#69B67E',
  },
  confirmButtonText: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 18,
  },
});

export default DurationPicker;
