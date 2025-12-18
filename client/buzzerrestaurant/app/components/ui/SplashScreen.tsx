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
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#8B2E2E] via-[#A03A3A] to-[#6B1F1F]"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center justify-center"
      >
        <Image
          src="/splash-page.png"
          alt="Buzzer Restaurant Logo"
          width={200}
          height={200}
          priority
          className="object-contain"
        />
      </motion.div>
    </motion.div>
  );
};
