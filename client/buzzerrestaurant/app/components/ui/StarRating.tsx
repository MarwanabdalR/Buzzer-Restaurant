'use client';

import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

interface StarRatingProps {
  rating: number | null;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = 'md',
  showNumber = false,
  className = '',
}) => {
  if (!rating) return null;

  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const sizeClass = sizeClasses[size];

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <StarIcon key={i} className={`${sizeClass} text-[#FFB800] fill-[#FFB800]`} />
    );
  }

  if (hasHalfStar) {
    stars.push(
      <StarIcon key="half" className={`${sizeClass} text-[#FFB800] fill-[#FFB800] opacity-50`} />
    );
  }

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <StarIcon key={`empty-${i}`} className={`${sizeClass} text-gray-300 fill-gray-300`} />
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {stars}
      {showNumber && (
        <span className={`${size === 'sm' ? 'text-xs' : 'text-sm'} text-gray-500 ml-1`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

