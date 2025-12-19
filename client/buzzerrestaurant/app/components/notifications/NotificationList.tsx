'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Order } from '../../types/order';
import { NotificationCard } from './NotificationCard';
import { formatTimeAgo, getRestaurantInfo } from '../../lib/orderUtils';

interface NotificationListProps {
  orders: Order[];
  dismissedOrderIds: Set<number>;
  onDismiss: (orderId: number) => void;
  onRateSupplier: (orderId: number) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  orders,
  dismissedOrderIds,
  onDismiss,
  onRateSupplier,
}) => {
  const visibleOrders = orders.filter((order) => !dismissedOrderIds.has(order.id));

  if (visibleOrders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <p className="text-gray-500">No notifications</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {visibleOrders.map((order, index) => {
        const restaurantInfo = getRestaurantInfo(order);
        const timeAgo = formatTimeAgo(order.createdAt);

        return (
          <NotificationCard
            key={order.id}
            order={order}
            index={index}
            onDismiss={onDismiss}
            onRateSupplier={onRateSupplier}
            restaurantInfo={restaurantInfo}
            timeAgo={timeAgo}
          />
        );
      })}
    </div>
  );
};

