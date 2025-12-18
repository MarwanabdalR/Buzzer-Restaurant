'use client';

import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface RestaurantSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
}

export const RestaurantSearchBar: React.FC<RestaurantSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onSearch,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#4d0d0d] px-4 py-3"
    >
      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2">
        <FunnelIcon className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onSearch}
          className="bg-[#FFB800] rounded-full p-2 flex items-center justify-center"
        >
          <MagnifyingGlassIcon className="w-5 h-5 text-black" />
        </motion.button>
      </div>
    </motion.div>
  );
};

