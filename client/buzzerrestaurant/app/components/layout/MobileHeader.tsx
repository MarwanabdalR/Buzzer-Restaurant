'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { ShoppingBagIcon as ShoppingBagIconSolid } from '@heroicons/react/24/solid';
import { MenuButton } from './MenuButton';
import { BackButton } from './BackButton';
import { HeaderLogo } from './HeaderLogo';
import { useCart } from '../../context/CartContext';

interface MobileHeaderProps {
  onMenuClick: () => void;
  title?: string;
  showBackButton?: boolean;
}

const getPageTitle = (pathname: string): string => {
  const segments = pathname.replace(/^\//, '').split('/').filter(Boolean);
  
  if (segments.length === 0 || pathname === '/') {
    return 'Buzzer App';
  }

  const routeMap: Record<string, string> = {
    'profile': 'Profile',
    'edit': 'Edit Profile',
    'notifications': 'Notifications',
    'orders': 'Orders',
    'cards': 'Manage Cards',
  };

  const lastSegment = segments[segments.length - 1];
  
  if (routeMap[lastSegment]) {
    return routeMap[lastSegment];
  }

  return lastSegment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuClick, title, showBackButton = false }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { getItemCount } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  
  // Only get item count after component mounts to avoid hydration mismatch
  const itemCount = isMounted ? getItemCount() : 0;

  // Handle client-side mounting to avoid hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  
  const pageTitle = title || getPageTitle(pathname);
  const isHome = pathname === '/';
  const isCart = pathname === '/cart';

  const handleBack = () => {
    router.back();
  };

  const handleCartClick = () => {
    router.push('/cart');
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="md:hidden sticky top-0 z-40 w-full px-4 py-4 shadow-md"
      style={{
        background: 'linear-gradient(180deg, rgba(77, 13, 13, 0.95) 0%, rgba(61, 10, 10, 0.98) 100%)',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          {showBackButton ? (
            <BackButton onClick={handleBack} />
          ) : (
            <MenuButton onClick={onMenuClick} />
          )}
          <HeaderLogo title={pageTitle} isHome={isHome} />
        </div>
        
        {/* Cart Icon */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleCartClick}
          className="relative p-2 ml-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Cart"
        >
          {isCart ? (
            <ShoppingBagIconSolid className="w-6 h-6 text-white" />
          ) : (
            <ShoppingBagIcon className="w-6 h-6 text-white" />
          )}
          
          {itemCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-yellow-400 text-[#4d0d0d] rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 text-xs font-bold shadow-lg"
            >
              {itemCount > 99 ? '99+' : itemCount}
            </motion.div>
          )}
        </motion.button>
      </div>
    </motion.header>
  );
};

