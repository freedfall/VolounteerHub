// screens/LoginScreen.tsx
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const LoginScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <Text>AuthContext not found</Text>;
  }

  const { signIn } = authContext;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome back</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholderTextColor='white'
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholderTextColor='white'
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={() => signIn(email, password)}>
            <Text style={styles.buttonText}>Log in</Text>
          </TouchableOpacity>
        </View>
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
    width: '100%',
    height: 60,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 50,
    marginBottom: 15,
    paddingHorizontal: 20,
    borderColor: 'rgba(1, 59, 20, 1)',
    backgroundColor: 'rgba(1, 59, 20, 0.15)',
    fontSize: 20,
  },
  button: {
    backgroundColor: '#013B14',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    width: '70%',
    marginTop: 50,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
closeButton: {
  position: 'absolute',
  top: 10,
  right: 10,
  backgroundColor: 'transparent',
},
closeButtonText: {
  fontSize: 24,
  color: '#000',
},
});

export default LoginScreen;
