'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface HeaderLogoProps {
  title: string;
  isHome: boolean;
}

export const HeaderLogo: React.FC<HeaderLogoProps> = ({ title, isHome }) => {
  const router = useRouter();

  const handleLogoClick = () => {
    if (!isHome) {
      router.push('/');
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleLogoClick}
      className="flex items-center flex-1"
    >
      {isHome ? (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center"
        >
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
            {title}
          </h1>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center"
        >
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
            {title}
          </h1>
        </motion.div>
      )}
    </motion.button>
  );
};

