'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import { Category, CategoryResponse } from '../types/category';
import toast from 'react-hot-toast';
import { getIdToken } from '../lib/firebase';

interface CategoryContextType {
  categories: Category[];
  isLoading: boolean;
  error: Error | null;
  createCategory: (data: { name: string; image?: string | null }) => Promise<Category>;
  updateCategory: (id: number, data: { name?: string; image?: string | null }) => Promise<Category>;
  deleteCategory: (id: number) => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
};

interface CategoryProviderProps {
  children: ReactNode;
}

export const CategoryProvider: React.FC<CategoryProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get<Category[]>('/categories');
      return Array.isArray(response.data) ? response.data : [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
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
        return (response.data as Category).id
          ? (response.data as Category)
          : ((response.data as CategoryResponse).data as Category);
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

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: { name?: string; image?: string | null };
    }) => {
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
        return (response.data as Category).id
          ? (response.data as Category)
          : ((response.data as CategoryResponse).data as Category);
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

  const deleteMutation = useMutation({
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

  const createCategory = async (data: { name: string; image?: string | null }): Promise<Category> => {
    return createMutation.mutateAsync(data);
  };

  const updateCategory = async (
    id: number,
    data: { name?: string; image?: string | null }
  ): Promise<Category> => {
    return updateMutation.mutateAsync({ id, data });
  };

  const deleteCategory = async (id: number): Promise<void> => {
    return deleteMutation.mutateAsync(id);
  };

  const value: CategoryContextType = {
    categories,
    isLoading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
  };

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
};

