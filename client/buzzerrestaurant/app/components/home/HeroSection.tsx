'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, BuildingStorefrontIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useSearchRecommendations } from '../../hooks/useSearch';
import { ImageWithLoader } from '../ui/ImageWithLoader';

export const HeroSection: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('Home');
  const tCommon = useTranslations('Common');

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

  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (searchQuery.trim()) {
      setShowRecommendations(false);
      setIsFocused(false);
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (searchQuery.trim().length > 0) {
      setShowRecommendations(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim().length > 0) {
      setShowRecommendations(true);
    } else {
      setShowRecommendations(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleRestaurantClick = (restaurantId: string | number) => {
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
    <section className="hidden md:block min-h-[600px] bg-gradient-to-br from-[#1a1a1a] via-[#2d1b1b] to-[#1a1a1a] relative overflow-hidden">
      {/* Blue top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 z-10" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Section - Text and Search */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Headline */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-7xl font-black text-white leading-none"
              >
                FOOD
              </motion.h1>
              
              {/* Arrow with CAN CHANGE */}
              <div className="relative">
                <div className="flex items-center gap-4">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl text-white font-semibold"
                  >
                    CAN
                  </motion.span>
                  <motion.svg
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="w-24 h-16 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 100 60"
                  >
                    <path
                      d="M 10 30 Q 50 10, 90 30"
                      strokeLinecap="round"
                    />
                  </motion.svg>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-2xl text-white font-semibold"
                  >
                    CHANGE
                  </motion.span>
                </div>
              </div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-7xl font-black text-white leading-none"
              >
                MOOD
              </motion.h1>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-gray-300 text-lg leading-relaxed max-w-xl"
            >
              Welcome to our exquisite restaurant, where culinary expertise meets passion. Step into a world of flavors and indulgence, where we are dedicated to enhancing your dining experience and leaving you feeling satisfied.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              ref={searchRef}
              className="relative"
            >
              <form
                onSubmit={handleSearch}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-1 border border-white/20 focus-within:border-[#FFB800] focus-within:ring-2 focus-within:ring-[#FFB800]/20 transition-all"
              >
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onKeyPress={handleKeyPress}
                    placeholder={tCommon('search')}
                    className="w-full bg-transparent text-white placeholder-gray-300 px-5 py-3.5 rounded-xl border-none outline-none text-lg font-medium"
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowRecommendations(false);
                    setIsFocused(false);
                    handleSearch();
                  }}
                  className="w-12 h-12 bg-[#FFB800] rounded-xl flex items-center justify-center hover:bg-[#E5A700] transition-colors shadow-lg shadow-[#FFB800]/20"
                  aria-label="Search"
                >
                  <MagnifyingGlassIcon className="w-5 h-5 text-black" />
                </motion.button>
              </form>

              {/* Search Recommendations Dropdown */}
              <AnimatePresence>
                {showRecommendations && isFocused && searchQuery.trim().length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl max-h-[500px] overflow-y-auto z-50 border border-gray-100"
                  >
                    {isLoading ? (
                      <div className="p-8 text-center text-gray-500">
                        <div className="w-8 h-8 border-2 border-[#FFB800] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-sm font-medium">Searching...</p>
                      </div>
                    ) : hasResults ? (
                      <div className="py-3">
                        {/* Restaurants Section */}
                        {recommendations.restaurants && recommendations.restaurants.length > 0 && (
                          <div className="px-5 py-3">
                            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                              <BuildingStorefrontIcon className="w-4 h-4 text-[#4d0d0d]" />
                              Restaurants
                            </h3>
                            {recommendations.restaurants.map((restaurant) => (
                              <motion.button
                                key={restaurant.id}
                                whileHover={{ backgroundColor: '#f9fafb' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleRestaurantClick(restaurant.id)}
                                className="w-full flex items-center gap-4 p-3.5 rounded-xl text-left hover:bg-gray-50 transition-colors group"
                              >
                                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-200 ring-1 ring-gray-200 group-hover:ring-[#FFB800]/30 transition-all">
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
                          <div className="px-5 py-3 border-t border-gray-200">
                            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                              <ShoppingBagIcon className="w-4 h-4 text-[#4d0d0d]" />
                              Products
                            </h3>
                            {recommendations.products.map((product) => (
                              <motion.button
                                key={product.id}
                                whileHover={{ backgroundColor: '#f9fafb' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleProductClick(product.id)}
                                className="w-full flex items-center gap-4 p-3.5 rounded-xl text-left hover:bg-gray-50 transition-colors group"
                              >
                                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-200 ring-1 ring-gray-200 group-hover:ring-[#FFB800]/30 transition-all">
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
                                  {product.rate && product.rate > 0 && (
                                    <p className="text-xs text-gray-500">⭐ {product.rate.toFixed(1)}</p>
                                  )}
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <p className="text-sm font-medium mb-1">No results found</p>
                        <p className="text-xs text-gray-400">Try searching for restaurants or products</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* Right Section - Burger Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative h-[600px] lg:h-[700px]"
          >
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-red-800/20 to-black/50 rounded-3xl blur-3xl" />
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Burger Image - Replace with actual image path when available */}
                <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-red-900/20 via-orange-900/20 to-yellow-900/20 rounded-3xl">
                  <div className="text-center text-white/80">
                    <svg
                      className="w-64 h-64 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    <p className="text-lg font-medium">Food Image</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

