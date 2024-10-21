// screens/StartScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, Modal, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import LoginScreen from './LoginScreen';
import RegistrationScreen from './RegistrationScreen';
import StartScreenBackground from '../images/StartScreenBackground.png';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
    Login: undefined;
    SignUp: undefined;
 };

type Props = NativeStackScreenProps<RootStackParamList, 'StartScreen'>;

const StartScreen: React.FC = ( {navigation} ) => {

  return (
      <View style={styles.container}>
        <ImageBackground source={StartScreenBackground} style={styles.background}>
          {/* Кнопки для открытия модальных окон */}
          <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonText}>Log in</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.buttonText}>Sign up</Text>
              </TouchableOpacity>
          </View>
        </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    width: '100%',
    height: '100%',
  },
  button: {
    backgroundColor: '#013B14',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    marginBottom: 20,
    width: '70%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },

  buttonContainer: {
    height: '50%',
    position: 'absolute',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 50,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'background: rgba(1, 59, 20, 0.38)',
  },
});

export default StartScreen;
