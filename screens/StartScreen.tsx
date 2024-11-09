import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Modal } from 'react-native';
import LoginScreen from './LoginScreen';
import RegistrationScreen from './RegistrationScreen';
import StartScreenBackground from '../images/StartScreenBackground.png';

const StartScreen: React.FC = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isRegistrationVisible, setIsRegistrationVisible] = useState(false);

  const showLoginModal = () => {
    setIsLoginVisible(true);
    setIsRegistrationVisible(false);
  };

  const showRegistrationModal = () => {
    setIsRegistrationVisible(true);
    setIsLoginVisible(false);
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={StartScreenBackground} style={[styles.background, (isLoginVisible || isRegistrationVisible) && styles.backgroundBlur]}>
        {!isLoginVisible && !isRegistrationVisible && (
          <Text style={styles.title}>volunteerhub</Text>
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => setIsLoginVisible(true)}>
            <Text style={styles.buttonText}>Log in</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setIsRegistrationVisible(true)}>
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={isLoginVisible} animationType="slide" transparent={true} onRequestClose={() => setIsLoginVisible(false)}>
          <View style={styles.modalLoginContainer}>
            <LoginScreen onClose={showRegistrationModal} />
          </View>
        </Modal>

        <Modal visible={isRegistrationVisible} animationType="slide" transparent={true} onRequestClose={() => setIsRegistrationVisible(false)}>
          <View style={styles.modalRegistrationContainer}>
            <RegistrationScreen onClose={showLoginModal} />
          </View>
        </Modal>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 46,
    color: '#fff',
    textTransform: 'uppercase',
    fontWeight: 'bold',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#013B14',
    paddingHorizontal: 30,
    borderRadius: 50,
    marginBottom: 20,
    width: '70%',
    height: 60,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
  modalLoginContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    justifyContent: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    height: '45%',
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalRegistrationContainer: {
      position: 'absolute',
      backgroundColor: 'rgba(255, 255, 255, 1)',
      justifyContent: 'center',
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      padding: 20,
      height: '65%',
      bottom: 0,
      left: 0,
      right: 0,
    },
});

export default StartScreen;
