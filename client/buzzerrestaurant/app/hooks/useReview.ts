import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import { getIdToken } from '../lib/firebase';
import { Review } from '../types/product';
import toast from 'react-hot-toast';

interface CreateReviewData {
  rating: number;
  comment: string | null;
}

export const useReview = () => {
  const queryClient = useQueryClient();

  // create a review in the database
  const createReview = useMutation({
    mutationFn: async ({ productId, data }: { productId: number; data: CreateReviewData }) => {
      const idToken = await getIdToken();
      if (!idToken) throw new Error('Not authenticated');

      const response = await api.post<{ success: boolean; data: Review }>(
        `/reviews/${productId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (response.data.success) {
        return response.data.data;
      }
      throw new Error('Failed to create review');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    },
  });

  return {
    createReview: (productId: number, data: CreateReviewData) =>
      createReview.mutateAsync({ productId, data }),
    isSubmitting: createReview.isPending,
  };
};

