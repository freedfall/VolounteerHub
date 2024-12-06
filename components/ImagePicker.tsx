// components/ImagePickerComponent.tsx

import React from 'react';
import { View, Button, Image, StyleSheet, Alert, Platform } from 'react-native';
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
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Button title="Select image" onPress={selectImage} />
          <Button title="Take picture" onPress={takePhoto} />
        </View>
      )}
      {imageUri && (
        <Button title="Delete image" onPress={() => setImageUri(null)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: 'center',
  },
  placeholder: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
});

export default ImagePicker;
