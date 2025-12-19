'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import { Restaurant } from '../types';
import { getIdToken } from '../lib/firebase';

interface RestaurantsResponse {
  success: boolean;
  message: string;
  data: Restaurant[];
}

interface RestaurantResponse {
  success: boolean;
  message: string;
  data: Restaurant;
}

interface RestaurantContextType {
  restaurants: Restaurant[];
  loading: boolean;
  error: Error | null;
  fetchRestaurants: () => Promise<void>;
  createRestaurant: (data: {
    name: string;
    type: string;
    location: string;
    rating?: number;
    imageUrl?: string | null;
  }) => Promise<Restaurant>;
  updateRestaurant: (id: string, data: {
    name?: string;
    type?: string;
    location?: string;
    rating?: number;
    imageUrl?: string | null;
  }) => Promise<Restaurant>;
  deleteRestaurant: (id: string) => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const useRestaurants = () => {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurants must be used within a RestaurantProvider');
  }
  return context;
};

interface RestaurantProviderProps {
  children: ReactNode;
}

export const RestaurantProvider: React.FC<RestaurantProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();

  const {
    data: restaurants = [],
    isLoading: loading,
    error,
    refetch: fetchRestaurants,
  } = useQuery<Restaurant[]>({
    queryKey: ['restaurants'],
    queryFn: async () => {
      try {
        const response = await api.get<RestaurantsResponse>('/restaurants');
        if (response.data.success) {
          return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch restaurants');
      } catch (err: any) {
        // Provide more detailed error messages
        if (err.code === 'ECONNABORTED') {
          throw new Error('Request timeout. Please check your connection.');
        } else if (err.message === 'Network Error' || !err.response) {
          throw new Error('Unable to connect to server. Please ensure the backend is running on http://localhost:3000');
        } else if (err.response?.status === 401) {
          throw new Error('Authentication required. Please log in again.');
        } else if (err.response?.status === 404) {
          throw new Error('Restaurants endpoint not found. Please check the API configuration.');
        } else if (err.response?.status >= 500) {
          throw new Error('Server error. Please try again later.');
        }
        throw new Error(err.response?.data?.message || err.message || 'Failed to fetch restaurants');
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      type: string;
      location: string;
      rating?: number;
      imageUrl?: string | null;
    }) => {
      const idToken = await getIdToken();
      if (!idToken) {
        throw new Error('User not authenticated');
      }
      const response = await api.post<RestaurantResponse>('/restaurants', data, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to create restaurant');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: {
      name?: string;
      type?: string;
      location?: string;
      rating?: number;
      imageUrl?: string | null;
    }}) => {
      const idToken = await getIdToken();
      if (!idToken) {
        throw new Error('User not authenticated');
      }
      const response = await api.patch<RestaurantResponse>(`/restaurants/${id}`, data, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to update restaurant');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const idToken = await getIdToken();
      if (!idToken) {
        throw new Error('User not authenticated');
      }
      const response = await api.delete(`/restaurants/${id}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete restaurant');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });

  const createRestaurant = useCallback(async (data: {
    name: string;
    type: string;
    location: string;
    rating?: number;
    imageUrl?: string | null;
  }) => {
    return createMutation.mutateAsync(data);
  }, [createMutation]);

  const updateRestaurant = useCallback(async (id: string, data: {
    name?: string;
    type?: string;
    location?: string;
    rating?: number;
    imageUrl?: string | null;
  }) => {
    return updateMutation.mutateAsync({ id, data });
  }, [updateMutation]);

  const deleteRestaurant = useCallback(async (id: string) => {
    return deleteMutation.mutateAsync(id);
  }, [deleteMutation]);

  const value: RestaurantContextType = {
    restaurants,
    loading,
    error: error as Error | null,
    fetchRestaurants: async () => {
      await fetchRestaurants();
    },
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
  };

  return <RestaurantContext.Provider value={value}>{children}</RestaurantContext.Provider>;
};

