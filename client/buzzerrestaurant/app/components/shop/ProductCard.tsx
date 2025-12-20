'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ImageWithLoader } from '../ui/ImageWithLoader';
import { Product } from '../../types/product';
import { StarRating } from '../ui/StarRating';
import { calculateDiscount } from '../../lib/productUtils';

interface ProductCardProps {
  product: Product;
  restaurant?: Product['restaurant'];
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, restaurant, index = 0 }) => {
  const router = useRouter();
  const discount = calculateDiscount(product.price, product.originalPrice);

  const handleClick = () => {
    router.push(`/products/${product.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer"
    >
      <div className="relative aspect-square">
        {product.image ? (
          <ImageWithLoader
            src={product.image}
            alt={product.name}
            fill
            className="rounded-t-xl"
            sizes="(max-width: 768px) 50vw, 33vw"
            objectFit="cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-t-xl">
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
        {product.isFeatured && (
          <div className="absolute top-2 left-2 bg-black text-white text-xs font-semibold px-2 py-1 rounded">
            Featured
          </div>
        )}
      </div>

      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <StarRating rating={product.rate} size="sm" showNumber />
          {product.isFeatured && (
            <span className="text-xs text-gray-500">Featured</span>
          )}
        </div>

        <h3 className="font-bold text-gray-900 text-sm leading-tight">
          {product.name}
        </h3>

        {restaurant && (
          <>
            <p className="text-xs text-gray-700 font-medium">
              {restaurant.name}
            </p>
            <p className="text-xs text-[#4d0d0d] font-medium">
              {restaurant.type}
            </p>
          </>
        )}

        <div className="flex items-center justify-end gap-1">
          {discount && (
            <span className="text-xs text-gray-400 line-through">
              EGP {product.originalPrice}
            </span>
          )}
          <span className="text-base font-bold text-[#4d0d0d]">
            EGP {product.price}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

