'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export const SplashScreen: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        if (user) {
          router.push('/');
        } else {
          router.push('/login');
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [loading, user, router]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col min-h-screen"
    >
      {/* Top Red Section with Logo */}
      <div 
        className="relative flex-1 flex items-center justify-center"
        style={{ 
          backgroundColor: '#4d0d0d',
          minHeight: '65%',
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center justify-center relative z-10"
        >
          <Image
            src="/Buzzer-Image.png"
            alt="Buzzer Restaurant Logo"
            width={200}
            height={200}
            priority
            className="object-contain"
          />
        </motion.div>

        {/* SVG Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full" style={{ lineHeight: 0, zIndex: 1 }}>
          <svg 
            data-name="Layer 1" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
            className="w-full block"
            style={{ display: 'block', width: '100%', height: 'auto' }}
          >
            <path 
              d="M741,116.23C291,117.43,0,27.57,0,6V120H1200V6C1200,27.93,1186.4,119.83,741,116.23Z" 
              className="shape-fill" 
              fill="#FFFFFF" 
              fillOpacity="1"
            />
          </svg>
        </div>
      </div>

      {/* Bottom White Section */}
      <div 
        className="w-full flex-1 relative"
        style={{ 
          backgroundColor: '#ffffff',
          minHeight: '35%',
        }}
      />
    </motion.div>
  );
};
