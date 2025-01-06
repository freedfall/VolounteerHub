import React, { useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert, ActivityIndicator } from 'react-native';
import userProfileIcon from '../images/userProfileIcon.jpg';
import { confirmUserRegistration, deleteUserFromEvent } from '../utils/api';
import PointsIcon from '../images/icons/points.png';
import CreatorFeedbacks from './CreatorFeedbacks';
import PointsToStars from './PointsToStars';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import AdminUserModal from './AdminUserModal';

type UserCardProps = {
  name: string;
  surname: string;
  points: number;
  pointsAsCreator?: number;
  avatarUrl?: string;
  email?: string;
  showActions?: boolean;
  id: string;
  eventId?: string;
  status?: string;
  refreshParticipants?: () => void;
  isAdmin?: boolean;
  onUpdateAdminData?: () => void;
};

const UserCard: React.FC<UserCardProps> = ({ name, surname, points, pointsAsCreator, avatarUrl, email, showActions, id, eventId, status, refreshParticipants, isAdmin, onUpdateAdminData }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [adminModalVisible, setAdminModalVisible] = useState(false);
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  const isRegistered = status === 'CONFIRMED';
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const confirmUserDelete = () => {
    Alert.alert(
        'Confirm deletion',
        'Are you sure you want to delete this user from event?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => handleDeleteUser(),
          },
        ],
        { cancelable: true }
      );
  };

  const confirmUserRegister = () => {
       Alert.alert(
           'Confirm action',
           'Are you sure you want to register to event?',
           [
             {
               text: 'Cancel',
               style: 'cancel',
             },
             {
               text: 'Confirm',
               style: 'default',
               onPress: () => handleConfirmUser(),
             },
           ],
           { cancelable: true }
         );
   };

   const handleConfirmUser = async () => {
       setIsConfirming(true);
       try {
         await confirmUserRegistration(eventId, id)
         Alert.alert('Success', 'User successfully registered.', [
           {
             text: 'OK',
             onPress: () => {
                setModalVisible(false);
                if (refreshParticipants) refreshParticipants();
             },
           },
         ]);
       } catch (error) {
         Alert.alert('Error', 'Unable to delete user.');
         console.log('Error: ', error);
         setModalVisible(false);
         if (refreshParticipants) refreshParticipants();
       } finally {
           setIsConfirming(false);
       }
     };

    const handleDeleteUser = async () => {
      setIsDeleting(true);
      try {
        await deleteUserFromEvent(eventId, id)
        Alert.alert('Success', 'User successfully deleted.', [
          {
            text: 'OK',
            onPress: () => {
              setModalVisible(false);
              if (refreshParticipants) refreshParticipants();
            },
          },
        ]);
      } catch (error) {
        Alert.alert('Error', 'Unable to delete user.');
        console.log('Error: ', error);
        setModalVisible(false);
        if (refreshParticipants) refreshParticipants();
      } finally {
          setIsDeleting(false);
      }
    };
  const isCurrentUser = user?.id === id;

  const handleContactPress = () => {
      setModalVisible(false);
      navigation.navigate('ChatScreen', {
        recipientId: id,
        recipientName: name,
        recipientSurname: surname,
        recipientAvatar: avatarUrl,
      });
  };

  const handleAdminAction = () => {
    setModalVisible(false);
    setAdminModalVisible(true);
  };

  const onCardPress = () => {
      if (isAdmin) {
        handleAdminAction();
      } else {
        setModalVisible(true);
      }
    };

  return (
    <View>
      <TouchableOpacity style={styles.card} onPress={onCardPress}>
        <Image
          source={avatarUrl ? { uri: avatarUrl } : userProfileIcon}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{name} {surname}</Text>
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
          <TouchableOpacity style={styles.modalContent} activeOpacity={1}>
            <TouchableOpacity style={styles.closeIcon} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeIconText}>×</Text>
            </TouchableOpacity>
            <Image source={avatarUrl ? { uri: avatarUrl } : userProfileIcon} style={styles.modalAvatar}/>
            <Text style={styles.modalName}>{name} {surname}</Text>
            <PointsToStars points={pointsAsCreator} />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.modalPoints}>{points}</Text>
              <Image source={PointsIcon} style={{ width: 16, height: 19, marginLeft: 5, marginBottom: 10 }} />
            </View>

            {email && <Text style={styles.modalText}>Email: {email}</Text>}

            {!isCurrentUser && (
                <TouchableOpacity style={styles.confirmButton} onPress={handleContactPress}>
                  <Text style={styles.confirmButtonText}>Contact</Text>
                </TouchableOpacity>
            )}

            {showActions && (
              <View style={styles.actionsContainer}>
                {isRegistered ? (
                  <>
                    <TouchableOpacity
                          style={[styles.rejectButton]}
                          onPress={confirmUserDelete}
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                          ) : (
                            <Text style={styles.rejectButtonText}>Delete</Text>
                          )}
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                          style={[styles.confirmButton]}
                          onPress={confirmUserRegister}
                          disabled={isConfirming}
                        >
                          {isConfirming ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                          ) : (
                            <Text style={styles.confirmButtonText}>Confirm registration</Text>
                          )}
                    </TouchableOpacity>
                    <TouchableOpacity
                          style={[styles.rejectButton]}
                          onPress={confirmUserDelete}
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                          ) : (
                            <Text style={styles.rejectButtonText}>Reject registration</Text>
                          )}
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}
            {pointsAsCreator > 0 && (
              <View style={styles.feedbackContainer}>
                <CreatorFeedbacks creatorId={id} />
              </View>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      {isAdmin && (
        <AdminUserModal
          visible={adminModalVisible}
          user={ { id, name, surname, points, pointsAsCreator, avatarUrl, email, status } }
          onClose={() => setAdminModalVisible(false)}
          navigation={navigation}
          onUpdateAdminData={onUpdateAdminData}
        />
      )}
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
    width: 250,
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
    width: 250,
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
