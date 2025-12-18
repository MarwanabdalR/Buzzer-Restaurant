'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import api from '../lib/axios';
import { useAuth } from './AuthContext';

interface UserProfile {
  id: string;
  fullName: string;
  mobileNumber: string;
  email: string | null;
  image: string | null;
  type: string;
}

interface ProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: {
    fullName?: string;
    email?: string | null;
    image?: string | null;
  }) => Promise<UserProfile>;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    setLoading(true);
    try {
      const idToken = await user.getIdToken();
      const response = await api.get('/auth/profile', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (response.data.success) {
        setProfile(response.data.data);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setProfile({
          id: user.uid,
          fullName: user.displayName || 'User',
          mobileNumber: user.phoneNumber || '',
          email: user.email || null,
          image: user.photoURL,
          type: 'user',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: {
    fullName?: string;
    email?: string | null;
    image?: string | null;
  }): Promise<UserProfile> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const idToken = await user.getIdToken();
      const response = await api.patch(
        '/auth/profile',
        data,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (response.data.success) {
        const updatedProfile = response.data.data;
        setProfile(updatedProfile);
        return updatedProfile;
      }
      
      throw new Error('Failed to update profile');
    } catch (error: any) {
      if (error.response?.data?.details && Array.isArray(error.response.data.details)) {
        const details = error.response.data.details.join(', ');
        throw new Error(details);
      }
      
      if (error.message && error.message.includes('Unable to connect')) {
        throw new Error('Unable to connect to server. Please check if the backend is running.');
      }
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile. Please try again.';
      throw new Error(errorMessage);
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    }
  }, [user?.uid, authLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  const value: ProfileContextType = {
    profile,
    loading,
    fetchProfile,
    updateProfile,
    refreshProfile,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

