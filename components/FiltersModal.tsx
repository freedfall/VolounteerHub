import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

const FiltersModal = ({ isVisible, onClose, onApply, onClear, currentFilters, currentSorting, events }) => {
  const [filters, setFilters] = useState(currentFilters);
  const [sorting, setSorting] = useState(currentSorting);

  useEffect(() => {
    setFilters(currentFilters);
    setSorting(currentSorting);
  }, [currentFilters, currentSorting]);

  const cities = Array.from(new Set(events.map((event) => event.city)));
  const ratings = [3, 4.2, 5];
  const durationPresets = [
    { key: 'less2h', label: 'Less than 2 hours' },
    { key: 'more3h', label: 'More than 3 hours' },
    { key: 'more30min', label: 'More than 30 minutes' },
  ];

  const [customMin, setCustomMin] = useState(filters.duration?.custom?.min || 0);
  const [customMax, setCustomMax] = useState(filters.duration?.custom?.max || 300);

  const handleApply = () => {
    if (filters.duration?.preset === 'select') {
      setFilters((prev) => ({
        ...prev,
        duration: {
          ...prev.duration,
          custom: {
            min: customMin,
            max: customMax
          }
        }
      }));
    }
    onApply(filters, sorting);
  };

  const handleClear = () => {
    setFilters({});
    setSorting('date');
    onClear();
  };

  // Обработка клика по городу (multi-select)
  const toggleCity = (city) => {
    const currentCities = filters.city || [];
    if (currentCities.includes(city)) {
      // Удаляем город
      setFilters({
        ...filters,
        city: currentCities.filter(c => c !== city)
      });
    } else {
      // Добавляем город
      setFilters({
        ...filters,
        city: [...currentCities, city]
      });
    }
  };

  // Обработка клика по рейтингу (single-select)
  const toggleRating = (r) => {
    if (filters.rating === r) {
      // Если нажали на тот же рейтинг — снимаем
      setFilters({ ...filters, rating: null });
    } else {
      // Выбираем новый рейтинг
      setFilters({ ...filters, rating: r });
    }
  };

  // Обработка клика по длительности (single-select)
  const toggleDurationPreset = (key) => {
    if (filters.duration?.preset === key) {
      // Снимаем тот же самый пресет
      setFilters({
        ...filters,
        duration: {}
      });
    } else {
      setFilters({
        ...filters,
        duration: { preset: key }
      });
    }
  };

  // Обработка клика по кастомному диапазону
  const toggleCustomDuration = () => {
    if (filters.duration?.preset === 'select') {
      // Снимаем кастомный выбор
      setFilters({
        ...filters,
        duration: {}
      });
    } else {
      setFilters({
        ...filters,
        duration: { preset: 'select', custom: { min: customMin, max: customMax } }
      });
    }
  };

  const isCitySelected = (city) => filters.city?.includes(city);
  const isRatingSelected = (r) => filters.rating === r;
  const isPresetSelected = (key) => filters.duration?.preset === key;

  return (
    <Modal visible={isVisible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>×</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Filters</Text>
          <TouchableOpacity onPress={handleClear}>
            <Text style={styles.clearButton}>Clear</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>

          {/* Сортировка чекбоксами */}
          <View style={styles.sortingContainer}>
            <Text style={styles.sectionTitle}>Sort by</Text>
            {['rating', 'date', 'points'].map((method) => (
              <View key={method} style={styles.option}>
                <Text style={styles.sortingText}>{method}</Text>
                <CheckBox
                  value={sorting === method}
                  onValueChange={() => setSorting(method)}
                  tintColors={{ true: '#69B67E', false: '#838383' }}
                />
              </View>
            ))}
          </View>

          {/* City как чипы */}
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>City</Text>
            <View style={styles.chipsContainer}>
              {cities.map((city) => (
                <TouchableOpacity
                  key={city}
                  style={[styles.chip, isCitySelected(city) && styles.chipSelected]}
                  onPress={() => toggleCity(city)}
                >
                  <Text style={[styles.chipText, isCitySelected(city) && styles.chipTextSelected]}>{city}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Rating как чипы single-select */}
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>Rating</Text>
            <View style={styles.chipsContainer}>
              {ratings.map((rating) => (
                <TouchableOpacity
                  key={rating}
                  style={[styles.chip, isRatingSelected(rating) && styles.chipSelected]}
                  onPress={() => toggleRating(rating)}
                >
                  <Text style={[styles.chipText, isRatingSelected(rating) && styles.chipTextSelected]}>
                    From {rating}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Duration как чипы single-select + кастомный выбор */}
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>Duration</Text>
            <View style={styles.chipsContainer}>
              {durationPresets.map((preset) => (
                <TouchableOpacity
                  key={preset.key}
                  style={[styles.chip, isPresetSelected(preset.key) && styles.chipSelected]}
                  onPress={() => toggleDurationPreset(preset.key)}
                >
                  <Text style={[styles.chipText, isPresetSelected(preset.key) && styles.chipTextSelected]}>
                    {preset.label}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.chip, isPresetSelected('select') && styles.chipSelected]}
                onPress={toggleCustomDuration}
              >
                <Text style={[styles.chipText, isPresetSelected('select') && styles.chipTextSelected]}>
                  Select...
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {filters.duration?.preset === 'select' && (
            <View style={styles.customRangeContainer}>
              <Text>Min (minutes):</Text>
              <View style={styles.rangeControl}>
                <TouchableOpacity onPress={() => setCustomMin(Math.max(customMin - 10, 0))}>
                  <Text style={styles.rangeButton}>-10</Text>
                </TouchableOpacity>
                <Text>{customMin}</Text>
                <TouchableOpacity onPress={() => setCustomMin(customMin + 10)}>
                  <Text style={styles.rangeButton}>+10</Text>
                </TouchableOpacity>
              </View>

              <Text>Max (minutes):</Text>
              <View style={styles.rangeControl}>
                <TouchableOpacity onPress={() => setCustomMax(Math.max(customMax - 10, customMin))}>
                  <Text style={styles.rangeButton}>-10</Text>
                </TouchableOpacity>
                <Text>{customMax}</Text>
                <TouchableOpacity onPress={() => setCustomMax(customMax + 10)}>
                  <Text style={styles.rangeButton}>+10</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}


        </ScrollView>
        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyButtonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default FiltersModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  closeButton: {
    fontSize: 28,
    color: '#333',
  },
  title: {
    fontSize: 20,
    color: 'black',
  },
  clearButton: {
    fontSize: 16,
    color: '#69B67E',
  },
  sortingContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 10,
  },
  sortingText: {
    color: 'black',
    fontSize: 16,
  },
  categoryContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    paddingHorizontal: 10,
    marginTop: 10,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    color: 'black',
    marginVertical: 10,
    marginLeft: 10,
  },
  categoryTitle: {
    fontSize: 20,
    color: 'black',
    marginLeft: 10,
    marginTop: 10,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  chip: {
    backgroundColor: '#D9D9D9',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 6,
    marginRight: 5,
    marginTop: 5,
  },
  chipSelected: {
    backgroundColor: '#69B67E',
  },
  chipText: {
    color: 'black',
    fontSize: 16,
  },
  chipTextSelected: {
    color: 'black',
  },
  customRangeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  rangeControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rangeButton: {
    color: '#69B67E',
    marginHorizontal: 10,
  },
  applyButton: {
    backgroundColor: '#013B14',
    padding: 15,
    alignItems: 'center',
    width: 212,
    alignSelf: 'center',
    borderRadius: 40,
    marginBottom: 50,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
