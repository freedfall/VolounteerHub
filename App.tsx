// App.tsx
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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

import { setCustomText } from 'react-native-global-props';

const Tab = createBottomTabNavigator();
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
  </RootStack.Navigator>
);

const StartScreenStackScreen: React.FC = () => (
  <StartScreenStack.Navigator>
    <StartScreenStack.Screen name="StartScreen" component={StartScreen} options={{ headerShown: false }} />
    <StartScreenStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <StartScreenStack.Screen name="SignUp" component={RegistrationScreen} options={{ headerShown: false }} />
  </StartScreenStack.Navigator>
);

const MainTabs: React.FC = () => {
  const [isCreateEventModalVisible, setCreateEventModalVisible] = useState(false);

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            let tintColor = focused ? '#006400' : '#ffffff';
            let icon;
            switch (route.name) {
              case 'Home':
                icon = <Image source={HomeScreenIcon} style={{ width: 33, height: 36, tintColor }} />;
                break;
              case 'Leaderboard':
                icon = <Image source={LeaderBoardIcon} style={{ width: 33, height: 33, tintColor }} />;
                break;
              case 'CreateEvent':
                icon = (
                  <View style={{ backgroundColor: '#013B14', borderRadius: 50, padding: 15, transform: [{ translateY: -30 }] }}>
                    <Image source={CreateEventIcon} style={{ width: 48, height: 48 }} />
                  </View>
                );
                break;
              case 'Map':
                icon = <Image source={MapIcon} style={{ width: 39, height: 34, tintColor }} />;
                break;
              case 'Profile':
                icon = <Image source={ProfileIcon} style={{ width: 33, height: 34, tintColor }} />;
                break;
            }
            return icon;
          },
          tabBarShowLabel: false,
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: '#69B67E',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            height: 80,
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Leaderboard" component={LeaderBoardScreen} options={{ headerShown: false }} />
        <Tab.Screen
          name="CreateEvent"
          component={HomeScreen}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setCreateEventModalVisible(true);
            },
          }}
        />
        <Tab.Screen name="Map" component={MapScreen} options={{ headerShown: false }}/>
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      </Tab.Navigator>

      <Modal visible={isCreateEventModalVisible} animationType="slide">
        <CreateEvent onClose={() => setCreateEventModalVisible(false)} />
      </Modal>
    </>
  );
};

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
