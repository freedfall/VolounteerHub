// context/AuthContext.tsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUser, signInUser, registerUser } from '../utils/api'

type User = {
  name: string;
  surname: string;
  email: string;
  phone: string;
  points: number;
  avatarUrl?: string;
  role: string;
};

type AuthContextType = {
  isSignedIn: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  register: (name: string, surname: string, email: string, password: string) => Promise<void>;
  loadUserData: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        console.log('Check token...');
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          console.log('Token found:', token);
          setIsSignedIn(true);
        } else {
          console.log('Token was not found');
        }
      } catch (error) {
        console.error('Error checking token:', error);
      }
    };
    const checkUserData = async () => {
        try {
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                console.log('User data found:', userData);
                setUser(JSON.parse(userData));
            } else {
                loadUserData();
            }

        } catch (error) {
            console.error('Error finding user data:', error);
        }
    };
    checkToken();
    checkUserData();
  }, []);

  const loadUserData = useCallback(async () => {
      try {
        const response = await getUser();

        const data = await response.json();
        if (response.ok) {
          setUser(data);
          await AsyncStorage.setItem('userData', JSON.stringify(data));
          console.log('User data:', data);
        } else {
          console.error('Error getting user data:', data.message);
        }
      } catch (error) {
        console.error('Network error getting user data:', error);
      }
    }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await signInUser(email, password);

      const data = await response.json();

      if (response.ok) {
        console.log('Authorization complete');
        await AsyncStorage.setItem('userToken', data.token);
        await loadUserData();
        setIsSignedIn(true);
      } else {
        console.error('Error:', data.message);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const register = async (name: string, surname: string, email: string, password: string) => {
    try {
      const response = await registerUser(name, surname, email, password);

      const data = await response.json();

      if (!response.ok) {
        console.error(`Registration error: ${response.status} - ${response.statusText}`);
        return;
      }

      console.log('Register succesfull');
      await AsyncStorage.setItem('userToken', data.token);
      await loadUserData();
      setIsSignedIn(true);
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    setIsSignedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, user, signIn, signOut, register, loadUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
