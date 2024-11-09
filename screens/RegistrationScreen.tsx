import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const RegistrationScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const authContext = useContext(AuthContext);

  const { register } = authContext;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create account</Text>
      <View style={styles.modalContainer}>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="Name" placeholderTextColor="rgba(1, 59, 20, 0.7)" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Surname" placeholderTextColor="rgba(1, 59, 20, 0.7)" value={surname} onChangeText={setSurname} />
          <TextInput style={styles.input} placeholder="Email" placeholderTextColor="rgba(1, 59, 20, 0.7)" value={email} onChangeText={setEmail} />
          <TextInput style={styles.input} placeholder="Password" placeholderTextColor="rgba(1, 59, 20, 0.7)" value={password} onChangeText={setPassword} secureTextEntry />
        </View>
        <TouchableOpacity style={styles.button} onPress={() => register(name, surname, email, password)}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Already have an account?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    bottom: 0,
  },
  header: {
    fontSize: 32,
    color: '#013B14',
    marginBottom: 20,
  },
  modalContainer: {
    width: '100%',
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 0,
    borderRadius: 40,
    marginBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(105, 182, 126, 0.4)',
    color: 'rgba(1, 59, 20, 0.7)',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#013B14',
    paddingVertical: 15,
    borderRadius: 40,
    width: '63%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  closeButton: {
    marginTop: 20,
  },
  closeButtonText: {
    color: 'rgba(1, 59, 20, 1)',
    fontSize: 18,
  },
});

export default RegistrationScreen;
