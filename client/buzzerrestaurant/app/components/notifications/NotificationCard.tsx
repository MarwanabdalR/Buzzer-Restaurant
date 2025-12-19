'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { Order } from '../../types/order';

interface NotificationCardProps {
  order: Order;
  index: number;
  onDismiss: (orderId: number) => void;
  onRateSupplier: (orderId: number) => void;
  restaurantInfo: {
    name: string;
    type: string;
    imageUrl: string | null;
  };
  timeAgo: string;
}

function getNotificationTitle(order: Order): string {
  if (order.status === 'COMPLETED') {
    return 'Your Order has been marked as complete';
  }
  return 'Your Order has been placed';
}

function getNotificationMessage(order: Order): string {
  if (order.status === 'COMPLETED') {
    return `Your Order#${order.id} has been marked as complete. Kindly spare a moment and rate the supplier.`;
  }
  return `Your Order#${order.id} has been placed, kindly check the orders tab to check the status of your orders.`;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  order,
  index,
  onDismiss,
  onRateSupplier,
  restaurantInfo,
  timeAgo,
}) => {
  const firstItem = order.items[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl p-4 border-l-4 border-[#4d0d0d] relative"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900">{restaurantInfo.name}</span>
            <span className="text-gray-400">-</span>
            <span className="text-gray-600 text-sm">{restaurantInfo.type}</span>
          </div>
          <span className="text-xs text-gray-500">{timeAgo}</span>
        </div>
        <button
          onClick={() => onDismiss(order.id)}
          className="text-gray-400 hover:text-gray-600 p-1"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="flex gap-3 mb-3">
        {(restaurantInfo.imageUrl || firstItem?.product.image) && (
          <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
            <Image
              src={restaurantInfo.imageUrl || firstItem?.product.image || ''}
              alt={restaurantInfo.name}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-1">{getNotificationTitle(order)}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {getNotificationMessage(order)}
          </p>
        </div>
      </div>

      {order.status === 'COMPLETED' && (
        <div className="mt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onRateSupplier(order.id)}
            className="w-full bg-[#FFB800] text-[#4d0d0d] font-bold py-3 px-6 rounded-lg"
          >
            RATE SUPPLIER
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

