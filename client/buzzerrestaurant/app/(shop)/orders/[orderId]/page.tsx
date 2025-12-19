'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPinIcon } from '@heroicons/react/24/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { MobileHeader } from '../../../components/layout/MobileHeader';
import { Container } from '../../../components/layout/Container';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { ImageWithLoader } from '../../../components/ui/ImageWithLoader';
import { useOrders } from '../../../context/OrderContext';
import { Order } from '../../../types/order';
import { getRestaurantInfo } from '../../../lib/orderUtils';

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const orderId = Number(params.orderId);
  const { getOrderById, cancelOrder, refreshOrders } = useOrders();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const { data: order, isLoading } = useQuery<Order | null>({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <MobileHeader title="Track Order" showBackButton onMenuClick={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <MobileHeader title="Track Order" showBackButton onMenuClick={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Order not found</p>
        </div>
      </div>
    );
  }

  const restaurantInfo = order ? getRestaurantInfo(order) : null;
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'READY':
        return 'text-green-600';
      case 'PENDING':
        return 'text-yellow-600';
      case 'COMPLETED':
        return 'text-blue-600';
      case 'CANCELLED':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toUpperCase()) {
      case 'READY':
        return 'Ready';
      case 'PENDING':
        return 'Pending';
      case 'COMPLETED':
        return 'Completed';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const canCancelOrder = (status: string) => {
    const upperStatus = status.toUpperCase();
    return upperStatus === 'PENDING' || upperStatus === 'READY';
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    
    setIsCancelling(true);
    try {
      await cancelOrder(order.id);
      toast.success('Order cancelled successfully');
      setShowCancelConfirm(false);
      await queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      await refreshOrders();
      // Optionally navigate back to orders list
      // router.push('/orders');
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to cancel order');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <MobileHeader title="Track Order" showBackButton onMenuClick={() => {}} />
      
      <main className="flex-1 pb-20 overflow-y-auto">
        <Container>
          <div className="py-6">
            {/* Order Buzzer Circle */}
            <div className="flex flex-col items-center justify-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="relative w-48 h-48 mb-6"
              >
                <div className="absolute inset-0 bg-[#4d0d0d]/20 rounded-full blur-2xl animate-pulse" />
                <div className="relative w-full h-full bg-[#4d0d0d] rounded-full flex items-center justify-center shadow-2xl">
                  <div className="text-center text-white">
                    <div className="text-lg font-bold mb-1">Order No:</div>
                    <div className="text-3xl font-bold">{order.id}</div>
                    <div className="flex gap-1 justify-center mt-6">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${
                            i <= Math.floor((order.status === 'READY' ? 6 : order.status === 'COMPLETED' ? 8 : 3))
                              ? 'bg-white animate-pulse'
                              : 'bg-white/30'
                          }`}
                          style={{
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Order Price */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-[#4d0d0d] mb-2">
                  EGP {parseFloat(order.totalPrice).toFixed(2)}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-6">
                  Order No: {order.id}
                </div>

                {/* Restaurant Info */}
                {restaurantInfo && (
                  <div className="mb-4">
                    <div className="text-xl font-bold text-gray-900">
                      {restaurantInfo.name}
                    </div>
                    <div className="text-lg text-[#4d0d0d] mt-1">
                      {restaurantInfo.type}
                    </div>
                  </div>
                )}

                {/* Location */}
                {order.location && (
                  <div className="flex items-center justify-center gap-2 text-gray-600 mb-6">
                    <MapPinIcon className="w-5 h-5 text-[#4d0d0d]" />
                    <span className="text-sm">{order.location}</span>
                  </div>
                )}

                {/* Status */}
                <div className="mt-6">
                  <span className="text-gray-600 text-sm">Status: </span>
                  <span className={`font-bold text-lg ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Order Items */}
            {order.items.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl p-4 shadow-sm space-y-3"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-4">Order Items</h2>
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                      {item.product.image ? (
                        <ImageWithLoader
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm">{item.product.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Qty: {item.quantity} × EGP {parseFloat(item.price).toFixed(2)}
                      </div>
                      <div className="text-sm font-bold text-gray-900 mt-1">
                        EGP {(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">

              {canCancelOrder(order.status) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    className="w-full bg-red-600 text-white font-bold py-4 px-6 rounded-xl text-base uppercase tracking-wide hover:bg-red-700 transition-colors"
                  >
                    Cancel Order
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </Container>
      </main>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {showCancelConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCancelConfirm(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Cancel Order</h3>
                  <button
                    onClick={() => setShowCancelConfirm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to cancel Order #{order.id}? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCancelConfirm(false)}
                    disabled={isCancelling}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    No, Keep Order
                  </button>
                  <button
                    onClick={handleCancelOrder}
                    disabled={isCancelling}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

