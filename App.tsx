// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Card from './components/Card';

const Tab = createBottomTabNavigator();

const HomeScreen: React.FC = () => (
  <View style={styles.container}>
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <Card title="Card" description="Card description" />
      <Card title="Card" description="Card description" />
      <Card title="Card" description="Card description" />
    </ScrollView>
  </View>
);

const SettingsScreen: React.FC = () => (
  <View style={styles.container}>
  </View>
);

const ProfileScreen: React.FC = () => (
  <View style={styles.container}>
  </View>
);

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Main screen' }}/>
        <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 30,
  },

});

export default App;
