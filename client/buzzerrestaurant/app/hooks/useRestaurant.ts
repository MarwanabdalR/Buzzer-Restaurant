import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import { Restaurant } from '../types';

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

