import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, View, Modal } from 'react-native';
import React, { useState } from 'react'
import MapScreen from '../screens/MapScreen';
import CreateEvent from '../screens/CreateEvent';
import ProfileScreen from '../screens/ProfileScreen';
import LeaderBoardScreen from '../screens/LeaderBoardScreen';
import HomeScreen from '../screens/HomeScreen';
import HomeScreenIcon from '../images/icons/HomeScreenIcon.png';
import LeaderBoardIcon from '../images/icons/LeaderBoardIcon.png';
import MapIcon from '../images/icons/MapIcon.png';
import ProfileIcon from '../images/icons/ProfileIcon.png';
import CreateEventIcon from '../images/icons/CreateEventIcon.png';

const Tab = createBottomTabNavigator();
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
          component={CreateEvent}
          options={{
              headerShown: false,
              tabBarStyle: { display: 'none' }
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

export default MainTabs;