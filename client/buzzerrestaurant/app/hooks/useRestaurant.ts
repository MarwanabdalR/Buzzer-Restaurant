import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import { Restaurant } from '../types';
import { getIdToken } from '../lib/firebase';
import toast from 'react-hot-toast';

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

// Hook for fetching all restaurants
export const useRestaurants = () => {
  return useQuery<Restaurant[]>({
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
};

// fetch a single restaurant by ID
export const useRestaurant = (restaurantId: string | undefined) => {
  return useQuery<Restaurant>({
    queryKey: ['restaurant', restaurantId],
    queryFn: async () => {
      if (!restaurantId) throw new Error('Restaurant ID is required');
      const response = await api.get<Restaurant>(`/restaurants/${restaurantId}`);
      return response.data;
    },
    enabled: !!restaurantId,
  });
};

// create a restaurant in the database
export const useCreateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      type: string;
      location: string;
      rating?: number;
      imageUrl?: string | null;
      latitude?: number | null;
      longitude?: number | null;
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
      toast.success('Restaurant created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create restaurant');
    },
  });
};

// update a restaurant in the database
export const useUpdateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { 
      id: string; 
      data: {
        name?: string;
        type?: string;
        location?: string;
        rating?: number;
        imageUrl?: string | null;
        latitude?: number | null;
        longitude?: number | null;
      }
    }) => {
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
      queryClient.invalidateQueries({ queryKey: ['restaurant'] });
      toast.success('Restaurant updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update restaurant');
    },
  });
};

// delete a restaurant in the database
export const useDeleteRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
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
      toast.success('Restaurant deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete restaurant');
    },
  });
};

