'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import { Product, ProductResponse } from '../types/product';
import toast from 'react-hot-toast';
import { getIdToken } from '../lib/firebase';

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  error: Error | null;
  createProduct: (data: {
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
  }) => Promise<Product>;
  updateProduct: (
    id: number,
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
    }
  ) => Promise<Product>;
  deleteProduct: (id: number) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await api.get<Product[]>('/products');
      return Array.isArray(response.data) ? response.data : [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
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
        return Array.isArray(response.data)
          ? response.data[0]
          : ((response.data as ProductResponse).data as Product);
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

  const updateMutation = useMutation({
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
        return Array.isArray(response.data)
          ? response.data[0]
          : ((response.data as ProductResponse).data as Product);
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

  const deleteMutation = useMutation({
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

  const createProduct = async (data: {
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
  }): Promise<Product> => {
    return createMutation.mutateAsync(data);
  };

  const updateProduct = async (
    id: number,
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
    }
  ): Promise<Product> => {
    return updateMutation.mutateAsync({ id, data });
  };

  const deleteProduct = async (id: number): Promise<void> => {
    return deleteMutation.mutateAsync(id);
  };

  const value: ProductContextType = {
    products,
    isLoading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

