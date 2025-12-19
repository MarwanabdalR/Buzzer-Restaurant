'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { HomeIcon, BellIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeIconSolid, BellIcon as BellIconSolid } from '@heroicons/react/24/solid';
import { useOrders } from '../../context/OrderContext';

interface BottomNavProps {}

export const BottomNav: React.FC<BottomNavProps> = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { unreadCount } = useOrders();

  const isHome = pathname === '/';
  const isNotifications = pathname === '/notifications';
  const isProfile = pathname?.includes('/profile');

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 safe-area-bottom"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-center justify-around px-2 py-1.5 max-w-md mx-auto">
        {/* Home Button */}
        <button
          onClick={() => router.push('/')}
          className="flex flex-col items-center justify-center py-2 px-3 flex-1 min-h-[56px] active:bg-gray-50 rounded-lg transition-colors touch-manipulation"
          aria-label="Home"
        >
          {isHome ? (
            <HomeIconSolid className="w-6 h-6 text-gray-700 mb-1" />
          ) : (
            <HomeIcon className="w-6 h-6 text-gray-400 mb-1" />
          )}
          <span
            className={`text-[10px] font-medium ${
              isHome ? 'text-gray-700' : 'text-gray-400'
            }`}
          >
            Home
          </span>
        </button>

        {/* Notifications Button */}
        <button
          onClick={() => router.push('/notifications')}
          className="relative flex flex-col items-center justify-center py-2 px-3 flex-1 min-h-[56px] active:bg-gray-50 rounded-lg transition-colors touch-manipulation"
          aria-label="Notifications"
        >
          <div className="relative">
            {isNotifications ? (
              <BellIconSolid className="w-6 h-6 text-gray-700 mb-1" />
            ) : (
              <BellIcon className="w-6 h-6 text-gray-400 mb-1" />
            )}
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold shadow-lg border-2 border-white"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </motion.div>
            )}
          </div>
          <span
            className={`text-[10px] font-medium ${
              isNotifications ? 'text-gray-700' : 'text-gray-400'
            }`}
          >
            Notifications
          </span>
        </button>

        {/* Profile Button */}
        <button
          onClick={() => router.push('/profile')}
          className="flex flex-col items-center justify-center py-2 px-3 flex-1 min-h-[56px] active:bg-gray-50 rounded-lg transition-colors touch-manipulation"
          aria-label="Profile"
        >
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center mb-1 transition-colors ${
              isProfile ? 'bg-[#FFB800]' : 'bg-gray-200'
            }`}
          >
            <svg
              className={`w-5 h-5 ${isProfile ? 'text-black' : 'text-gray-500'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <span
            className={`text-[10px] font-medium ${
              isProfile ? 'text-[#FFB800]' : 'text-gray-400'
            }`}
          >
            Profile
          </span>
        </button>
      </div>
    </nav>
  );
};

