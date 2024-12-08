// context/AuthContext.tsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        console.log('Проверка токена...');
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          console.log('Токен найден:', token);
          setIsSignedIn(true);
        } else {
          console.log('Токен не найден');
        }
      } catch (error) {
        console.error('Ошибка проверки токена:', error);
      }
    };
    const checkUserData = async () => {
        try {
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                console.log('Данные пользователя найдены:', userData);
                setUser(JSON.parse(userData));
            } else {
                loadUserData();
            }

        } catch (error) {
            console.error('Ошибка загрузки данных пользователя:', error);
        }
    };
    checkToken();
    checkUserData();
  }, []);

  const loadUserData = useCallback(async () => {
    try {
      const response = await fetch('https://itu-215076752298.europe-central2.run.app/api/user/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data);
        await AsyncStorage.setItem('userData', JSON.stringify(data));
        console.log('Данные пользователя загружены:', data);
      } else {
        console.error('Ошибка получения данных пользователя:', data.message);
      }
    } catch (error) {
      console.error('Ошибка сети при получении данных пользователя:', error);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Отправка запроса на авторизацию...');
      const response = await fetch('https://itu-215076752298.europe-central2.run.app/auth/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Ответ от сервера:', data);

      if (response.ok) {
        console.log('Авторизация успешна');
        await AsyncStorage.setItem('userToken', data.token);
        await loadUserData();
        setIsSignedIn(true);
      } else {
        console.error('Ошибка авторизации:', data.message);
      }
    } catch (error) {
      console.error('Ошибка сети при авторизации:', error);
    }
  };

  const register = async (name: string, surname: string, email: string, password: string) => {
    try {
      console.log('Отправка запроса на регистрацию...');
      const response = await fetch('https://itu-215076752298.europe-central2.run.app/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, surname, email, password }),
      });

      const data = await response.json();
      console.log('Ответ от сервера на регистрацию:', data);

      if (!response.ok) {
        console.error(`Ошибка регистрации: ${response.status} - ${response.statusText}`);
        console.error('Ответ с ошибкой:', data);
        return;
      }

      console.log('Регистрация успешна');
      await AsyncStorage.setItem('userToken', data.token);
      await loadUserData();
      setIsSignedIn(true);
    } catch (error) {
      console.error('Ошибка сети при регистрации:', error);
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
