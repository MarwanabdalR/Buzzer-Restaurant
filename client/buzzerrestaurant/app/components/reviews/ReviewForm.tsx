'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { useReview } from '../../hooks/useReview';
import toast from 'react-hot-toast';

interface ReviewFormProps {
  productId: number;
  onSuccess?: () => void;
  existingReview?: {
    rating: number;
    comment: string | null;
  } | null;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  onSuccess,
  existingReview,
}) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createReview } = useReview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      await createReview(productId, {
        rating,
        comment: comment.trim() || null,
      });
      toast.success(existingReview ? 'Review updated!' : 'Review submitted!');
      setComment('');
      if (!existingReview) {
        setRating(0);
      }
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        {existingReview ? 'Update Your Review' : 'Write a Review'}
      </h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
            >
              {(hoveredRating || rating) >= star ? (
                <StarIcon className="w-8 h-8 text-[#FFB800] fill-[#FFB800]" />
              ) : (
                <StarIconOutline className="w-8 h-8 text-gray-300" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Comment (Optional)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d0d0d] focus:border-transparent resize-none"
          placeholder="Share your experience..."
          maxLength={500}
        />
        <p className="text-xs text-gray-500 mt-1">{comment.length}/500</p>
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isSubmitting || rating === 0}
        className="w-full bg-[#4d0d0d] text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
      </motion.button>
    </form>
  );
};

