'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';
import { getIdToken } from '../../lib/firebase';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface OrderItem {
  id: number;
  quantity: number;
  price: string;
  product: {
    id: number;
    name: string;
    image: string | null;
    price: string;
  };
}

interface Order {
  id: number;
  totalPrice: string;
  status: string;
  createdAt: string;
  location: string | null;
  user: {
    id: number;
    fullName: string;
    mobileNumber: string;
    email: string | null;
  };
  items: OrderItem[];
}

const fetchOrders = async (status?: string) => {
  const idToken = await getIdToken();
  if (!idToken) throw new Error('Not authenticated');

  const params = status ? `?status=${status}` : '';
  const response = await api.get(`/orders/all${params}`, {
    headers: { Authorization: `Bearer ${idToken}` },
  });

  if (response.data.success) {
    return response.data.data;
  }
  throw new Error(response.data.message);
};

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  const { data: orders = [], isLoading, refetch } = useQuery<Order[]>({
    queryKey: ['admin', 'orders', statusFilter],
    queryFn: () => fetchOrders(statusFilter || undefined),
  });

  const updateStatus = async (orderId: number, newStatus: string) => {
    try {
      const idToken = await getIdToken();
      await api.patch(
        `/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );
      toast.success('Order status updated!');
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update order');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-4 border-[#4d0d0d] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-2">Manage all customer orders</p>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setStatusFilter('')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            statusFilter === '' ? 'bg-[#4d0d0d] text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setStatusFilter('PENDING')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            statusFilter === 'PENDING' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setStatusFilter('COMPLETED')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            statusFilter === 'COMPLETED' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setStatusFilter('CANCELLED')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            statusFilter === 'CANCELLED' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Cancelled
        </button>
      </div>

      <div className="space-y-4">
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                <p className="text-sm text-gray-600">{order.user.fullName}</p>
                <p className="text-sm text-gray-600">{order.user.mobileNumber}</p>
                {order.location && <p className="text-sm text-gray-600">{order.location}</p>}
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <p className="text-lg font-bold text-gray-900 mt-2">
                  ${parseFloat(order.totalPrice).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">
                      {item.product.name} x{item.quantity}
                    </span>
                    <span className="font-medium text-gray-900">
                      ${parseFloat(item.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {order.status === 'PENDING' && (
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => updateStatus(order.id, 'COMPLETED')}
                  className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Mark Completed
                </button>
                <button
                  onClick={() => updateStatus(order.id, 'CANCELLED')}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Cancel Order
                </button>
              </div>
            )}
          </motion.div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No orders found
          </div>
        )}
      </div>
    </div>
  );
}

