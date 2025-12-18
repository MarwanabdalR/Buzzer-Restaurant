import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import { Category, CategoryResponse } from '../types/category';
import { getIdToken } from '../lib/firebase';
import toast from 'react-hot-toast';

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get<Category[]>('/categories');
      return Array.isArray(response.data) ? response.data : [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; image?: string | null }) => {
      const idToken = await getIdToken();
      if (!idToken) throw new Error('User not authenticated');

      const payload = {
        name: data.name,
        image: data.image || null,
      };

      const response = await api.post<Category | CategoryResponse>('/categories', payload, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if ((response.data as any).success || (response.data as Category).id) {
        return (response.data as Category).id ? (response.data as Category) : ((response.data as CategoryResponse).data as Category);
      }
      throw new Error('Failed to create category');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create category');
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { name?: string; image?: string | null } }) => {
      const idToken = await getIdToken();
      if (!idToken) throw new Error('User not authenticated');

      const payload = {
        name: data.name,
        image: data.image || null,
      };

      const response = await api.put<Category | CategoryResponse>(`/categories/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if ((response.data as any).success || (response.data as Category).id) {
        return (response.data as Category).id ? (response.data as Category) : ((response.data as CategoryResponse).data as Category);
      }
      throw new Error('Failed to update category');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update category');
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const idToken = await getIdToken();
      if (!idToken) throw new Error('User not authenticated');

      await api.delete(`/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete category');
    },
  });
};

