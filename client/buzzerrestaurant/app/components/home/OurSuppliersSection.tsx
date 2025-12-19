'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ImageWithLoader } from '../ui/ImageWithLoader';
import { MapPinIcon, StarIcon } from '@heroicons/react/24/solid';
import { Restaurant } from '../../types';

interface OurSuppliersSectionProps {
  restaurants: Restaurant[];
  loading: boolean;
}

export const OurSuppliersSection: React.FC<OurSuppliersSectionProps> = ({
  restaurants,
  loading,
}) => {
  const router = useRouter();
  const t = useTranslations('Home');
  const tCommon = useTranslations('Common');

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIcon key={i} className="w-5 h-5 text-[#FFB800] fill-[#FFB800]" />
        );
      } else {
        stars.push(
          <StarIcon key={i} className="w-5 h-5 text-gray-300 fill-gray-300" />
        );
      }
    }
    return stars;
  };

  const handleCardClick = (restaurantId: string) => {
    router.push(`/supplier/${restaurantId}/products`);
  };

  const displayRestaurants = restaurants.slice(0, 4);

  if (loading) {
    return (
      <section className="hidden md:block bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-4 border-[#4d0d0d] border-t-transparent rounded-full"
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hidden md:block bg-white py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
                 <h2 className="text-4xl font-black text-gray-900 mb-4">{t('ourRestaurants')}</h2>
          <div className="flex justify-center">
            <svg
              className="w-20 h-8 text-gray-800"
              fill="currentColor"
              viewBox="0 0 100 40"
            >
              <path d="M20 20 Q 50 5, 80 20" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </motion.div>

        {/* Restaurant Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {displayRestaurants.map((restaurant, index) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
              onClick={() => handleCardClick(restaurant.id)}
              className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all hover:shadow-xl"
            >
              {/* Circular Image */}
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                {restaurant.imageUrl ? (
                  <ImageWithLoader
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    fill
                    className="object-cover"
                    sizes="128px"
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
              </div>

              {/* Stars */}
              <div className="flex items-center justify-center gap-1 mb-3">
                {renderStars(restaurant.rating)}
              </div>

              {/* Name */}
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                {restaurant.name}
              </h3>

              {/* Type */}
              <p className="text-sm text-[#4d0d0d] font-medium text-center mb-3">
                {restaurant.type}
              </p>

              {/* Location */}
              <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                <MapPinIcon className="w-4 h-4 text-[#4d0d0d]" />
                <span className="text-center">{restaurant.location || 'Main Market Riyadh, KSA'}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/restaurants')}
            className="border-2 border-[#FFB800] text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-[#FFB800] transition-colors"

          >
                   {tCommon('viewAll')}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

