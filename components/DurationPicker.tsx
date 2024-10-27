import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';

const DurationPicker = ({ hours, minutes, onChange }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const hourValues = Array.from({ length: 13 }, (_, i) => i); // массив от 0 до 12 часов
  const minuteValues = Array.from({ length: 12 }, (_, i) => i * 5); // массив от 0 до 59 минут

  const handleConfirm = () => {
    setModalVisible(false);
  };

  return (
    <View>
      {/* Кнопка для открытия модального окна */}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.selectButton}>
        <Text style={styles.selectButtonText}>
          {`Duration: ${hours}h ${minutes < 10 ? `0${minutes}` : minutes}m`}
        </Text>
      </TouchableOpacity>

      {/* Модальное окно */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickers}>
              {/* Скролл для часов */}
              <View style={styles.picker}>
                <Text style={styles.pickerLabel}>Hours</Text>
                <ScrollView
                  showsVerticalScrollIndicator={false}
//                   snapToAlignment="center"
                  snapToInterval={50} // Высота элемента
//                   decelerationRate="fast"
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

              {/* Скролл для минут */}
              <View style={styles.picker}>
                <Text style={styles.pickerLabel}>Minutes</Text>
                <ScrollView
                  showsVerticalScrollIndicator={false}
//                   snapToAlignment="center"
                  snapToInterval={50} // Высота элемента
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

            {/* Кнопка подтверждения */}
            <Button title="Confirm" onPress={handleConfirm} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selectButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  selectButtonText: {
    fontSize: 16,
    color: '#000',
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pickers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  picker: {
    flex: 1,
    alignItems: 'center',
    height: 300, // Высота контейнера скролла для отображения 6 элементов (6 * 50)
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
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
    color: '#888',
  },
  selectedItem: {
    backgroundColor: '#007BFF',
  },
  selectedItemText: {
    color: '#FFF',
  },
});

export default DurationPicker;
