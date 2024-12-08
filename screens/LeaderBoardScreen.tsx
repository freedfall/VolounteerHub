import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userIcon from '../images/userProfileIcon.jpg'; // Placeholder icon
import SearchBar from '../components/SearchBar';
import SearchModal from '../components/SearchModal';

const BASE_URL = 'https://itu-215076752298.europe-central2.run.app/api';

const LeaderBoardScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedUser, setSelectedUser] = useState(null); // Selected user data
  const [modalVisible, setModalVisible] = useState(false); // For user modal
  const [isModalVisible, setModalSearchVisible] = useState(false); // For search modal
  const [searchHistory, setSearchHistory] = useState([]);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${BASE_URL}/user/top100`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();

      const usersWithRank = data.map((user, index) => ({
            ...user,
            rank: index + 1,
          }));

      setUsers(usersWithRank);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    loadSearchHistory();
  }, []);

  // Load search history
  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('searchHistory');
      if (history) {setSearchHistory(JSON.parse(history));}
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  // Filter users based on search input
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const openUserModal = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const renderUser = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openUserModal(item)}>
      <Text style={styles.rank}>{item.rank}</Text>
      <Image source={item.avatarUrl ? { uri: item.avatarUrl } : userIcon} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.points}>{item.points} 💎</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        openModal={() => setModalSearchVisible(true)}
      />

      {/* Search Modal */}
      <SearchModal
        isVisible={isModalVisible}
        closeModal={() => {
            setModalSearchVisible(false);
            setSearchText('');
          }}
        searchText={searchText}
        setSearchText={setSearchText}
        searchHistory={searchHistory}
        filteredItems={filteredUsers} // Using this prop for users
        renderItem={(user, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setModalSearchVisible(false);
                openUserModal(user);
              }}
            >
              <View style={styles.card}>
                <Text style={styles.rank}>{user.rank}</Text>
                <Image
                  source={user.avatarUrl ? { uri: user.avatarUrl } : userIcon}
                  style={styles.avatar}
                />
                <View style={styles.userInfo}>
                  <Text style={styles.name}>{user.name}</Text>
                  <Text style={styles.points}>{user.points} 💎</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />

      {/* Loader or User List */}
      {loading ? (
        <ActivityIndicator size="large" color="#006400" />
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderUser}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* User Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedUser && (
              <>
                <Image
                  source={
                    selectedUser.avatarUrl
                      ? { uri: selectedUser.avatarUrl }
                      : userIcon
                  }
                  style={styles.modalAvatar}
                />
                <Text style={styles.modalName}>{selectedUser.name}</Text>
                <Text style={styles.modalPoints}>
                  Points: {selectedUser.points}
                </Text>
                {selectedUser.email && (
                  <Text style={styles.modalText}>
                    Email: {selectedUser.email}
                  </Text>
                )}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F9F9F9',
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 15,
    color: '#333',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  points: {
    fontSize: 14,
    color: '#006400',
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

export default LeaderBoardScreen;
