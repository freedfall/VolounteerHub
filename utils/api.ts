import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchEvents = async () => {
  try {
    const response = await fetch('https://fitexamprep.site/itu/api/event', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
      },
    });
    const data = await response.json();
    console.log('Events:', data);
    return data;
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};
