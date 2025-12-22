import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import { Product, ProductResponse } from '../types/product';
import { getIdToken } from '../lib/firebase';
import toast from 'react-hot-toast';

export const useProducts = (categoryId?: number) => {
  return useQuery<Product[]>({
    queryKey: ['products', categoryId],
    queryFn: async () => {
      const params = categoryId ? { categoryId: categoryId.toString() } : {};
      const response = await api.get<Product[]>('/products', { params });
      return Array.isArray(response.data) ? response.data : [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

// create a product in the database
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      description?: string | null;
      price: string | number;
      originalPrice?: string | number | null;
      discountPercent?: number | null;
      image?: string | null;
      rate?: number | null;
      isFeatured?: boolean;
      categoryId: number;
      restaurantId?: string | null;
    }) => {
      const idToken = await getIdToken();
      if (!idToken) throw new Error('User not authenticated');

      const response = await api.post<ProductResponse>('/products', data, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (response.data.success || response.data) {
        return Array.isArray(response.data) ? response.data[0] : (response.data as any);
      }
      throw new Error('Failed to create product');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create product');
    },
  });
};

// update a product in the database
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: {
        name?: string;
        description?: string | null;
        price?: string | number;
        originalPrice?: string | number | null;
        discountPercent?: number | null;
        image?: string | null;
        rate?: number | null;
        isFeatured?: boolean;
        categoryId?: number;
        restaurantId?: string | null;
      };
    }) => {
      const idToken = await getIdToken();
      if (!idToken) throw new Error('User not authenticated');

      const response = await api.put<ProductResponse>(`/products/${id}`, data, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (response.data.success || response.data) {
        return Array.isArray(response.data) ? response.data[0] : (response.data as any);
      }
      throw new Error('Failed to update product');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update product');
    },
  });
};

// delete a product in the database
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const idToken = await getIdToken();
      if (!idToken) throw new Error('User not authenticated');

      await api.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    },
  });
};

