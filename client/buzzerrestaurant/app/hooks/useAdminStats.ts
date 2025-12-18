import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import { DashboardStats, StatsResponse } from '../types/admin';
import { getIdToken } from '../lib/firebase';

export const useAdminStats = () => {
  return useQuery<DashboardStats>({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      try {
        const idToken = await getIdToken();
        if (!idToken) {
          throw new Error('User not authenticated');
        }

        const response = await api.get<StatsResponse>('/admin/stats');

        if (response.data.success) {
          return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch dashboard statistics');
      } catch (error: any) {
        console.error('Error fetching admin stats:', error);
        const errorMessage = 
          error.response?.data?.message || 
          error.message || 
          'Failed to fetch dashboard statistics';
        throw new Error(errorMessage);
      }
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
    retry: 1,
  });
};

