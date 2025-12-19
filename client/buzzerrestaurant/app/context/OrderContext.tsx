'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import { Order, OrderResponse } from '../types/order';
import { getIdToken } from '../lib/firebase';

interface OrderContextType {
  orders: Order[];
  isLoading: boolean;
  error: Error | null;
  unreadCount: number;
  markAsRead: (orderId: number) => void;
  markAllAsRead: () => void;
  getOrderById: (id: number) => Promise<Order | null>;
  refreshOrders: () => Promise<void>;
  cancelOrder: (orderId: number) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();
  const [readOrderIds, setReadOrderIds] = useState<Set<number>>(() => {
    if (typeof window === 'undefined') return new Set();
    try {
      const stored = localStorage.getItem('readOrderIds');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const {
    data: ordersResponse,
    isLoading,
    error,
  } = useQuery<OrderResponse>({
    queryKey: ['myOrders'],
    queryFn: async () => {
      const idToken = await getIdToken();
      if (!idToken) throw new Error('Not authenticated');

      const response = await api.get<OrderResponse>('/orders', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
    refetchInterval: 30 * 1000,
    enabled: typeof window !== 'undefined',
  });

  const orders: Order[] = Array.isArray(ordersResponse?.data)
    ? ordersResponse.data
    : ordersResponse?.data
    ? [ordersResponse.data]
    : [];

  const unreadCount = orders.filter(order => !readOrderIds.has(order.id)).length;

  useEffect(() => {
    if (typeof window !== 'undefined' && readOrderIds.size > 0) {
      localStorage.setItem('readOrderIds', JSON.stringify(Array.from(readOrderIds)));
    }
  }, [readOrderIds]);

  const markAsRead = useCallback((orderId: number) => {
    setReadOrderIds(prev => {
      if (prev.has(orderId)) return prev;
      return new Set(prev).add(orderId);
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setReadOrderIds(prev => {
      const allOrderIds = new Set(orders.map(order => order.id));
      if (allOrderIds.size === prev.size && Array.from(allOrderIds).every(id => prev.has(id))) {
        return prev;
      }
      return allOrderIds;
    });
  }, [orders]);

  const getOrderById = async (id: number): Promise<Order | null> => {
    try {
      const idToken = await getIdToken();
      if (!idToken) throw new Error('Not authenticated');

      const response = await api.get<OrderResponse>(`/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (response.data.success && response.data.data) {
        return Array.isArray(response.data.data)
          ? response.data.data[0]
          : response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch order:', error);
      return null;
    }
  };

  const refreshOrders = async () => {
    await queryClient.invalidateQueries({ queryKey: ['myOrders'] });
    await queryClient.invalidateQueries({ queryKey: ['order'] });
  };

  const cancelOrder = async (orderId: number) => {
    try {
      const idToken = await getIdToken();
      if (!idToken) throw new Error('Not authenticated');

      const response = await api.patch(
        `/orders/${orderId}`,
        { status: 'CANCELLED' },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (response.data.success) {
        await refreshOrders();
      } else {
        throw new Error(response.data.message || 'Failed to cancel order');
      }
    } catch (error: any) {
      console.error('Failed to cancel order:', error);
      throw error;
    }
  };

  const value: OrderContextType = {
    orders,
    isLoading,
    error: error as Error | null,
    unreadCount,
    markAsRead,
    markAllAsRead,
    getOrderById,
    refreshOrders,
    cancelOrder,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

