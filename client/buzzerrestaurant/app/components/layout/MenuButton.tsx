'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MenuButtonProps {
  onClick: () => void;
}

export const MenuButton: React.FC<MenuButtonProps> = ({ onClick }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="mr-4 p-2 text-[#D4AF37] hover:text-[#F5D76E] transition-colors active:scale-95"
      aria-label="Open menu"
      style={{ filter: 'drop-shadow(0 0 4px rgba(212, 175, 55, 0.5))' }}
    >
      <div className="flex flex-col space-y-1.5">
        <motion.div
          className="h-0.5 bg-current rounded"
          style={{ width: '20px' }}
          whileHover={{ width: '24px' }}
          transition={{ duration: 0.2 }}
        />
        <motion.div
          className="h-0.5 bg-current rounded"
          style={{ width: '24px' }}
          whileHover={{ width: '28px' }}
          transition={{ duration: 0.2 }}
        />
        <motion.div
          className="h-0.5 bg-current rounded"
          style={{ width: '18px' }}
          whileHover={{ width: '22px' }}
          transition={{ duration: 0.2 }}
        />
      </div>
    </motion.button>
  );
};

