// context/AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  isSignedIn: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  register: (name: string, surname: string, email: string, password: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

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
    checkToken();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Отправка запроса на авторизацию...');
      const response = await fetch('https://fitexamprep.site/itu/auth/authenticate', {
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
      const response = await fetch('https://fitexamprep.site/itu/auth/register', {
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
      setIsSignedIn(true);
    } catch (error) {
      console.error('Ошибка сети при регистрации:', error);
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('userToken');
    setIsSignedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, signIn, signOut, register }}>
      {children}
    </AuthContext.Provider>
  );
};
