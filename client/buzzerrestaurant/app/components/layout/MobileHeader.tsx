'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

interface MobileHeaderProps {
  onMenuClick: () => void;
  title?: string; // Optional custom title, otherwise auto-detect from pathname
}

const getPageTitle = (pathname: string): string => {
  // Remove leading slash and split by /
  const segments = pathname.replace(/^\//, '').split('/').filter(Boolean);
  
  if (segments.length === 0 || pathname === '/') {
    return 'Buzzer App';
  }

  // Map common routes to titles
  const routeMap: Record<string, string> = {
    'profile': 'Profile',
    'edit': 'Edit Profile',
    'notifications': 'Notifications',
    'orders': 'Orders',
    'cards': 'Manage Cards',
  };

  // Get the last segment (current page)
  const lastSegment = segments[segments.length - 1];
  
  // If it's a mapped route, use that title
  if (routeMap[lastSegment]) {
    return routeMap[lastSegment];
  }

  // Otherwise capitalize first letter and replace hyphens with spaces
  return lastSegment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuClick, title }) => {
  const pathname = usePathname();
  const router = useRouter();
  
  const pageTitle = title || getPageTitle(pathname);
  const isHome = pathname === '/';

  const handleLogoClick = () => {
    if (!isHome) {
      router.push('/');
    }
  };

  return (
    <header 
      className="sticky top-0 z-40 w-full px-4 py-4 shadow-md"
      style={{
        background: 'linear-gradient(180deg, rgba(77, 13, 13, 0.95) 0%, rgba(61, 10, 10, 0.98) 100%)',
      }}
    >
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="mr-4 p-2 text-[#D4AF37] hover:text-[#F5D76E] transition-colors active:scale-95"
          aria-label="Open menu"
          style={{ filter: 'drop-shadow(0 0 4px rgba(212, 175, 55, 0.5))' }}
        >
          {/* Custom Hamburger Icon with different line lengths */}
          <div className="flex flex-col space-y-1.5">
            <div className="h-0.5 bg-current rounded" style={{ width: '20px' }} />
            <div className="h-0.5 bg-current rounded" style={{ width: '24px' }} />
            <div className="h-0.5 bg-current rounded" style={{ width: '18px' }} />
          </div>
        </button>
        
        <button
          onClick={handleLogoClick}
          className="flex items-center flex-1"
        >
          {isHome ? (
            <>
              <Image
                src="/Buzzer-Image.png"
                alt="Buzzer Logo"
                width={32}
                height={32}
                className="object-contain mr-2"
              />
              <h1 
                className="text-white text-lg font-semibold tracking-wide"
                style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.3)' }}
              >
                {pageTitle}
              </h1>
            </>
          ) : (
            <>
              <Image
                src="/Buzzer-Image.png"
                alt="Buzzer Logo"
                width={28}
                height={28}
                className="object-contain mr-3"
              />
              <h1 
                className="text-white text-lg font-semibold tracking-wide"
                style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.3)' }}
              >
                {pageTitle}
              </h1>
            </>
          )}
        </button>
      </div>
    </header>
  );
};

