import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';

export interface SearchRestaurant {
  id: number;
  name: string;
  type: string;
  location: string;
  imageUrl: string | null;
  rating: number;
}

export interface SearchProduct {
  id: number;
  name: string;
  description: string | null;
  price: string;
  image: string;
  images: string[];
  restaurant: {
    id: number;
    name: string;
    imageUrl: string | null;
  };
  category: {
    id: number;
    name: string;
  };
  rate: number;
  isFeatured: boolean;
}

export interface SearchRecommendations {
  restaurants: SearchRestaurant[];
  products: SearchProduct[];
}

export const useSearchRecommendations = (query: string, enabled = true) => {
  return useQuery<SearchRecommendations>({
    queryKey: ['search', 'recommendations', query],
    queryFn: async () => {
      if (!query.trim()) {
        return { restaurants: [], products: [] };
      }

      const response = await api.get<{ success: boolean; data: SearchRecommendations }>(
        `/search/recommendations?q=${encodeURIComponent(query)}&limit=8`
      );

      if (response.data.success) {
        return response.data.data;
      }

      throw new Error('Failed to fetch search recommendations');
    },
    enabled: enabled && query.trim().length > 0,
    staleTime: 30 * 1000,
    retry: 1,
  });
};

