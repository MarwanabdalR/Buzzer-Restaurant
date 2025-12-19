'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../../types/product';
import { Restaurant } from '../../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  restaurant?: Restaurant | null;
  emptyMessage?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  restaurant,
  emptyMessage = 'No products available',
}) => {
  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 text-gray-500"
      >
        {emptyMessage}
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          restaurant={restaurant}
          index={index}
        />
      ))}
    </div>
  );
};

