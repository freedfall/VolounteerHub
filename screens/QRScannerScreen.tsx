// screens/QRScannerScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, Platform, PermissionsAndroid } from 'react-native';
import { CameraKitCameraScreen } from 'react-native-camera-kit';
import { useNavigation, useRoute } from '@react-navigation/native';
import { confirmUserAttendance } from '../utils/api';

const QRScannerScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { eventId } = route.params;
  const [loading, setLoading] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean>(false);

  // Запрос разрешения на камеру (для Android)
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission to scan QR codes.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setHasCameraPermission(true);
        } else {
          Alert.alert('Permission Denied', 'Camera permission is required to scan QR codes.');
          navigation.goBack();
        }
      } catch (err) {
        console.warn(err);
        Alert.alert('Error', 'Failed to request camera permission.');
        navigation.goBack();
      }
    } else {
      // Для iOS разрешения обрабатываются автоматически
      setHasCameraPermission(true);
    }
  };

  React.useEffect(() => {
    requestCameraPermission();
  }, []);

  const onReadCode = async (event: any) => {
    try {
      const scannedData = event.nativeEvent.codeStringValue;
      console.log('Scanned Data:', scannedData);

      const userId = parseInt(scannedData, 10);
      if (isNaN(userId)) {
        Alert.alert('Invalid QR Code', 'The scanned QR code is invalid.');
        return;
      }

      setLoading(true);
      const response = await confirmUserAttendance(eventId, userId);

      if (response.status === 200 || response.status === 204) {
        Alert.alert('Success', 'User status updated to ATTENDED.');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to update user status.');
      }

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while updating status.');
    } finally {
      setLoading(false);
    }
  };

  if (!hasCameraPermission) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4caf50" />
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4caf50" />
          <Text>Updating status...</Text>
        </View>
      )}
      <CameraKitCameraScreen
        showFrame={true}
        scanBarcode={true}
        laserColor={'#FF3D00'}
        frameColor={'#00C853'}
        colorForScannerFrame={'black'}
        onReadCode={onReadCode}
        hideControls={false}
        offsetForScannerFrame={30}
        heightForScannerFrame={300}
        cameraOptions={{
          flashMode: 'auto', // Можно установить 'on' или 'off'
          focusMode: 'on', // Включить автофокус
        }}
      />
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionText}>Please scan the attendee's QR code.</Text>
        <Text style={styles.instructionText}>Align the QR code within the frame.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginVertical: 4,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default QRScannerScreen;
