import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import userProfileIcon from '../images/userProfileIcon.jpg';
import { confirmUserRegistration } from '../utils/api';
import PointsIcon from '../images/icons/points.png';
import CreatorFeedbacks from './CreatorFeedbacks';

type UserCardProps = {
  name: string;
  points: number;
  avatarUrl?: string;
  email?: string;
  showActions?: boolean;
  id: string;
  eventId?: string;
  status?: string;
};

const UserCard: React.FC<UserCardProps> = ({ name, points, avatarUrl, email, showActions, id, eventId, status }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const isRegistered = status === 'CONFIRMED';

  return (
    <View>
      <TouchableOpacity style={styles.card} onPress={() => setModalVisible(true)}>
        <Image
          source={avatarUrl ? { uri: avatarUrl } : userProfileIcon}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.points}>{points}</Text>
              <Image source={PointsIcon} style={{ width: 16, height: 19, marginLeft: 5 }} />
            </View>
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
          >
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeIconText}>×</Text>
            </TouchableOpacity>
            <Image
              source={avatarUrl ? { uri: avatarUrl } : userProfileIcon}
              style={styles.modalAvatar}
            />
            <Text style={styles.modalName}>{name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.modalPoints}>{points}</Text>
              <Image source={PointsIcon} style={{ width: 16, height: 19, marginLeft: 5 }} />
            </View>
            {email && <Text style={styles.modalText}>Email: {email}</Text>}

            <TouchableOpacity style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Contact</Text>
            </TouchableOpacity>

            {showActions && (
              <View style={styles.actionsContainer}>
                {isRegistered ? (
                  <>
                    <TouchableOpacity style={styles.confirmButton}>
                      <Text style={styles.confirmButtonText}>Contact</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rejectButton}>
                      <Text style={styles.rejectButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity style={styles.confirmButton} onPress={() => confirmUserRegistration(eventId, id)}>
                      <Text style={styles.confirmButtonText}>Confirm Registration</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rejectButton}>
                      <Text style={styles.rejectButtonText}>Reject Registration</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}
            <View style={styles.feedbackContainer}>
              <CreatorFeedbacks creatorId={id} />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
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
    width: 380,
    height: 100,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 50,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 20,
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
    width: 355,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIconText: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
  modalAvatar: {
    width: 109,
    height: 109,
    borderRadius: 50,
    marginBottom: 10,
  },
  modalName: {
    fontSize: 22,
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
    marginBottom: 15,
  },
  actionsContainer: {
    flexDirection: 'column',
    marginTop: 10,
    gap: 10,
  },
  confirmButton: {
    backgroundColor: '#69B67E',
    width: 220,
    padding: 7,
    paddingHorizontal: 30,
    borderRadius: 40,
    textAlign: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 20,
  },
  rejectButton: {
    backgroundColor: '#FF6A6A',
    padding: 7,
    borderRadius: 40,
    alignItems: 'center',
    width: 220,
  },
  rejectButtonText: {
    color: '#FFF',
    fontSize: 20,
  },
    feedbackContainer: {
        marginTop: 20,
        width: '100%',
        height: 200,
        overflow: 'hidden',
    },
});

export default UserCard;
