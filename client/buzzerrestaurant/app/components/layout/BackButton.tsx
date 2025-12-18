'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface BackButtonProps {
  onClick: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="mr-4 p-2 text-white hover:text-[#F5D76E] transition-colors"
      aria-label="Go back"
    >
      <motion.svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        whileHover={{ x: -2 }}
        transition={{ duration: 0.2 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </motion.svg>
    </motion.button>
  );
};

