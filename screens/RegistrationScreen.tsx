// screens/RegistrationScreen.tsx
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import background from '../images/authorizationBackground.png';

const RegistrationScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <Text>AuthContext not found</Text>;
  }

  const { register } = authContext;

  return (
    <View style={styles.container}>
        <ImageBackground source={background} style={styles.background}>

        <View style={styles.overlay} />

        <View style={styles.content}>
          <Text style={styles.header}>Create account</Text>
          <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholderTextColor="white" placeholder="Name" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholderTextColor="white" placeholder="Surname" value={surname} onChangeText={setSurname} />
          <TextInput style={styles.input} placeholderTextColor="white" placeholder="Email" value={email} onChangeText={setEmail} />
          <TextInput style={styles.input} placeholderTextColor="white" placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
          <TouchableOpacity style={styles.button} onPress={() => register(name, surname, email, password)}>
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>
          </View>
        </View>

        </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      backgroundColor: '#69B67E',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
  },
  background: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(105, 182, 126, .4);',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 32,
    lineHeight: 44,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  inputContainer: {
    width: '80%',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 40,
    padding: 20,
  },
  input: {
    width: '90%',
    height: 60,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 50,
    marginBottom: 15,
    paddingHorizontal: 20,
    borderColor: 'rgba(1, 59, 20, 1)',
    backgroundColor: 'rgba(1, 59, 20, 0.15)',
    fontSize: 20,
    color: 'white',
  },
  button: {
    backgroundColor: '#013B14',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    width: '70%',
    marginTop: 70,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
});

export default RegistrationScreen;
