'use client';

import React from 'react';
import Image from 'next/image';
import { MapPinIcon } from '@heroicons/react/24/solid';
import { StarIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { Restaurant } from '../../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
        >
          <StarIcon className="w-4 h-4 text-[#FFB800] fill-[#FFB800]" />
        </motion.div>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <motion.div
          key="half"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: fullStars * 0.05 }}
        >
          <StarIcon className="w-4 h-4 text-[#FFB800] fill-[#FFB800] opacity-50" />
        </motion.div>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarIcon
          key={`empty-${i}`}
          className="w-4 h-4 text-gray-300 fill-gray-300"
        />
      );
    }

    return stars;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-gray-50 rounded-2xl overflow-hidden mb-4 cursor-pointer"
    >
      <div className="flex flex-row">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative w-28 h-28 shrink-0 rounded-2xl overflow-hidden"
        >
          {restaurant.imageUrl ? (
            <Image
              src={restaurant.imageUrl}
              alt={restaurant.name}
              fill
              className="object-cover"
              sizes="112px"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </motion.div>

        <div className="flex-1 px-4 py-3 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1 mb-1.5"
          >
            {renderStars(restaurant.rating)}
            <span className="text-sm font-medium text-gray-900 ml-1">
              {restaurant.rating.toFixed(1)}
            </span>
          </motion.div>

          <motion.h3
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base font-bold text-gray-900 mb-1"
          >
            {restaurant.name}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-[#4d0d0d] font-medium mb-1.5"
          >
            {restaurant.type}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-1 text-sm text-gray-700"
          >
            <MapPinIcon className="w-4 h-4 text-[#4d0d0d]" />
            <span>{restaurant.location}</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

