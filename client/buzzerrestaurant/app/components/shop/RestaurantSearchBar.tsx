'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, FunnelIcon, BuildingStorefrontIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageWithLoader } from '../ui/ImageWithLoader';
import { useSearchRecommendations } from '../../hooks/useSearch';

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
  const router = useRouter();
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: recommendations, isLoading } = useSearchRecommendations(
    searchQuery,
    showRecommendations && isFocused
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowRecommendations(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setShowRecommendations(false);
      setIsFocused(false);
      onSearch();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (searchQuery.trim().length > 0) {
      setShowRecommendations(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
    if (e.target.value.trim().length > 0) {
      setShowRecommendations(true);
    } else {
      setShowRecommendations(false);
    }
  };

  const handleRestaurantClick = (restaurantId: number) => {
    setShowRecommendations(false);
    setIsFocused(false);
    router.push(`/supplier/${restaurantId}/products`);
  };

  const handleProductClick = (productId: number) => {
    setShowRecommendations(false);
    setIsFocused(false);
    router.push(`/products/${productId}`);
  };

  const hasResults = recommendations && (
    (recommendations.restaurants && recommendations.restaurants.length > 0) ||
    (recommendations.products && recommendations.products.length > 0)
  );

  return (
    <div ref={searchRef} className="relative bg-[#4d0d0d] px-4 py-3">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2">
          <FunnelIcon className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search restaurants, products..."
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 text-sm md:text-base"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowRecommendations(false);
              setIsFocused(false);
              onSearch();
            }}
            className="bg-[#FFB800] rounded-full p-2 flex items-center justify-center shrink-0"
            aria-label="Search"
          >
            <MagnifyingGlassIcon className="w-5 h-5 text-black" />
          </motion.button>
        </div>

        <AnimatePresence>
          {showRecommendations && isFocused && searchQuery.trim().length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl max-h-[500px] overflow-y-auto"
            >
              {isLoading ? (
                <div className="p-6 text-center text-gray-500">
                  <div className="w-6 h-6 border-2 border-[#4d0d0d] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm">Searching...</p>
                </div>
              ) : hasResults ? (
                <div className="py-2">
                  {/* Restaurants Section */}
                  {recommendations.restaurants && recommendations.restaurants.length > 0 && (
                    <div className="px-4 py-2">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <BuildingStorefrontIcon className="w-4 h-4" />
                        Restaurants
                      </h3>
                      {recommendations.restaurants.map((restaurant) => (
                        <motion.button
                          key={restaurant.id}
                          whileHover={{ backgroundColor: '#f9fafb' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleRestaurantClick(restaurant.id)}
                          className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-200">
                            {restaurant.imageUrl ? (
                              <ImageWithLoader
                                src={restaurant.imageUrl}
                                alt={restaurant.name}
                                fill
                                className=""
                                objectFit="cover"
                              />
                            ) : (
                              <BuildingStorefrontIcon className="w-full h-full text-gray-400 p-2" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {restaurant.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {restaurant.type} • {restaurant.location}
                            </p>
                          </div>
                          {restaurant.rating > 0 && (
                            <div className="text-xs font-medium text-[#FFB800] shrink-0">
                              ⭐ {restaurant.rating.toFixed(1)}
                            </div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* Products Section */}
                  {recommendations.products && recommendations.products.length > 0 && (
                    <div className="px-4 py-2 border-t border-gray-100">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <ShoppingBagIcon className="w-4 h-4" />
                        Products
                      </h3>
                      {recommendations.products.map((product) => (
                        <motion.button
                          key={product.id}
                          whileHover={{ backgroundColor: '#f9fafb' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleProductClick(product.id)}
                          className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-200">
                            {product.image || (product.images && product.images.length > 0) ? (
                              <ImageWithLoader
                                src={product.image || product.images[0]}
                                alt={product.name}
                                fill
                                className=""
                                objectFit="cover"
                              />
                            ) : (
                              <ShoppingBagIcon className="w-full h-full text-gray-400 p-2" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {product.category.name} • {product.restaurant.name}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-[#4d0d0d]">
                              {parseFloat(product.price).toFixed(0)} EGP
                            </p>
                            {product.rate > 0 && (
                              <p className="text-xs text-gray-500">⭐ {product.rate.toFixed(1)}</p>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <p className="text-sm">No results found</p>
                  <p className="text-xs mt-1">Try searching for restaurants or products</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

