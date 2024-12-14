// QRCodeGenerator.tsx
import React, { useState } from 'react';
import QRCode from 'react-native-qrcode-svg';
import { View, Modal, TouchableOpacity, StyleSheet } from 'react-native';

interface QRCodeGeneratorProps {
  email: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ email }) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleOpenModal}>
        <QRCode
          value={email}
          size={89}
          backgroundColor="white"
          color="#033b14"
        />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={handleCloseModal}>
          <View style={styles.modalContainer}>
            <QRCode
              value={email}
              size={250}
              backgroundColor="white"
              color="#023a12"
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 0,
    paddingVertical: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
});

export default QRCodeGenerator;
