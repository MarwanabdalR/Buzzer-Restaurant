'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  TrashIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ShoppingBagIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import api from '../../lib/axios';
import { getIdToken } from '../../lib/firebase';
import toast from 'react-hot-toast';
import Image from 'next/image';

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
  try {
    const idToken = await getIdToken();
    if (!idToken) throw new Error('Not authenticated');

    const params = status ? `?status=${status}` : '';
    const response = await api.get(`/orders/all${params}`, {
      headers: { Authorization: `Bearer ${idToken}` },
    });

    if (response.data.success) {
      return response.data.data || [];
    }
    throw new Error(response.data.message || 'Failed to fetch orders');
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    if (error.response?.status === 403) {
      throw new Error('You do not have permission to view orders. Please ensure you are logged in as an admin.');
    }
    throw error;
  }
};

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  const { data: orders = [], isLoading, error: queryError, refetch } = useQuery<Order[]>({
    queryKey: ['admin', 'orders', statusFilter],
    queryFn: () => fetchOrders(statusFilter || undefined),
    retry: 1,
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

  const deleteOrder = async (orderId: number) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    try {
      const idToken = await getIdToken();
      await api.delete(`/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${idToken}` }
      });
      toast.success('Order deleted successfully!');
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete order');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-50 text-green-700 border-green-200';
      case 'PENDING': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircleIconSolid className="w-5 h-5" />;
      case 'PENDING': return <ClockIcon className="w-5 h-5" />;
      case 'CANCELLED': return <XCircleIcon className="w-5 h-5" />;
      default: return <ClockIcon className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
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

  if (queryError) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <ShoppingBagIcon className="w-8 h-8 text-[#4d0d0d]" />
              Orders Management
            </h1>
            <p className="text-gray-600 mt-2">View and manage all customer orders</p>
          </div>
        </motion.div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <XCircleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Orders</h3>
          <p className="text-red-700 mb-4">
            {queryError instanceof Error ? queryError.message : 'Failed to load orders. Please try again.'}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => refetch()}
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Retry
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingBagIcon className="w-8 h-8 text-[#4d0d0d]" />
            Orders Management
          </h1>
          <p className="text-gray-600 mt-2">View and manage all customer orders</p>
        </div>
        <div className="text-sm text-gray-500">
          Total: <span className="font-semibold text-gray-900">{orders.length}</span> orders
        </div>
      </motion.div>

      <div className="flex flex-wrap gap-3 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setStatusFilter('')}
          className={`px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
            statusFilter === '' 
              ? 'bg-[#4d0d0d] text-white shadow-md' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <ShoppingBagIcon className="w-4 h-4" />
          All Orders
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setStatusFilter('PENDING')}
          className={`px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
            statusFilter === 'PENDING' 
              ? 'bg-yellow-500 text-white shadow-md' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <ClockIcon className="w-4 h-4" />
          Pending
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setStatusFilter('COMPLETED')}
          className={`px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
            statusFilter === 'COMPLETED' 
              ? 'bg-green-500 text-white shadow-md' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <CheckCircleIcon className="w-4 h-4" />
          Completed
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setStatusFilter('CANCELLED')}
          className={`px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
            statusFilter === 'CANCELLED' 
              ? 'bg-red-500 text-white shadow-md' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <XCircleIcon className="w-4 h-4" />
          Cancelled
        </motion.button>
      </div>

      <div className="space-y-4">
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-gray-900">Order #{order.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-semibold text-gray-900">{order.user.fullName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <PhoneIcon className="w-4 h-4 text-gray-400" />
                        <span>{order.user.mobileNumber}</span>
                      </div>
                      {order.user.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                          <span>{order.user.email}</span>
                        </div>
                      )}
                      {order.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPinIcon className="w-4 h-4 text-gray-400" />
                          <span>{order.location}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 text-right md:text-left md:pl-4 md:border-l md:border-gray-200">
                      <div className="flex items-center justify-end md:justify-start gap-2 text-sm text-gray-600">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="text-2xl font-bold text-[#4d0d0d]">
                        EGP {parseFloat(order.totalPrice).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <ShoppingBagIcon className="w-5 h-5 text-gray-400" />
                  Order Items ({order.items.length})
                </h4>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      {item.product.image && (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{item.product.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          EGP {parseFloat(item.price).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Total: EGP {(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {order.status === 'PENDING' && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => updateStatus(order.id, 'COMPLETED')}
                      className="flex-1 bg-green-500 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircleIcon className="w-5 h-5" />
                      Mark Completed
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => updateStatus(order.id, 'CANCELLED')}
                      className="flex-1 bg-red-500 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircleIcon className="w-5 h-5" />
                      Cancel Order
                    </motion.button>
                  </>
                )}
                {(order.status === 'COMPLETED' || order.status === 'CANCELLED') && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => deleteOrder(order.id)}
                    className="w-full bg-red-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <TrashIcon className="w-5 h-5" />
                    Delete Order
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {orders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">
              {statusFilter 
                ? `No ${statusFilter.toLowerCase()} orders at the moment.`
                : 'There are no orders in the system yet.'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

