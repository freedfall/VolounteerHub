import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userIcon from '../images/userProfileIcon.jpg'; // Placeholder icon
import SearchBar from '../components/SearchBar';
import SearchModal from '../components/SearchModal';
import PointsIcon from '../images/icons/points.png';
import UserCard from '../components/UserCard';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

const BASE_URL = 'https://itu-215076752298.europe-central2.run.app/api';

const LeaderBoardScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setModalSearchVisible] = useState(false); // For search modal
  const [searchHistory, setSearchHistory] = useState([]);

  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

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
    user.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderUser = ({ item }) => (
    <View style={styles.userContainer}>
      <Text style={styles.rank}>
        {item.rank}
      </Text>
      <UserCard
        name={item.name}
        surname={item.surname}
        points={item.points}
        avatarUrl={item.avatarUrl}
        email={item.email}
        showActions={false}
        id={item.id}
        eventId={null}
        status={item.status}
      />
     </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        openSearchModal={() => setModalSearchVisible(true)}
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
            <UserCard
              key={index}
              name={user.name}
              surname={user.surname}
              points={user.points}
              avatarUrl={user.avatarUrl}
              email={user.email}
              showActions={false}
              id={user.id}
              eventId={null}
              status={user.status}
            />
          )}
        />

      {/* Loader or User List */}
      {loading ? (
        <ActivityIndicator size="large" color="#006400" />
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderUser}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F9F9F9',
    marginBottom: 70,
  },
  userContainer: {
      flexDirection: 'row',
      alignItems: 'center',
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
    fontSize: 22,
    marginRight: 10,
    color: '#333',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 50,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '500',
    color: '#333',
  },
  points: {
    fontSize: 18,
    color: '#838383',
  },
  pointsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 5,
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
    borderRadius: 15,
    alignItems: 'center',
  },
  modalAvatar: {
    width: 109,
    height: 109,
    borderRadius: 50,
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
    color: 'black',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FF6A6A',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  contactButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#006400',
    borderRadius: 5,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LeaderBoardScreen;
