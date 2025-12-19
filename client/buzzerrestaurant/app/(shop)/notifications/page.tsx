'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MobileHeader } from '../../components/layout/MobileHeader';
import { Container } from '../../components/layout/Container';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { NotificationList } from '../../components/notifications/NotificationList';
import { useOrders } from '../../context/OrderContext';

export default function NotificationsPage() {
  const router = useRouter();
  const { orders, isLoading, unreadCount, markAllAsRead } = useOrders();
  const [dismissedOrders, setDismissedOrders] = useState<Set<number>>(new Set());
  const hasMarkedAsReadRef = useRef(false);

  useEffect(() => {
    if (!isLoading && unreadCount > 0 && !hasMarkedAsReadRef.current) {
      markAllAsRead();
      hasMarkedAsReadRef.current = true;
    }
  }, [isLoading, unreadCount, markAllAsRead]);

  const handleDismiss = (orderId: number) => {
    setDismissedOrders((prev) => new Set(prev).add(orderId));
  };

  const handleRateSupplier = (orderId: number) => {
    router.push(`/orders/${orderId}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <MobileHeader title="Notifications" showBackButton onMenuClick={() => {}} />
        <div className="flex-1 flex items-center justify-center pb-20">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <MobileHeader title="Notifications" showBackButton onMenuClick={() => {}} />
      
      <main className="flex-1 pb-20 overflow-y-auto">
        <Container>
          <div className="py-4">
            <NotificationList
              orders={orders}
              dismissedOrderIds={dismissedOrders}
              onDismiss={handleDismiss}
              onRateSupplier={handleRateSupplier}
            />
          </div>
        </Container>
      </main>
    </div>
  );
}

