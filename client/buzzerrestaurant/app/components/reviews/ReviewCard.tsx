'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { StarRating } from '../ui/StarRating';
import { Review } from '../../types/product';

interface ReviewCardProps {
  review: Review;
  index: number;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-lg p-4 border border-gray-100"
    >
      <div className="flex items-start gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
          {review.user?.image ? (
            <Image
              src={review.user.image}
              alt={review.user.fullName || 'User'}
              fill
              className="object-cover"
              sizes="40px"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm font-medium">
                {(review.user?.fullName || 'U')[0].toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-gray-900">
              {review.user?.fullName || 'Anonymous'}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(review.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="mb-2">
            <StarRating rating={review.rating} size="sm" showNumber />
          </div>
          {review.comment && (
            <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

