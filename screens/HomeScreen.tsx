import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Card from '../components/Card';
import { useEventContext } from '../context/EventContext';

type RootStackParamList = {
  Home: undefined;
  EventDetails: { title: string; time: string; city: string; address: string; points: number; description: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

// Функция для получения списка событий с бэкенда
const fetchEvents = async () => {
  try {
    const response = await fetch('https://fitexamprep.site/itu/api/event', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log('Events:', data);
    return data;
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { setEvents, events } = useEventContext(); // Получаем функции контекста для обновления событий
  const [refreshing, setRefreshing] = useState(false); // Состояние для отслеживания обновления страницы

  // Функция для обновления событий
  const loadEvents = async () => {
    setRefreshing(true); // Показываем индикатор обновления
    try {
      const data = await fetchEvents();
      if (data) {
        setEvents(data); // Обновляем события в контексте
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setRefreshing(false); // Убираем индикатор обновления
    }
  };

  // Загружаем события при монтировании компонента
  useEffect(() => {
    loadEvents();
  }, []);

  // Обработчик обновления при скролле вверх (обновляем события)
  const handleScroll = (event: any) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    if (yOffset <= 0 && !refreshing) {
      loadEvents(); // Обновляем события только если скролл достиг верха и не идет обновление
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadEvents} />
        }
        onScroll={handleScroll} // Отслеживаем скролл
        scrollEventThrottle={16} // Задаем частоту обновления события скролла
      >
        {events.map((event, index) => (
          <Card
            key={index}
            title={event.title}
            time={event.time}
            city={event.city}
            address={event.address}
            points={event.points}
            onPress={() =>
              navigation.navigate('EventDetails', {
                title: event.title,
                time: event.time,
                city: event.city,
                address: event.address,
                points: event.points,
                description: event.description,
              })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
});

export default HomeScreen;
