import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Alert, Platform, Text } from 'react-native';
import { launchImageLibrary, launchCamera, Asset } from 'react-native-image-picker';

interface ImagePickerProps {
  imageUri: string | null;
  setImageUri: (uri: string | null) => void;
}

const ImagePicker: React.FC<ImagePickerProps> = ({ imageUri, setImageUri }) => {

  const getImageUri = (uri: string) => {
    if (Platform.OS === 'android' && !uri.startsWith('file://')) {
      return `file://${uri}`;
    }
    return uri;
  };

  const selectImage = () => {
    const options = {
      mediaType: 'photo' as const,
      includeBase64: false,
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.8,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', 'Unable to select image');
      } else if (response.assets && response.assets.length > 0) {
        const asset: Asset = response.assets[0];
        if (asset.uri) {
          setImageUri(getImageUri(asset.uri));
        }
      }
    });
  };

  const takePhoto = () => {
    const options = {
      mediaType: 'photo' as const,
      includeBase64: false,
      saveToPhotos: true,
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.8,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.error('Camera Error: ', response.errorMessage);
        Alert.alert('Error', 'Not able to take photo');
      } else if (response.assets && response.assets.length > 0) {
        const asset: Asset = response.assets[0];
        if (asset.uri) {
          setImageUri(getImageUri(asset.uri));
        }
      }
    });
  };

  return (
    <View style={styles.container}>
      {imageUri ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <TouchableOpacity style={styles.deleteButton} onPress={() => setImageUri(null)}>
            <Text style={styles.deleteButtonText}>×</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <TouchableOpacity style={styles.button} onPress={selectImage}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Adjusted styles for compact display
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 40,
    borderColor: '#013B14',
    borderWidth: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#838383',
    fontSize: 20,
  },
  imageContainer: {
    position: 'relative',
    width: 60,
    height: 60,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  deleteButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 14,
  },
});

export default ImagePicker;
