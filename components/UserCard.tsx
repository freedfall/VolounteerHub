import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import userProfileIcon from '../images/userProfileIcon.jpeg';

type UserCardProps = {
  name: string;
  points: number;
  avatarUrl?: string;
  email?: string;
  showActions?: boolean;
};

const UserCard: React.FC<UserCardProps> = ({ name, points, avatarUrl, email, showActions }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity style={styles.card} onPress={() => setModalVisible(true)}>
        <Image
          source={avatarUrl ? { uri: avatarUrl } : userProfileIcon}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.points}>Points: {points}</Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image
              source={avatarUrl ? { uri: avatarUrl } : userProfileIcon}
              style={styles.modalAvatar}
            />
            <Text style={styles.modalName}>{name}</Text>
            <Text style={styles.modalPoints}>Points: {points}</Text>
            {email && <Text style={styles.modalText}>Email: {email}</Text>}

            {showActions && (
              <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.confirmButton}>
                  <Text style={styles.confirmButtonText}>Confirm Registration</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectButton}>
                  <Text style={styles.rejectButtonText}>Reject Registration</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    width: 300,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  points: {
    fontSize: 16,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  modalName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  modalPoints: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  rejectButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
  },
  rejectButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FF6347',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default UserCard;
