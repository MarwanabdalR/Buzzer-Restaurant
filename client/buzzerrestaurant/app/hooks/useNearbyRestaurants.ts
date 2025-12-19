'use client';

import { useMutation } from '@tanstack/react-query';
import api from '../lib/axios';
import { Restaurant } from '../types';

interface NearbyRestaurantsRequest {
  userLat: number;
  userLng: number;
  radiusKM?: number;
}

interface NearbyRestaurantsResponse {
  success: boolean;
  message: string;
  data: Restaurant[];
}

export const useNearbyRestaurants = () => {
  return useMutation<Restaurant[], Error, NearbyRestaurantsRequest>({
    mutationFn: async ({ userLat, userLng, radiusKM = 10 }) => {
      const response = await api.post<NearbyRestaurantsResponse>('/restaurants/nearby', {
        userLat,
        userLng,
        radiusKM,
      });

      if (response.data.success) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to fetch nearby restaurants');
    },
  });
};

