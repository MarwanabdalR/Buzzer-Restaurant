'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserIcon, 
  BellIcon, 
  Bars3Icon,
  ShoppingBagIcon 
} from '@heroicons/react/24/outline';
import { BellIcon as BellIconSolid } from '@heroicons/react/24/solid';
import { useOrders } from '../../context/OrderContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatTimeAgo, getRestaurantInfo } from '../../lib/orderUtils';
import { DesktopSidebar } from './DesktopSidebar';
import { useTranslations } from 'next-intl';

export const DesktopHeader: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { orders, unreadCount, markAllAsRead } = useOrders();
  const { getItemCount } = useCart();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('Navigation');
  const tCommon = useTranslations('Common');
  const tNotifications = useTranslations('Notifications');
  
  // Only get item count after component mounts to avoid hydration mismatch
  const itemCount = isMounted ? getItemCount() : 0;

  // Handle client-side mounting to avoid hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const navItems = [
    { label: t('home'), path: '/' },
    { label: t('products'), path: '/products' },
    { label: t('aboutUs'), path: '/about-us' },
    { label: t('contactUs'), path: '/contact-us' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(path);
  };

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
      markAllAsRead();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, markAllAsRead]);

  const handleCartClick = () => {
    router.push('/cart');
  };

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const handleNotificationClick = (orderId: number) => {
    router.push(`/orders/${orderId}`);
    setShowNotifications(false);
  };

  return (
    <header className="hidden md:flex items-center justify-between px-6 lg:px-12 py-4 bg-[#4d0d0d] shadow-lg sticky top-0 z-50">
      {/* Logo */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push('/')}
        className="flex items-center gap-2"
      >
        <Image
          src="/Buzzer-Image.png"
          alt="Buzzer Logo"
          width={40}
          height={40}
          className="object-contain"
        />
        <span className="text-white text-xl font-bold tracking-wide">Buzzer App</span>
      </motion.button>

      {/* Navigation Links */}
      <nav className="flex items-center gap-8">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`relative px-3 py-2 font-medium transition-colors ${
              isActive(item.path)
                ? 'text-[#FFB800]'
                : 'text-white/90 hover:text-[#FFB800]'
            }`}
          >
            {item.label}
            {isActive(item.path) && (
              <motion.div
                layoutId="activeNav"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FFB800]"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </nav>

      {/* Right Icons */}
      <div className="flex items-center gap-4">
        {/* Cart Icon */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleCartClick}
          className="relative p-2 text-white hover:text-[#FFB800] transition-colors"
          aria-label="Cart"
        >
          <ShoppingBagIcon className="w-6 h-6" />
          {itemCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-[#FFB800] text-[#4d0d0d] rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 text-xs font-bold"
            >
              {itemCount > 99 ? '99+' : itemCount}
            </motion.div>
          )}
        </motion.button>

        {/* Profile Icon */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleProfileClick}
          className="p-2 text-white hover:text-[#FFB800] transition-colors"
          aria-label="Profile"
        >
          <UserIcon className="w-6 h-6" />
        </motion.button>

        {/* Notifications Icon with Dropdown */}
        <div className="relative" ref={notificationRef}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-white hover:text-[#FFB800] transition-colors"
            aria-label="Notifications"
          >
            {showNotifications ? (
              <BellIconSolid className="w-6 h-6" />
            ) : (
              <BellIcon className="w-6 h-6" />
            )}
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 text-xs font-bold"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </motion.div>
            )}
          </motion.button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[600px] overflow-hidden flex flex-col z-50"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">{tCommon('notifications')}</h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Today Section */}
                <div className="px-6 py-2 bg-gray-50">
                  <span className="text-xs text-gray-500 font-medium">Today</span>
                </div>

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto max-h-[500px]">
                  {orders.length === 0 ? (
                    <div className="px-6 py-8 text-center text-gray-500">
                      {tNotifications('noNotifications')}
                    </div>
                  ) : (
                    <div className="px-4 py-2 space-y-3">
                      {orders.slice(0, 10).map((order, index) => {
                        const restaurantInfo = getRestaurantInfo(order);
                        const timeAgo = formatTimeAgo(order.createdAt);
                        
                        return (
                          <motion.div
                            key={order.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleNotificationClick(order.id)}
                            className="bg-white border-l-4 border-[#4d0d0d] rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-gray-900 text-sm">
                                    {restaurantInfo.name}
                                  </span>
                                  <span className="text-gray-400">-</span>
                                  <span className="text-gray-600 text-xs">{restaurantInfo.type}</span>
                                </div>
                                <span className="text-xs text-gray-500">{timeAgo}</span>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              {restaurantInfo.imageUrl && (
                                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                                  <Image
                                    src={restaurantInfo.imageUrl}
                                    alt={restaurantInfo.name}
                                    fill
                                    className="object-cover"
                                    sizes="48px"
                                  />
                                </div>
                              )}
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-sm mb-1">
                                  {order.status === 'COMPLETED' 
                                    ? 'Your order has been marked as complete' 
                                    : 'Your order has been placed'}
                                </h4>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                  Your Order#{order.id} {order.status === 'COMPLETED' 
                                    ? 'has been marked as complete. Kindly spare a moment and rate the supplier.'
                                    : 'has been placed, kindly check the Order tab to check the status of your orders.'}
                                </p>
                              </div>
                            </div>

                            {order.status === 'COMPLETED' && (
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/orders/${order.id}`);
                                  setShowNotifications(false);
                                }}
                                className="mt-3 w-full bg-[#FFB800] text-[#4d0d0d] font-bold py-2 px-4 rounded-lg text-xs uppercase tracking-wide"
                              >
                                Rate Supplier
                              </motion.button>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* View All Button */}
                {orders.length > 0 && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        router.push('/notifications');
                        setShowNotifications(false);
                      }}
                      className="w-full text-center text-[#4d0d0d] font-medium hover:text-[#FFB800] transition-colors text-sm"
                    >
                      View All Notifications
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Menu Icon */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-white hover:text-[#FFB800] transition-colors"
          aria-label="Menu"
        >
          <Bars3Icon className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Desktop Sidebar */}
      <DesktopSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </header>
  );
};

