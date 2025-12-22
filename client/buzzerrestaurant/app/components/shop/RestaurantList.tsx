'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RestaurantCard } from './RestaurantCard';
import { Restaurant } from '../../types';
import { useQueryClient } from '@tanstack/react-query';
import { useRestaurants } from '../../hooks/useRestaurant';

interface RestaurantListProps {
  restaurants: Restaurant[];
  loading: boolean;
  error: Error | null;
}

export const RestaurantList: React.FC<RestaurantListProps> = ({
  restaurants,
  loading,
  error,
}) => {
  const queryClient = useQueryClient();
  const { refetch: fetchRestaurants } = useRestaurants();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-4 border-[#4d0d0d] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="text-red-600 mb-4">
          <p className="font-semibold mb-2">Failed to load restaurants</p>
          <p className="text-sm text-gray-600">{error.message || 'Please try again.'}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => fetchRestaurants()}
          className="bg-[#4d0d0d] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#3d0a0a] transition-colors"
        >
          Retry
        </motion.button>
      </motion.div>
    );
  }

  if (!restaurants || restaurants.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 text-gray-500"
      >
        No restaurants available
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <div className="space-y-4">
        {restaurants.map((restaurant, index) => (
          <motion.div
            key={restaurant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <RestaurantCard restaurant={restaurant} />
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
};

