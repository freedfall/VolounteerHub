// File: App.tsx
// Author: Kininbayev Timur (xkinin00)
// This is the main entry point of the application, setting up global navigation.
// It defines navigation stacks for authenticated and unauthenticated users.
// Uses AuthContext and EventContext to manage global authentication state and events data.
// Depending on whether the user is authenticated, it navigates to different stacks of screens.

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, View, Modal } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import EventDetails from './screens/EventDetails';
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import MapScreen from './screens/MapScreen';
import LeaderBoardScreen from './screens/LeaderBoardScreen';
import CreateEvent from './screens/CreateEvent';
import { EventProvider } from './context/EventContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import StartScreen from './screens/StartScreen';
import ProfileScreen from './screens/ProfileScreen';
import CategoryDetailsScreen from './screens/CategoryDetailsScreen';
import HomeScreenIcon from './images/icons/HomeScreenIcon.png';
import LeaderBoardIcon from './images/icons/LeaderBoardIcon.png';
import MapIcon from './images/icons/MapIcon.png';
import ProfileIcon from './images/icons/ProfileIcon.png';
import CreateEventIcon from './images/icons/CreateEventIcon.png';
import QRScannerScreen from './screens/QRScannerScreen';
import ChatListScreen from './screens/ChatListScreen';
import ChatScreen from './screens/ChatScreen';
import MainTabs from './components/MainTabs';
import { setCustomText } from 'react-native-global-props';

const StartScreenStack = createStackNavigator();
const RootStack = createStackNavigator();

const customTextProps = {
  style: {
    fontFamily: 'Gilroy-Regular',
  },
};

setCustomText(customTextProps);

const RootStackScreen: React.FC = () => (
  <RootStack.Navigator>
    <RootStack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
    <RootStack.Screen name="MapScreen" component={MapScreen} options={{ headerShown: false }} />
    <RootStack.Screen name="EventDetails" component={EventDetails} options={{ headerShown: false }} />
    <RootStack.Screen name="CategoryDetails" component={CategoryDetailsScreen} options={{ headerShown: false }} />
    <RootStack.Screen name="QRScanner" component={QRScannerScreen} options={{ headerShown: false }} />
    <RootStack.Screen name="CreateEvent" component={CreateEvent} options={{ headerShown: false }} />
    <RootStack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
    <RootStack.Screen name="ChatListScreen" component={ChatListScreen} options={{ headerShown: false }} />
  </RootStack.Navigator>
);

const StartScreenStackScreen: React.FC = () => (
  <StartScreenStack.Navigator>
    <StartScreenStack.Screen name="StartScreen" component={StartScreen} options={{ headerShown: false }} />
    <StartScreenStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <StartScreenStack.Screen name="SignUp" component={RegistrationScreen} options={{ headerShown: false }} />
  </StartScreenStack.Navigator>
);

const App: React.FC = () => (
  <AuthProvider>
    <EventProvider>
      <NavigationContainer>
        <AuthContext.Consumer>
          {({ isSignedIn }) => (
            isSignedIn ? <RootStackScreen /> : <StartScreenStackScreen />
          )}
        </AuthContext.Consumer>
      </NavigationContainer>
    </EventProvider>
  </AuthProvider>
);

export default App;
