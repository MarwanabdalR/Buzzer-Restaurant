'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import api from '../lib/axios';

interface UserProfile {
  id: string;
  fullName: string;
  mobileNumber: string;
  email: string | null;
  image: string | null;
  type: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  login: (idToken: string) => Promise<UserProfile>;
  register: (data: {
    fullName: string;
    mobileNumber: string;
    idToken: string;
  }) => Promise<UserProfile>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (idToken: string): Promise<UserProfile> => {
    try {
      const response = await api.post('/auth/login', { idToken });

      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error('Login failed');
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('USER_NOT_FOUND');
      }
      
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      throw new Error(errorMessage);
    }
  };

  const register = async (data: {
    fullName: string;
    mobileNumber: string;
    idToken: string;
  }): Promise<UserProfile> => {
    try {
      const response = await api.post('/auth/register', data);

      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error('Registration failed');
    } catch (error: any) {
      if (error.response?.status === 409) {
        throw new Error('USER_EXISTS');
      }
      
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    logout,
    login,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
