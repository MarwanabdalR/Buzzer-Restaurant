'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MenuButton } from './MenuButton';
import { BackButton } from './BackButton';
import { HeaderLogo } from './HeaderLogo';

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
  
  const pageTitle = title || getPageTitle(pathname);
  const isHome = pathname === '/';

  const handleBack = () => {
    router.back();
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-40 w-full px-4 py-4 shadow-md"
      style={{
        background: 'linear-gradient(180deg, rgba(77, 13, 13, 0.95) 0%, rgba(61, 10, 10, 0.98) 100%)',
      }}
    >
      <div className="flex items-center">
        {showBackButton ? (
          <BackButton onClick={handleBack} />
        ) : (
          <MenuButton onClick={onMenuClick} />
        )}
        <HeaderLogo title={pageTitle} isHome={isHome} />
      </div>
    </motion.header>
  );
};

