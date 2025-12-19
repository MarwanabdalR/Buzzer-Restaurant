'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { MapPinIcon } from '@heroicons/react/24/solid';
import { MobileHeader } from '../../components/layout/MobileHeader';
import { Container } from '../../components/layout/Container';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useOrders } from '../../context/OrderContext';
import { formatTimeAgo, getRestaurantInfo } from '../../lib/orderUtils';
import { ImageWithLoader } from '../../components/ui/ImageWithLoader';

export default function OrdersPage() {
  const router = useRouter();
  const { orders, isLoading, cancelOrder, refreshOrders } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState<number | null>(null);

  const filteredOrders = orders.filter((order) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const restaurantInfo = getRestaurantInfo(order);
    return (
      order.id.toString().includes(query) ||
      restaurantInfo.name.toLowerCase().includes(query) ||
      order.status.toLowerCase().includes(query)
    );
  });

  const handleOrderClick = (orderId: number) => {
    router.push(`/orders/${orderId}`);
  };

  const canCancelOrder = (status: string) => {
    const upperStatus = status.toUpperCase();
    return upperStatus === 'PENDING' || upperStatus === 'READY';
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'text-orange-600';
      case 'ACCEPTED':
      case 'READY':
        return 'text-green-600';
      case 'CANCELLED':
        return 'text-red-600';
      case 'COMPLETED':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const t = useTranslations('Orders');
  const tCommon = useTranslations('Common');
  const tSuccess = useTranslations('Success');

  const getStatusText = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACCEPTED':
        return t('accepted');
      case 'READY':
        return t('ready');
      case 'PENDING':
        return t('pending');
      case 'COMPLETED':
        return t('completed');
      case 'CANCELLED':
        return t('cancelled');
      default:
        return status;
    }
  };

  const isPaid = (status: string) => {
    const upperStatus = status.toUpperCase();
    return upperStatus === 'ACCEPTED' || upperStatus === 'READY' || upperStatus === 'COMPLETED';
  };

  const handleCancelClick = (e: React.MouseEvent, orderId: number) => {
    e.stopPropagation();
    setShowCancelConfirm(orderId);
  };

  const handleCancelConfirm = async (orderId: number) => {
    setCancellingOrderId(orderId);
    try {
      await cancelOrder(orderId);
      toast.success(tSuccess('orderCancelled'));
      setShowCancelConfirm(null);
      await refreshOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || t('cancelOrder') + ' failed');
    } finally {
      setCancellingOrderId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <MobileHeader title={t('title')} showBackButton onMenuClick={() => {}} />
        <div className="flex-1 flex items-center justify-center pb-20">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (filteredOrders.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <MobileHeader title={t('title')} showBackButton onMenuClick={() => {}} />
        
        <main className="flex-1 pb-20 overflow-y-auto">
          {/* Search Bar */}
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('trackOrder')}
                className="flex-1 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFB800] text-sm"
              />
              <button className="bg-[#FFB800] text-black p-2 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          <Container>
            <div className="py-12 text-center">
              <p className="text-gray-500">{t('noOrders')}</p>
            </div>
          </Container>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Mobile Header - hidden on desktop */}
      <div className="md:hidden">
        <MobileHeader title={t('title')} showBackButton onMenuClick={() => {}} />
      </div>
      
      <main className="flex-1 pb-20 md:pb-0 overflow-y-auto">
        {/* Mobile View */}
        <div className="md:hidden">
        {/* Search Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Track your order"
              className="flex-1 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFB800] text-sm"
            />
            <button className="bg-[#FFB800] text-black p-2 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        <Container>
          <div className="py-4 space-y-4">
            {filteredOrders.map((order, index) => {
              const restaurantInfo = getRestaurantInfo(order);
              const timeAgo = formatTimeAgo(order.createdAt);

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleOrderClick(order.id)}
                  className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-[#4d0d0d] cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    {/* Restaurant Image */}
                    <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0">
                      {restaurantInfo.imageUrl ? (
                        <ImageWithLoader
                          src={restaurantInfo.imageUrl}
                          alt={restaurantInfo.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-xs font-bold">
                            {restaurantInfo.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Order Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 truncate">
                            {restaurantInfo.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">{timeAgo}</p>
                        </div>
                        <span className="text-xs text-gray-500 shrink-0 ml-2">{timeAgo}</span>
                      </div>

                      <div className="mt-2">
                        <p className="font-bold text-gray-900 text-sm">
                          Your Order#{order.id} {order.status.toUpperCase() === 'COMPLETED' 
                            ? 'has been marked as complete' 
                            : order.status.toUpperCase() === 'CANCELLED'
                            ? 'has been cancelled'
                            : `is ${order.status.toLowerCase()}`}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {order.status.toUpperCase() === 'COMPLETED' 
                            ? 'Your Order has been marked as complete. Kindly spare a moment and rate the supplier.' 
                            : order.status.toUpperCase() === 'CANCELLED'
                            ? 'This order has been cancelled.'
                            : 'Your Order has been placed. Kindly check the orders tab to check the status of your orders.'}
                        </p>
                      </div>

                      {canCancelOrder(order.status) && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => handleCancelClick(e, order.id)}
                          disabled={cancellingOrderId === order.id}
                          className="mt-3 w-full bg-red-600 text-white font-bold py-2 px-4 rounded-lg text-xs uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {cancellingOrderId === order.id ? t('cancelling') : t('cancelOrder')}
                        </motion.button>
                      )}
                    </div>

                    {/* Dismiss Icon */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle dismiss if needed
                      }}
                      className="shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Container>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block bg-white">
          <Container>
            <div className="py-8">
              {/* Search Bar */}
              <div className="mb-8">
                <div className="flex gap-3 max-w-2xl">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('trackOrder')}
                    className="flex-1 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFB800] text-sm"
                  />
                  <button className="bg-[#FFB800] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#E5A700] transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Orders Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredOrders.map((order, index) => {
                  const restaurantInfo = getRestaurantInfo(order);
                  const statusColor = getStatusColor(order.status);
                  const statusText = getStatusText(order.status);
                  const paid = isPaid(order.status);
                  // Get restaurant location from the restaurant data if available, otherwise use restaurant name
                  const restaurantLocation = (order.items[0]?.product?.restaurant as any)?.location || restaurantInfo.name || tCommon('location');

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleOrderClick(order.id)}
                      className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative"
                    >
                      {/* Status Badge - Top Right */}
                      <div className={`absolute top-4 right-4 font-bold text-sm ${statusColor}`}>
                        {statusText}
                      </div>

                      {/* Payment Status Stamp */}
                      {order.status.toUpperCase() !== 'CANCELLED' && (
                        <div className="absolute right-6 top-20">
                          {paid ? (
                            <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-sm">{t('paid')}</span>
                            </div>
                          ) : (
                            <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-xs">{t('notPaid')}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Order Content */}
                      <div className="pr-24">
                        {/* Order ID */}
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                          {t('order')}#{' '}
                          <span className="font-mono">{order.id.toString().toLowerCase()}</span>
                        </h3>

                        {/* Location */}
                        <p className="text-gray-700 mb-2">{order.location || tCommon('location') + ' ' + tCommon('notSet')}</p>

                        {/* Restaurant Type */}
                        <p className="text-[#4d0d0d] font-medium mb-3">{restaurantInfo.type}</p>

                        {/* Address */}
                        <div className="flex items-start gap-2 text-gray-600 mb-4">
                          <MapPinIcon className="w-5 h-5 text-[#4d0d0d] mt-0.5 shrink-0" />
                          <span className="text-sm">{restaurantLocation}</span>
                        </div>

                        {/* Price */}
                        <div className="pt-4 border-t border-gray-200">
                          <p className="text-xl font-bold text-[#4d0d0d]">
                            EGP {parseFloat(order.totalPrice).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">{t('noOrders')}</p>
                  <p className="text-gray-400 text-sm mt-2">{tCommon('tryAgain')}</p>
                </div>
              )}
            </div>
          </Container>
        </div>
      </main>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {showCancelConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCancelConfirm(null)}
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
                  <h3 className="text-xl font-bold text-gray-900">{t('cancelConfirmTitle')}</h3>
                  <button
                    onClick={() => setShowCancelConfirm(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-gray-600 mb-6">
                  {t('cancelConfirmMessage', { orderId: showCancelConfirm })}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCancelConfirm(null)}
                    disabled={cancellingOrderId !== null}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    {t('keepOrder')}
                  </button>
                  <button
                    onClick={() => showCancelConfirm && handleCancelConfirm(showCancelConfirm)}
                    disabled={cancellingOrderId !== null}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cancellingOrderId !== null ? t('cancelling') : t('yesCancel')}
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

