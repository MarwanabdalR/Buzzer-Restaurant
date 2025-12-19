import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import { Product } from '../types/product';

export const useRestaurantProducts = (restaurantId: string | undefined) => {
  return useQuery<Product[]>({
    queryKey: ['products', 'restaurant', restaurantId],
    queryFn: async () => {
      if (!restaurantId) throw new Error('Restaurant ID is required');
      const response = await api.get<Product[]>('/products', {
        params: { restaurantId },
      });
      return Array.isArray(response.data) ? response.data : [];
    },
    enabled: !!restaurantId,
  });
};

