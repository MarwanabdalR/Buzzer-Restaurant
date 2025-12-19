'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { PowerIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem?: string;
}

const navigationItems = [
  'Restaurants',
  'Featured Products',
  'Suppliers',
  'FAQs',
  'Settings',
  'About Us',
  'Contact Us',
  'Privacy Policy',
  'Terms & Conditions',
];

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose,
  activeItem = 'Restaurants',
}) => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleNavigation = (item: string) => {
    onClose();
    
    switch (item) {
      case 'Restaurants':
        router.push('/');
        break;
      case 'Featured Products':
        router.push('/featured-products');
        break;
      case 'Suppliers':
        router.push('/');
        break;
      case 'FAQs':
        router.push('/faqs');
        break;
      case 'Settings':
        router.push('/settings');
        break;
      case 'About Us':
        router.push('/about-us');
        break;
      case 'Contact Us':
        router.push('/contact-us');
        break;
      case 'Privacy Policy':
        router.push('/privacy-policy');
        break;
      case 'Terms & Conditions':
        router.push('/terms-conditions');
        break;
      default:
        break;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="md:hidden fixed inset-0 bg-black/50 z-40"
            />
          </>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="md:hidden fixed left-0 top-0 bottom-0 w-80 z-50 overflow-y-auto"
            style={{ backgroundColor: '#4d0d0d' }}
          >
            <div className="flex flex-col h-full">
              {/* Logo Section */}
              <div className="flex flex-col items-center py-6 px-4 relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
                <Image
                  src="/Buzzer-Image.png"
                  alt="Buzzer Logo"
                  width={60}
                  height={60}
                  className="object-contain mb-3"
                />
                <h2 className="text-white text-lg font-bold uppercase tracking-wide">Buzzer App</h2>
                <div className="w-full h-px bg-gray-400/30 mt-4" />
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 py-2 overflow-y-auto">
                <ul className="space-y-0.5 px-2">
                  {navigationItems.map((item) => {
                    const isActive = item === activeItem;
                    return (
                      <li key={item}>
                        <button
                          onClick={() => handleNavigation(item)}
                          className={`w-full text-left text-sm px-4 py-3 rounded-lg transition-colors relative ${
                            isActive
                              ? 'text-white'
                              : 'text-white/90 hover:text-white hover:bg-white/10'
                          }`}
                          style={
                            isActive
                              ? {
                                  backgroundColor: 'rgba(118, 24, 24, 0.6)',
                                }
                              : {}
                          }
                        >
                          {isActive && (
                            <div
                              className="absolute left-0 top-1 bottom-1 w-1 rounded-r-full"
                              style={{ backgroundColor: '#FFB800' }}
                            />
                          )}
                          <span className="text-sm font-normal">{item}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Bottom Buttons */}
              <div className="p-4 space-y-3 mt-auto">
                <button
                  onClick={handleLogout}
                  className="w-full py-3.5 px-4 bg-[#FFB800] text-black font-semibold rounded-xl hover:bg-[#E5A700] active:bg-[#D4A600] transition-colors text-sm flex items-center justify-center gap-2 uppercase tracking-wide"
                >
                  <PowerIcon className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

