// components/SettingsModal.tsx
import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import { AuthContext } from '../context/AuthContext';
import { updateUserDetails, uploadUserProfileImage } from '../utils/api';
import ImagePickerComponent from './ImagePicker';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
  const { user, loadUserData } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [surname, setSurname] = useState(user?.surname || '');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && user) {
      setName(user.name);
      setSurname(user.surname);
      setImageUri(user.imageURL || null);
      setImageFile(null);
    }
  }, [visible, user]);

  const handleSave = async () => {
    if (!name.trim() || !surname.trim()) {
      Alert.alert('Error', 'Please complete all fields.');
      return;
    }

    setLoading(true);
    try {
      const profileUpdated = await updateUserDetails(user.id, { name, surname });
      if (imageFile) {
          const imageUploaded = await uploadUserProfileImage(user.id, imageFile);
          if (!imageUploaded) {
            setLoading(false);
          return;
          }
      }

      Alert.alert('Success', 'The data has been successfully updated.');

      loadUserData();
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update user data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={styles.modal}
      avoidKeyboard={true}
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Change profile</Text>

        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>×</Text>
        </TouchableOpacity>

        <View style={styles.imagePickerWrapper}>
            <ImagePickerComponent
              imageUri={imageUri}
              setImageUri={(uri) => {
                setImageUri(uri);
                if (uri) {
                  const filename = uri.split('/').pop();
                  const match = /\.(\w+)$/.exec(filename || '');
                  const type = match ? `image/${match[1].toLowerCase()}` : `image`;
                  setImageFile({
                    uri: uri,
                    name: filename || 'profile.jpg',
                    type: type,
                  });
                } else {
                  setImageFile(null);
                }
              }}
            />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Surname"
          value={surname}
          onChangeText={setSurname}
        />


        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        )}

      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    margin: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'stretch',
  },
  imagePickerWrapper:{
      alignSelf: 'center',
      marginBottom: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 40,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#69B67E',
    paddingVertical: 10,
    borderRadius: 40,
    alignItems: 'center',
    marginBottom: 10,
    width: '60%',
    alignSelf: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    position: 'absolute',
    top: 5,
    right: 20,
  },
  cancelButtonText: {
    color: 'black',
    fontSize: 26,
    fontWeight: '600',
  },
});

export default SettingsModal;
